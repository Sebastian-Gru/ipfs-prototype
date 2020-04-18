import IPFS from 'ipfs';
import BufferPackage from 'buffer';
import { saveAs } from 'file-saver';
const Buffer = BufferPackage.Buffer;





let node = null;

async function IPFSInstance() {

  this.ready = false;

    node =  await IPFS.create({
      repo: 'ipfs-' + Math.random(),
      config: {
        Addresses: {
          Swarm: [
            // This is a public webrtc-star server
            //'/dns4/star-signal.cloud.ipfs.team/tcp/443/wss/p2p-webrtc-star'
            //'/dns4/ws-star.discovery.libp2p.io/tcp/443/wss/p2p-webrtc-star',
             "/dns4/ws-star.discovery.libp2p.io/tcp/443/wss/p2p-websocket-star"
            // "/dns4/ws-star-signal-1.servep2p.com/tcp/443/wss/p2p-websocket-star/"
            // '/dns4/ws-star.discovery.libp2p.io/tcp/443/wss/p2p-websocket-star'
            // '/ip4/127.0.0.1/tcp/13579/wss/p2p-webrtc-star'


            //'/ip4/127.0.0.1/tcp/13579/wss/p2p-webrtc-star'
          ]

        },
        // If you want to connect to the public bootstrap nodes, remove the next line
       // Bootstrap: []
      },
    });




    async function uploadFile(fileName, fileContent){

    	if(!this.ready) return;

    	  const filesAdded = await node.add({
            path: fileName,
            content: fileContent
        });

		  console.log('file link',`https://ipfs.io/ipfs/${filesAdded[0].hash}`);


      return [`https://ipfs.io/ipfs/${filesAdded[0].hash}`, filesAdded[0].hash];

    }

    async function getID() {
        this.ready = true
        return await node.id();
    }

    // function newSubscribe(topic, receiveMsg) {
    //     if (!this.ready) return;
    //
    //     node.pubsub.subscribe(topic, receiveMsg, (error) => {
    //         if (error) {
    //             console.error(`failed to subscribe to ${topic}, ${error}`)
    //         }
    //         console.log(`subscribed to ${topic}`)
    //     })
    //
    // }

   const newSubscribe =  (topic, receiveMsg) => {
     node.pubsub.subscribe(topic, receiveMsg)
     console.log(`Subscribed to workspace ${topic}`)
  };

    async function getPeers(topic) {

      console.log(node);
      console.log(topic);
      const peers = await node.pubsub.peers('global');
      //const peers = await node.swarm.peers();
      //const filterPeers = peers.map(x => x.peer);
      const topics = await node.pubsub.ls()
      console.log(topics)
      console.log(peers)

      return peers;

    }


   async  function sendNewMsg(topic, newMsg) {



        console.log("Message is beeing send!");
        //console.log('sendNewMsg received: ', newMsg)
        const msg = Buffer.from(newMsg);

        return await node.pubsub.publish(topic, msg)



    }

    async function getFile (hash, name) {



        const file = await node.get(hash);

            const content = Buffer(await file[0].content)

            await appendFile(  name,  content)

      }

  function appendFile (name, data) {
    const file = new window.Blob([data], { type: 'application/octet-binary' })
    const url = window.URL.createObjectURL(file)

    console.log("AppendFile::::::");
    console.log(url);
    saveAs(url, name);

  }



    return {
        newSubscribe,
        getID,
        getPeers,
        sendNewMsg,
        uploadFile,
        getFile
    }
}

export default IPFSInstance;
