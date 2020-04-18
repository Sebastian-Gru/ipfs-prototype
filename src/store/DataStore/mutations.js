import Notify from "quasar/src/plugins/Notify";
import Dialog from "quasar/src/plugins/Dialog";




export const updateUserList = (state, newUserList) => {
  state.userList = newUserList
}

export const test = (state, x) => {
  //console.log("Test " + x);

}
export const ipfsInstance = (state, ipfs, id) => {
  console.log("This is state " + state);
  console.log("This is ipfs " + state);
  console.log("This is id " + id);
  state.IPFSInstance = ipfs;
  state.myID = id;
  console.log("My ID: " +state.myID)

};

export const peerChange = (state, newPeers) => {

  state.peers = newPeers;

}

export const fileCommiter = (state, msg) => {

  let newFiles = Object.assign({}, state.allFiles);
  let data = msg.data.toString();
  let hash = data.split(':')[0];
  let name = data.slice(data.split(':')[0].length + 1);
  let currentDate = new Date();
  let dateString = `${currentDate.getDate()}-${currentDate.getMonth() + 1}-${currentDate.getFullYear()}    ${currentDate.getHours()}:${currentDate.getMinutes()}`;

  if (msg.from !== state.myID) {
    newFiles['global'].push({
      from: msg.from,
      hash: hash,
      date: dateString,
      name: name
    });
  }
}

export const myIDcommit= (state, myID) => {
  state.myID = myID;

}

export const messageCommiter = (state, {msg, ns} ) => {

  let newMessages = Object.assign({}, state.allMessages);
  let currentDate = new Date();
  let dateString = `${currentDate.getDate()}-${currentDate.getMonth() + 1}-${currentDate.getFullYear()}    ${currentDate.getHours()}:${currentDate.getMinutes()}`;


  newMessages['global'].push({
    from: msg.from,
    data: msg.data.toString(),
    date: dateString
  });


 // state.allMessages = newMessages;

};


export const peerName = (state, msg) => {

  let senderID = msg.from;
  let senderName = msg.data.toString();


  let peers = state.peers.slice();
  peers.forEach(peer => {
    if (peer.name == '' && peer.nodeid == senderID) {
      peer.name = senderName;
    }
  });
  state.peers = peers;
}

export const myNameChange = (state, myName) => {

  console.log("myName: "+ myName);

  state.myName = myName;

}

export const changeSelectedPeer = (state, selected) => {
  console.log(selected);
  state.selectedPeer = selected;
}

export const privateMessageCommiter = (state, msg) => {

  console.log("Private Message incoming");
  let senderID = msg.from;
  let data = msg.data.toString();
  let receiverID = data.split(':')[0];
  let theMsg = data.slice(data.split(':')[0].length+1)
  console.log(
    "Data:" + data +
    " " +
    "| receiverID: "+ receiverID +
    " " +
    "| theMsg: " + theMsg
  )

  const myID = state.myID;
  console.log("my ID: " +state.myID + " senderID: " + senderID
  )


  // if someone send a message for me
  if(receiverID == myID){


    let existingAllMessags = Object.assign({}, state.allMessages);

    if(!existingAllMessags[senderID])
      existingAllMessags[senderID]=[];

    let currentDate = new Date();
    let dateString = `${currentDate.getDate()}-${currentDate.getMonth() + 1}-${currentDate.getFullYear()}    ${currentDate.getHours()}:${currentDate.getMinutes()}`;

    existingAllMessags[senderID].push({
      from: mapNodeIDToName(senderID, state.peers),
      data: theMsg,
      date: dateString,
      mine: false
    });

    Notify.create({
      message: `New Message from ${existingAllMessags[senderID][existingAllMessags[senderID].length-1].from}: ${existingAllMessags[senderID][existingAllMessags[senderID].length-1].data}`,
      position: 'top-right'
    })

    state.allMessages = existingAllMessags;

  }

  // if i'm the sender
  else if(senderID == myID){
    let existingAllMessags = Object.assign({}, state.allMessages);

    if(!existingAllMessags[receiverID])
      existingAllMessags[receiverID]=[];

    let currentDate = new Date();
    let dateString = `${currentDate.getDate()}-${currentDate.getMonth() + 1}-${currentDate.getFullYear()}    ${currentDate.getHours()}:${currentDate.getMinutes()}`;

    existingAllMessags[receiverID].push({
      from: state.myName? state.myName : state.myID,
      data: theMsg,
      date: dateString,
      mine: true
    });

    console.log(state.allMessages[state.selectedPeer]);
    state.allMessages = existingAllMessags;

  }

};

const mapNodeIDToName = (nodeid, peers) =>  {

  for (let i = peers.length - 1; i >= 0; i--) {
    if (peers[i]['nodeid'] == nodeid && peers[i]['name'].length > 0) return peers[i]['name']
  }
  return nodeid;
}

const changeSelected = (selected) => {
  console.log(selected);
}






