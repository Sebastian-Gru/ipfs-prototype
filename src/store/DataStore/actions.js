import IPFSChat from "src/js/IPFSChat";

export function someAction ({ commit },context) {

  console.log("Hello, this is context: "+ context);

}

export function anotherFunction({ commit },context) {

  console.log("Moin");
   let x = "Moinsen from anotherFunction"

  commit('test', x);

}

//Hier soll IPFS Instanziiert werden.
export function instantiateIPFS({commit, state}){

  let IPFSChatInstance = new IPFSChat();
  let myID;

  IPFSChatInstance.getID()
    .then(myID => {
        myID = myID ;
        commit('myIDcommit', myID)
    })
    .then(() => {
      IPFSChatInstance.newSubscribe('global', globalMsgHandler);
      //Neue Action aufrufen in global message Hanbdler
      IPFSChatInstance.newSubscribe('name-service', nameServiceHandler);
      IPFSChatInstance.newSubscribe('private-chat', privateChatHandler);
    });

  commit('ipfsInstance', IPFSChatInstance);

//Function that receives the messages
  const globalMsgHandler = (msg) =>  {

    // console.log('globalMsgHandler received', msg.data.toString(), 'from', msg.from)
    // this.scrollDownTheMsgs();
    console.log("MSG: "+ msg);
    let newMessages = Object.assign({}, state.allMessages);
    let currentDate = new Date();
    let dateString = `${currentDate.getDate()}-${currentDate.getMonth() + 1}-${currentDate.getFullYear()}    ${currentDate.getHours()}:${currentDate.getMinutes()}`;

    newMessages['global'].push({
      from: msg.from,
      data: msg.data.toString(),
      date: dateString
    });

    commit('messageCommiter', newMessages);
    // this.allMessages = newMessages;
    console.log(newMessages);
   // return { allMessages: newMessages }

  }
  //Function that receives the names of the peers that have names
 const  nameServiceHandler = (msg) =>  {
    let senderID = msg.from;
    let senderName = msg.data.toString();


    let peers = state.peers.slice();
    peers.forEach(peer => {
      if (peer.name == '' && peer.nodeid == senderID) {
        peer.name = senderName;
      }
    });
    console.log("Peers!!: "+ peers);
    commit('peerName', peers)

  }




  //private Message Handler

  const privateChatHandler = (msg) => {
    let senderID = msg.from;
    let data = msg.data.toString();
    let receiverID = data.split(':')[0];
    let theMsg = data.slice(data.split(':')[0].length+1)

    const {myID} = state.myID;

    // if someone send a message for me
    if(receiverID && theMsg && receiverID == myID){


      let existingAllMessags = Object.assign({}, state.allMessages);

      if(!existingAllMessags[senderID])
        existingAllMessags[senderID]=[];

      let currentDate = new Date();
      let dateString = `${currentDate.getDate()}-${currentDate.getMonth() + 1}-${currentDate.getFullYear()}    ${currentDate.getHours()}:${currentDate.getMinutes()}`;

      existingAllMessags[senderID].push({
        from: this.mapNodeIDToName(senderID),
        data: theMsg,
        date: dateString,
        mine: false
      });

      commit('messageCommiter', existingAllMessags);



    }

    // if i'm the sender
    else if(receiverID && theMsg && senderID == myID){



      let existingAllMessags = Object.assign({}, this.allMessages);

      if(!existingAllMessags[receiverID])
        existingAllMessags[receiverID]=[];

      let currentDate = new Date();
      let dateString = `${currentDate.getDate()}-${currentDate.getMonth() + 1}-${currentDate.getFullYear()}    ${currentDate.getHours()}:${currentDate.getMinutes()}`;

      existingAllMessags[receiverID].push({
        from: this.mapNodeIDToName(receiverID),
        data: theMsg,
        date: dateString,
        mine: true
      });

      commit('messageCommiter', existingAllMessags);


    }
  }


  const mapNodeIDToName = (nodeid) =>  {
    let {peers} = state.peers;
    for (let i = peers.length - 1; i >= 0; i--) {
      if (peers[i]['nodeid'] == nodeid && peers[i]['name'].length > 0) return peers[i]['name']
    }
    return nodeid;
  }



}


export function intervallIPFS({commit, state}) {

  try {
    setInterval(async () => {

      let peersComing = await state.IPFSChatInstance.getPeers('global');
      if (peersComing && peersComing.length) {

        //if i have no peers accept everything
        if (state.peers.length == 0)

          commit('peerChange',  peersComing.map(peerID => ({ name: '', nodeid: peerID })))


        //else i have peers and i am not gonna empty them => adding the new ones only.
        let existingPeers = state.peers.slice();
        let existingPeersIDs = existingPeers.map(peer => peer.nodeid);

        peersComing.forEach(peerID => {
          if (existingPeersIDs.indexOf(peerID) == -1) {
            existingPeers.push({ name: '', nodeid: peerID })
          }
        });
        // console.log("existingPeers: "+existingPeers);
        //this.peers.push(existingPeers);
        if(state.peers != existingPeers)
        commit('peerChange',  existingPeers)

      }

    }, 3000);
  } catch (error) {
    console.warn(error);
  }

  setInterval(() => {
    if (state.myName)
      state.IPFSChatInstance.sendNewMsg('name-service', state.myName)
  }, 5000)

}





