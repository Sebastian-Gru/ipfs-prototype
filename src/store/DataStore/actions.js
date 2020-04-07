import IPFSChat from "src/js/IPFSChat";
import {mapGetters} from "vuex";

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
      IPFSChatInstance.newSubscribe('global', this.globalMsgHandler)
      //Neue Action aufrufen in global message Hanbdler
      IPFSChatInstance.newSubscribe('name-servicex1xy', this.nameServiceHandler)
      IPFSChatInstance.newSubscribe('private-chat', this.privateChatHandler)
    });

  commit('ipfsInstance', IPFSChatInstance);

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





