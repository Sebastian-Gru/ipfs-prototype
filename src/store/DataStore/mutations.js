import Notify from "quasar/src/plugins/Notify";

export const ipfsInstance = (state, ipfs, id) => {
  state.IPFSInstance = ipfs;
  state.myID = id;
};

export const peerChange = (state, newPeers) => {
  state.peers = newPeers;
};
export const peerChange2 = (state, peersComing) => {
  let existingPeers = state.peers;
  existingPeers.slice();
  let existingPeersIDs = existingPeers.map((peer) => peer.nodeid);
  existingPeers.forEach((x) => {
    x.online = state.pingArray.includes(x.nodeid);
  });

  peersComing.forEach((peerID) => {
    if (existingPeersIDs.indexOf(peerID) === -1) {
      existingPeers.push({
        name: "",
        nodeid: peerID,
        online: true,
        checked: false,
      });
    }
  });
  existingPeers.sort(function (a, b) {
    return b.online - a.online;
  });

  if (state.peers !== existingPeers) state.peers = existingPeers;
  state.pingArray = [];
};

export const changeChecked = (state, user) => {
  let peers = state.peers.slice();
  peers.forEach((peer) => {
    if (peer.nodeid === user) {
      peer.checked = !peer.checked;
    }
  });
  state.peers = peers;
};

export const fileCommiter = (state, receivedData) => {
  let newFiles = Object.assign({}, state.allFiles);
  let hash = receivedData[0];
  let name = receivedData[1];
  let currentDate = new Date();
  let dateString = `${currentDate.getDate()}-${
    currentDate.getMonth() + 1
  }-${currentDate.getFullYear()}    ${currentDate.getHours()}:${currentDate.getMinutes()}`;

  newFiles["global"].push({
    from: receivedData[3],
    hash: hash,
    date: dateString,
    name: name,
  });
};

export const myIDcommit = (state, myID) => {
  state.myID = myID;
};

export const messageCommiter = (state, { msg, img }) => {
  let newMessages = Object.assign({}, state.allMessages);
  let currentDate = new Date();
  let dateString = `${currentDate.getDate()}-${
    currentDate.getMonth() + 1
  }-${currentDate.getFullYear()}    ${currentDate.getHours()}:${currentDate.getMinutes()}`;

  newMessages["global"].push({
    from: msg.from,
    data: msg.data.toString().split(":")[0],
    date: dateString,
    img: img,
  });
};

export const peerName = (state, msg) => {
  let senderID = msg.from;
  let senderName = msg.data.toString();

  let peers = state.peers.slice();
  peers.forEach((peer) => {
    if (peer.name === "" && peer.nodeid === senderID) {
      peer.name = senderName;
    }
  });
  state.peers = peers;
};

export const myNameChange = (state, myName) => {
  state.myName = myName;
};

export const changeSelectedPeer = (state, selected) => {
  console.log(selected);
  state.selectedPeer = selected;
};

export const privateMessageCommiter = (state, msg) => {
  console.log("Private Message incoming");
  let senderID = msg.from;
  let data = msg.data.toString();
  let receiverID = data.split(":")[0];
  let theMsg = data.slice(data.split(":")[0].length + 1);
  const myID = state.myID;
  // if someone send a message for me
  if (receiverID === myID) {
    let existingAllMessags = Object.assign({}, state.allMessages);

    if (!existingAllMessags[senderID]) existingAllMessags[senderID] = [];

    let currentDate = new Date();
    let dateString = `${currentDate.getDate()}-${
      currentDate.getMonth() + 1
    }-${currentDate.getFullYear()}    ${currentDate.getHours()}:${currentDate.getMinutes()}`;

    existingAllMessags[senderID].push({
      from: mapNodeIDToName(senderID, state.peers),
      data: theMsg,
      date: dateString,
      mine: false,
    });

    Notify.create({
      message: `New Message from ${
        existingAllMessags[senderID][existingAllMessags[senderID].length - 1]
          .from
      }: ${
        existingAllMessags[senderID][existingAllMessags[senderID].length - 1]
          .data
      }`,
      position: "top-right",
    });

    state.allMessages = existingAllMessags;
  }

  // if i'm the sender
  else if (senderID === myID) {
    let existingAllMessags = Object.assign({}, state.allMessages);

    if (!existingAllMessags[receiverID]) existingAllMessags[receiverID] = [];

    let currentDate = new Date();
    let dateString = `${currentDate.getDate()}-${
      currentDate.getMonth() + 1
    }-${currentDate.getFullYear()}    ${currentDate.getHours()}:${currentDate.getMinutes()}`;

    existingAllMessags[receiverID].push({
      from: state.myName ? state.myName : state.myID,
      data: theMsg,
      date: dateString,
      mine: true,
    });

    state.allMessages = existingAllMessags;
  }
};

const mapNodeIDToName = (nodeid, peers) => {
  for (let i = peers.length - 1; i >= 0; i--) {
    if (peers[i]["nodeid"] === nodeid && peers[i]["name"].length > 0)
      return peers[i]["name"];
  }
  return nodeid;
};

export const swarmAdressesCommit = (state, swarmAdresses) => {
  state.swarmAdresses = swarmAdresses
    .map((info) => {
      return info.addrs;
    })
    .map((addr) => {
      return addr.toString();
    });
};
export const statsCommit = (state, stats) => {
  state.stats = stats;
};

export const pingArrayCommiter = (state, newPing) => {
  if (!state.pingArray.includes(newPing.from))
    state.pingArray.push(newPing.from);
};
