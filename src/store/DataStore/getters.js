export function userListGetter(state) {
  return state.userList;
}

export function messageGetter(state) {
  return state.allMessages;
}

export function peerGetter(state) {
  return state.peers;
}
export function IPFSInstanceGetter(state) {
  return state.IPFSInstance;
}

export function myIDGetter(state) {
  return state.myID;
}
export function myNameGetter(state) {
  return state.myName;
}
export function currentMsgGetter(state) {
  return state.currentMsg;
}
export function selectedPeerGetter(state) {
  return state.selectedPeer;
}

export function fileGetter(state) {
  return state.allFiles;
}

export function swarmAdressesGetter(state) {
  return state.swarmAdresses;
}
export function statsGetter(state) {
  return state.stats;
}
