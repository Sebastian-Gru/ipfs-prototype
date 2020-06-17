import IPFS from 'ipfs';
import BufferPackage from 'buffer';
import { saveAs } from 'file-saver';
const Buffer = BufferPackage.Buffer;
const BufferList = require('bl/BufferList');
const all = require('it-all')
const Room = require('ipfs-pubsub-room')







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
            // '/dns4/ws-star.discovery.libp2p.io/tcp/443/wss/p2p-webrtc-star',
            //  "/dns4/ws-star.discovery.libp2p.io/tcp/443/wss/p2p-websocket-star"
            // "/dns4/ws-star-signal-1.servep2p.com/tcp/443/wss/p2p-websocket-star/"
            // '/dns4/ws-star.discovery.libp2p.io/tcp/443/wss/p2p-websocket-star'
          // '/ip4/127.0.0.1/tcp/13579/wss/p2p-webrtc-star',
           // '/dns4/5ab5c241.ngrok.io/tcp/80/ws/p2p-webrtc-star/'
           // '/ip4/185.113.124.221/tcp/13579/ws/p2p-webrtc-star/'
            '/dns4/ipfs-webrtc-singalling-server.herokuapp.com/tcp/443/wss/p2p-webrtc-star/'


            // '/ip4/192.168.178.82/tcp/13579/wss/p2p-webrtc-star'
            // '/dns4/star-signal.cloud.ipfs.team/wss/p2p-webrtc-star'
          ]

        },
        // If you want to connect to the public bootstrap nodes, remove the next line
        // Bootstrap: [
        //   // '/ip4/127.0.0.1/tcp/4001/ipfs/QmQYtnM6PZjHjVYbWSLAk1FNtJFf4dP8NaHfg5a42huPb4'
        // ]
      },
    });

   const room = new Room(node, 'global');

  room.on('peer joined', (peer) => {
    console.log('Peer joined the room', peer)
  })

  room.on('peer left', (peer) => {
    console.log('Peer left...', peer)
  })

// now started to listen to room
  room.on('subscribed', () => {
    console.log('Now connected!')
  })



// When a peer joins the topic

    async function uploadFile(fileName, fileContent){

    	if(!this.ready) return;

    	console.log(fileName + fileContent)
    	  // const filesAdded = await node.add({
        //     path: fileName,
        //     content: fileContent
        // });

      for await (const result of node.add(fileContent)) {

        if(result)
        return [`https://ipfs.io/ipfs/${result.path}`, result.path];

      }

    	//   console.log(filesAdded);
      //
		  // console.log('file link',`https://ipfs.io/ipfs/${filesAdded[0].hash}`);


      //return [`https://ipfs.io/ipfs/${filesAdded[0].hash}`, filesAdded[0].hash];

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

     const getPeers = async (topic) => {


       const peerIds = await  node.pubsub.peers(topic);

       return peerIds;

    };


   async  function sendNewMsg(topic, newMsg) {



        //console.log('sendNewMsg received: ', newMsg)
        const msg = Buffer.from(newMsg);

        //return await node.pubsub.publish(topic, msg)
        node.pubsub.publish(topic, msg)



    }

    async function getFile (hash, name) {

        // const file = await node.get(hash);
        //
        //     const content = Buffer(await file[0].content)
        //
        //     await appendFile(  name,  content)

        // for await (const file of node.get(hash)) {
        //   console.log(file.path);
        //
        //   const content = new BufferList();
        //   for await (const chunk of file.content) {
        //     content.append(chunk)
        //   }
        //
        //   appendFile(name, content.toString())
        // }

      for await (const file of node.get(hash)) {
        if (file.content) {
          const content = Buffer.concat(await all(file.content))
          await appendFile(name, content)
        }
      }

      }

  async function getFile2 (hash) {

    let url = 'https://scontent-dus1-1.xx.fbcdn.net/v/t1.0-9/31154266_1874105465946772_8244928721039917056_o.jpg?_nc_cat=105&_nc_sid=09cbfe&_nc_eui2=AeENrxOpE0kEVwVLNu2M4xv1FnDlvVlbGjIWcOW9WVsaMrJwYW9wXQIFFmdwAGdorRML1BPSq9z12LNR99YLWlbD&_nc_ohc=dmt6B8hrpb4AX8GvuWC&_nc_ht=scontent-dus1-1.xx&oh=a149f70aefc1eb6998675363b9693cc5&oe=5EC65C83'

    for await (const file of node.get(hash)) {
      if (file.content) {
        const content = Buffer.concat(await all(file.content))
       // await appendFile(name, content)

        const xyz = new window.Blob([content], { type: 'application/octet-binary' })
         url = window.URL.createObjectURL(xyz)

      }
    }
    return url;
     // return 'https://scontent-dus1-1.xx.fbcdn.net/v/t1.0-9/31154266_1874105465946772_8244928721039917056_o.jpg?_nc_cat=105&_nc_sid=09cbfe&_nc_eui2=AeENrxOpE0kEVwVLNu2M4xv1FnDlvVlbGjIWcOW9WVsaMrJwYW9wXQIFFmdwAGdorRML1BPSq9z12LNR99YLWlbD&_nc_ohc=dmt6B8hrpb4AX8GvuWC&_nc_ht=scontent-dus1-1.xx&oh=a149f70aefc1eb6998675363b9693cc5&oe=5EC65C83'
  }

  function appendFile (name, data) {
    const file = new window.Blob([data], { type: 'application/octet-binary' })
    const url = window.URL.createObjectURL(file)

    console.log("AppendFile::::::");
    console.log(url);
    saveAs(url, name);

  }

  function appendFile2 (name, data) {
    const file = new window.Blob([data], { type: 'application/octet-binary' })
    const url = window.URL.createObjectURL(file)

    console.log("AppendFile::::::");
    console.log(url);
    return url;
    //saveAs(url, name);
  }

  async function swarmAdresses() {

      return await node.swarm.addrs()

  }
  async function reconnect(addr) {

     const multiadress = `/ip4/185.113.124.221/tcp/13579/ws/p2p-webrtc-star/p2p/${addr}`

    await node.swarm.connect(multiadress).catch(() => {
      console.log('Reconnect is not possible');
    })
  }

  async function stats() {
     let returnObjects = [];
     for await (const stats of node.stats.bw()) {
      console.log(stats)
       returnObjects.push(stats);
    }
    // for await (const stats of node.bitswap.stat()) {
    //   console.log(stats)
    //   returnObjects.push(stats);
    // }
    // for await (const stats of node.stats.repo()) {
    //   console.log(stats)
    //   returnObjects.push(stats);
    // }

    return returnObjects;

  }



    return {
        newSubscribe,
        getID,
        getPeers,
        sendNewMsg,
        uploadFile,
        getFile,
        getFile2,
        swarmAdresses,
        stats,
        reconnect
    }
}

export default IPFSInstance;
