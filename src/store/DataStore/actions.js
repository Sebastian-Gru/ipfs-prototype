import IPFSChat from "src/js/IPFSInstance";
import Notify from "quasar/src/plugins/Notify";
import Dialog  from 'quasar/src/plugins/Dialog'
import Router from '../../router/index';




//Hier soll IPFS Instanziiert werden.
export async function instantiateIPFS({commit, state}){

  const IPFSInstance =  await new IPFSChat();

  const  myID = await IPFSInstance.getID();

        commit('ipfsInstance', IPFSInstance);

        commit('myIDcommit', myID.id)





   state.IPFSInstance.newSubscribe('global', globalMsgHandler);
    //Neue Action aufrufen in global message Handler
   state.IPFSInstance.newSubscribe('name-service', nameServiceHandler);

   state.IPFSInstance.newSubscribe('private-chat', privateChatHandler);

   state.IPFSInstance.newSubscribe('file-sharing-by-sebastian', myOwnMessageHandler);

   state.IPFSInstance.newSubscribe('file-sharing-2-by-sebastian', myOwnFileHandler);




//Function that receives the messages
  async function globalMsgHandler (msg)  {

    console.log("msg")
    console.log(msg);

    let receivedData = msg.data.toString().split(":");

    if (receivedData.length > 1) {

      console.log("receivedData")
      console.log(receivedData);

      const imgHash = receivedData[1];


      console.log("imgHash")
      console.log(imgHash)


      const img = await IPFSInstance.getFile2(imgHash, "test.png");

      console.log("ImageBlob:")
      console.log(img);


      commit('messageCommiter', {msg, img});
    } else{
      commit('messageCommiter', {msg, img: ''});
    }


    if(state.myID !== msg.from)
      Notify.create({
        message: `New Message in Global Chat from ${msg.from}:\n ${msg.data.toString()}!`,
        position: "top-right"
      });
    console.log(msg.data.toString());
  };



  //Function that receives the names of the peers that have names
  function  nameServiceHandler (msg)  {

    //console.log("Peers!!: "+ peers);
    commit('peerName', msg)


  };




  //private Message Handler

  function privateChatHandler (msg) {
    commit('privateMessageCommiter', msg);
  }



  //Files nur an richtigen Peer schicken
  function myOwnFileHandler (msg) {

    const receivedData = msg.data.toString().split(":")

    if (msg.from !== state.myID){
    if(receivedData[2] == state.myID){

      let hash = receivedData[0];
      let name = receivedData[1];
      receivedData.push(msg.from)

        commit('fileCommiter', receivedData);

        Dialog.create({
          title: "File received",
          message: `Download: ${name}\n From ${msg.from}`,
          position: "bottom",
          cancel: true,
          persistent: true

        }).onOk(() => {
          console.log('OK')
          state.IPFSInstance.getFile(hash, name);
        }).onCancel(() => {
          console.log('Cancel')
        }).onDismiss(() => {
          console.log('Called on OK or Cancel')
        })
      }

    }
  }



  function myOwnMessageHandler (msg) {
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
        state.IPFSInstance.getFile(hash, name);
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
      let peersComing = [];

       peersComing =  await state.IPFSInstance.getPeers('name-service');

      // console.log("peersComing")
      // console.log(peersComing)

      if (peersComing && peersComing.length) {

        //if i have no peers accept everything
        if (state.peers.length === 0){
          commit('peerChange',  peersComing.map(peerID => ({ name: '', nodeid: peerID, online: true, checked: false })))

        }else {
          //else i have peers and i am not gonna empty them => adding the new ones only.
          let existingPeers = state.peers.slice();
          let existingPeersIDs = existingPeers.map(peer => peer.nodeid);


          existingPeers.forEach((x) => {
            if (!peersComing.includes(x.nodeid)) {
             x.online = false;
            }
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


    }, 2000);
  } catch (error) {
    console.warn(error);
  }

  setInterval(() => {
    if (state.myName)
      state.IPFSInstance.sendNewMsg('name-service', state.myName)
  }, 50000)

}

export function uploadFileToSelectedPeer ({commit, state}, model) {

  console.log(state.selectedPeer);

  async function  uploadFunc() {


    let hashReturn = await state.IPFSInstance.uploadFile(`file.${Math.random()}`, model);

    console.log("FileHash: " + hashReturn[1]);



      await state.IPFSInstance.sendNewMsg('file-sharing-2-by-sebastian', `${hashReturn[1]}:${model.name}:${state.selectedPeer}`);



    //state.IPFSInstance.getFile(hashReturn[1]);

    return hashReturn[0];

  }


  uploadFunc().then((value) =>{


    if(state.selectedPeer === 'global')
      state.IPFSInstance.sendNewMsg('global', `<a target="_blank" href="${value}"> ${model.name} </a>`);
    else
      state.IPFSInstance.sendNewMsg('private-chat', `${state.selectedPeer}:<a target="_blank" href="${value}"> ${model.name} </a>`);

  }).catch(err => console.log(err));

}

export  async function swarmAdresses({commit, state}) {

  const swarmAdresses = await state.IPFSInstance.swarmAdresses();

  commit( 'swarmAdressesCommit', swarmAdresses)

}

export function uploadFileToSharingPannel ({commit, state}, model) {



  const peers = state.peers.slice().filter(peer => peer.checked)

  if (!peers.length){
    Notify.create({
    message: `No Peer was selected!`,
    position: "bottom",
    type: "negative"

  });
  return
  }



  async function  uploadFunc() {


    let hashReturn = await state.IPFSInstance.uploadFile(`file.${Math.random()}`, model);

    console.log("FileHash: " + hashReturn[1]);

    return hashReturn[1];


  }

  uploadFunc().then((hash) => {

    peers.forEach((peer) => {

         state.IPFSInstance.sendNewMsg('file-sharing-2-by-sebastian', `${hash}:${model.name}:${peer.nodeid}`);

    })

    Notify.create({
      message: `Files was send succefully`,
      position: "bottom",
      type: "positive"

    });

  }).catch(err => console.log(err));



}

export async function simpleUpload({commit, state}, model) {

  let hashReturn = await state.IPFSInstance.uploadFile(`file.${Math.random()}`, model);

  console.log("FileHash: " + hashReturn[1]);

  return await hashReturn[1];

}








