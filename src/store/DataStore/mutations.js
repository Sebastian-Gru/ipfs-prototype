
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

export const messageCommiter = (state, message) => {
  state.allMessages = message;
}



