import IPFSInstance from "src/js/IPFSInstance";
import Notify from "quasar/src/plugins/Notify";
import Dialog  from 'quasar/src/plugins/Dialog'

export function someAction ({ commit },context) {

  console.log("Hello, this is context: "+ context);

}



//Hier soll IPFS Instanziiert werden.
export function instantiateIPFS({commit, state}){

  let IPFSChatInstance = new IPFSInstance();

  IPFSChatInstance.getID()
    .then(myID => {
        commit('myIDcommit', myID)
    })
    .then(() => {
      IPFSChatInstance.newSubscribe('global', globalMsgHandler);
      //Neue Action aufrufen in global message Handler
      IPFSChatInstance.newSubscribe('name-service', nameServiceHandler);

      IPFSChatInstance.newSubscribe('private-chat', privateChatHandler);

      IPFSChatInstance.newSubscribe('file-sharing-by-sebastian', myOwnMessageHandler);

      IPFSChatInstance.newSubscribe('file-sharing-2-by-sebastian', myOwnFileHandler);

    }).catch(e=>{
      console.log(e);
  });

  commit('ipfsInstance', IPFSChatInstance);

//Function that receives the messages
  const globalMsgHandler = (msg) =>  {

    commit('messageCommiter', {msg, ns: 'global'});
    if(state.myID !== msg.from)
    Notify.create({
      message: `New Message in Global Chat from ${msg.from}:\n ${msg.data.toString()}!`,
      position: "top-right"
    })
  };



  //Function that receives the names of the peers that have names
 const  nameServiceHandler = (msg) =>  {

    //console.log("Peers!!: "+ peers);
    commit('peerName', msg)


  };




  //private Message Handler

  const privateChatHandler = (msg) => {
    commit('privateMessageCommiter', msg);
  }

  const myOwnFileHandler = (msg) => {


    let data = msg.data.toString();
    if(data.split(':')[0] == state.myID){

      let hash = data.split(':')[1].length+1;
      let name = data.slice(data.split(':')[2].length+1)
      if (msg.from !== state.myID){

        commit('fileCommiter', msg);

        Dialog.create({
          title: "File received",
          message: `Download: ${name} from ${msg.from}`,
          position: "bottom",
          cancel: true,
          persistent: true

        }).onOk(() => {
          console.log('OK')
          state.IPFSChatInstance.getFile(hash, name);
        }).onCancel(() => {
          console.log('Cancel')
        }).onDismiss(() => {
          console.log('Called on OK or Cancel')
        })
      }


    }


  }

  const myOwnMessageHandler = (msg) => {
    //hier kommt hoffentlich der Hash an.
    console.log("myOwnMessageHandler::: " + msg.data.toString());
    let data = msg.data.toString();
    let hash = data.split(':')[0];
    let name = data.slice(data.split(':')[0].length+1)
    if (msg.from !== state.myID){

      commit('fileCommiter', msg);

      Dialog.create({
        title: "File received",
        message: `Download: ${name} from ${msg.from}`,
        position: "bottom",
        cancel: true,
        persistent: true

      }).onOk(() => {
        console.log('OK')
        state.IPFSChatInstance.getFile(hash, name);
      }).onCancel(() => {
        console.log('Cancel')
      }).onDismiss(() => {
        console.log('Called on OK or Cancel')
      })
    }
  }
}


export function intervallIPFS({commit, state}) {

  try {
    setInterval(async () => {

      let peersComing = await state.IPFSChatInstance.getPeers('global');
      if (peersComing && peersComing.length) {

        //if i have no peers accept everything
        if (state.peers.length === 0){
          commit('peerChange',  peersComing.map(peerID => ({ name: '', nodeid: peerID, online: true, checked: false })))

        }else {
          //else i have peers and i am not gonna empty them => adding the new ones only.
          let existingPeers = state.peers.slice();
          let existingPeersIDs = existingPeers.map(peer => peer.nodeid);

          existingPeers.map((x) => {
            if (!peersComing.includes(x.nodeid)) return x.online = false;
          });

          peersComing.forEach(peerID => {
            if (existingPeersIDs.indexOf(peerID) === -1) {
              existingPeers.push({ name: '', nodeid: peerID, online: true, checked: false })
            }
          });
          existingPeers.sort(function(a, b){
            return b.online-a.online
          })

          if(state.peers !== existingPeers)
            commit('peerChange',  existingPeers)

        }

        }


    }, 10000);
  } catch (error) {
    console.warn(error);
  }

  setInterval(() => {
    if (state.myName)
      state.IPFSChatInstance.sendNewMsg('name-service', state.myName)
  }, 50000)

}

export function uploadFile ({commit, state}, model) {

  async function  uploadFunc() {


    let hashReturn = await state.IPFSChatInstance.uploadFile(`file.${Math.random()}`, model);

    console.log("FileHash: " + hashReturn[1]);


    state.IPFSChatInstance.sendNewMsg('file-sharing-by-sebastian', `${hashReturn[1]}:${model.name}`);

    //state.IPFSChatInstance.getFile(hashReturn[1]);

    return hashReturn[0];

  }


  uploadFunc().then((value) =>{


    if(state.selectedPeer === 'global')
      state.IPFSChatInstance.sendNewMsg('global', `<a target="_blank" href="${value}"> ${model.name} </a>`);
    else
      state.IPFSChatInstance.sendNewMsg('private-chat', `${state.selectedPeer}:<a target="_blank" href="${value}"> ${model.name} </a>`);

  }).catch(err => console.log(err));

}

export function uploadFileToSharingPannel ({commit, state}, model) {


  async function  uploadFunc() {


    let hashReturn = await state.IPFSChatInstance.uploadFile(`file.${Math.random()}`, model);

    console.log("FileHash: " + hashReturn[1]);

    state.peers.forEach((peer) => {
      if (peer.selected){
        state.IPFSChatInstance.sendNewMsg('file-sharing-2-by-sebastian', `${peer.selected}:${hashReturn[1]}:${model.name}`);
      }
      });

  }


  uploadFunc().catch(err => console.log(err));

}








