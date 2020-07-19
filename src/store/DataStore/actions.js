import IPFSChat from "src/js/IPFSInstance";
import Notify from "quasar/src/plugins/Notify";
import Dialog from "quasar/src/plugins/Dialog";

//Hier soll IPFS Instanziiert werden.
export async function instantiateIPFS({ commit, state }) {
  const IPFSInstance = await new IPFSChat();

  const myID = await IPFSInstance.getID();

  commit("ipfsInstance", IPFSInstance);

  commit("myIDcommit", myID.id);

  state.IPFSInstance.newSubscribe("global", globalMsgHandler);
  state.IPFSInstance.newSubscribe("name-service", nameServiceHandler);
  state.IPFSInstance.newSubscribe("private-chat", privateChatHandler);

  state.IPFSInstance.newSubscribe(
    "file-sharing-by-sebastian",
    myOwnMessageHandler
  );

  state.IPFSInstance.newSubscribe(
    "file-sharing-2-by-sebastian",
    myOwnFileHandler
  );

  state.IPFSInstance.newSubscribe("peerIsStillOnline", onlineHandler);

  //Function that receives the messages
  async function globalMsgHandler(msg) {
    let receivedData = msg.data.toString().split(":");

    if (receivedData.length > 1) {
      const imgHash = receivedData[1];

      const img = await IPFSInstance.uploadGlobalFeedFile(imgHash);

      commit("messageCommiter", { msg, img });
    } else {
      commit("messageCommiter", { msg, img: "" });
    }

    if (state.myID !== msg.from)
      Notify.create({
        message: `New Message in Global Chat from ${
          msg.from
        }:\n ${msg.data.toString()}!`,
        position: "top-right",
      });
    console.log(msg.data.toString());
  }

  //Function that receives the names of the peers that have names
  function nameServiceHandler(msg) {
    commit("peerName", msg);
  }
  function onlineHandler(msg) {
    commit("pingArrayCommiter", msg);
  }

  //private Message Handler
  function privateChatHandler(msg) {
    commit("privateMessageCommiter", msg);
  }

  //Files nur an richtigen Peer schicken
  function myOwnFileHandler(msg) {
    const receivedData = msg.data.toString().split(":");

    if (msg.from !== state.myID) {
      if (receivedData[2] === state.myID) {
        let hash = receivedData[0];
        let name = receivedData[1];
        receivedData.push(msg.from);

        commit("fileCommiter", receivedData);

        Dialog.create({
          title: "File received",
          message: `Download: ${name}\n From ${msg.from}`,
          position: "bottom",
          cancel: true,
          persistent: true,
        })
          .onOk(() => {
            console.log("OK");
            state.IPFSInstance.getFile(hash, name);
          })
          .onCancel(() => {
            console.log("Cancel");
          })
          .onDismiss(() => {
            console.log("Called on OK or Cancel");
          });
      }
    }
  }

  function myOwnMessageHandler(msg) {
    let data = msg.data.toString();
    let hash = data.split(":")[0];
    let name = data.slice(data.split(":")[0].length + 1);
    if (msg.from !== state.myID) {
      commit("fileCommiter", msg);

      Dialog.create({
        title: "File received",
        message: `Download: ${name} from ${msg.from}`,
        position: "bottom",
        cancel: true,
        persistent: true,
      })
        .onOk(() => {
          console.log("OK");
          state.IPFSInstance.getFile(hash, name);
        })
        .onCancel(() => {
          console.log("Cancel");
        })
        .onDismiss(() => {
          console.log("Called on OK or Cancel");
        });
    }
  }
}

export function intervallIPFS({ commit, state }) {
  try {
    setInterval(async () => {
      let peersComing = await state.IPFSInstance.getPeers("name-service");

      if (peersComing && peersComing.length) {
        //if i have no peers accept everything
        if (state.peers.length === 0) {
          commit(
            "peerChange",
            peersComing.map((peerID) => ({
              name: "",
              nodeid: peerID,
              online: true,
              checked: false,
            }))
          );
        } else {
          commit("peerChange2", peersComing);
        }
      }
    }, 35000);
  } catch (error) {
    console.warn(error);
  }

  setInterval(() => {
    if (state.myName)
      state.IPFSInstance.sendNewMsg("name-service", state.myName);
  }, 50000);

  //Send alive Signal
  setInterval(() => {
    state.IPFSInstance.sendNewMsg("peerIsStillOnline", "x");
  }, 3000);
}

export function uploadFileToSelectedPeer({ commit, state }, model) {
  async function uploadFunc() {
    let hashReturn = await state.IPFSInstance.uploadFile(
      `file.${Math.random()}`,
      model
    );

    await state.IPFSInstance.sendNewMsg(
      "file-sharing-2-by-sebastian",
      `${hashReturn[1]}:${model.name}:${state.selectedPeer}`
    );
    return hashReturn[0];
  }

  uploadFunc()
    .then((value) => {
      if (state.selectedPeer === "global")
        state.IPFSInstance.sendNewMsg(
          "global",
          `<a target="_blank" href="${value}"> ${model.name} </a>`
        );
      else
        state.IPFSInstance.sendNewMsg(
          "private-chat",
          `${state.selectedPeer}:<a target="_blank" href="${value}"> ${model.name} </a>`
        );
    })
    .catch((err) => console.log(err));
}

export async function swarmAdresses({ commit, state }) {
  const swarmAdresses = await state.IPFSInstance.swarmAdresses();

  commit("swarmAdressesCommit", swarmAdresses);
}

export async function statsBtn({ commit, state }) {
  const stats = await state.IPFSInstance.stats();

  commit("statsCommit", stats);
}

export function uploadFileToSharingPannel({ commit, state }, model) {
  const peers = state.peers.slice().filter((peer) => peer.checked);

  if (!peers.length) {
    Notify.create({
      message: `No Peer was selected!`,
      position: "bottom",
      type: "negative",
    });
    return;
  }

  async function uploadFunc() {
    let hashReturn = await state.IPFSInstance.uploadFile(
      `file.${Math.random()}`,
      model
    );

    return hashReturn[1];
  }

  uploadFunc()
    .then((hash) => {
      peers.forEach((peer) => {
        state.IPFSInstance.sendNewMsg(
          "file-sharing-2-by-sebastian",
          `${hash}:${model.name}:${peer.nodeid}`
        );
      });

      Notify.create({
        message: `Files was send succefully`,
        position: "bottom",
        type: "positive",
      });
    })
    .catch((err) => console.log(err));
}

export async function simpleUpload({ commit, state }, model) {
  let hashReturn = await state.IPFSInstance.uploadFile(
    `file.${Math.random()}`,
    model
  );

  console.log("FileHash: " + hashReturn[1]);

  return await hashReturn[1];
}

export async function reconnectToPeers({ commit, state }) {
  state.peers.forEach((x) => {
    if (!x.online) {
      state.IPFSInstance.reconnect(x.nodeid);
    }
  });

  Notify.create({
    message: `Trying to reconnect to all Offline peers (can take up to 25 seconds)!`,
    position: "bottom",
  });
}
