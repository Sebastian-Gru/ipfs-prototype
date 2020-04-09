



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
  state.IPFSChatInstance = ipfs;
  state.myID = id;
  console.log("My ID: " +state.myID)

};

export const peerChange = (state, newPeers) => {

  state.peers = newPeers;

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




