import IPFS from 'ipfs';
import BufferPackage from 'buffer';
import { saveAs } from 'file-saver';
const Buffer = BufferPackage.Buffer;

let node = null;

function IPFSInstance() {
    this.ready = false;

    node = new IPFS({
        repo: (() => `repo-${Math.random()}`)(),
        config: {
            Addresses: {
                Swarm: [
                    '/dns4/ws-star.discovery.libp2p.io/tcp/443/wss/p2p-websocket-star'
                ]
            }
        }
    });


console.log("This is the node id:: " + node.id);

    async function uploadFile(fileName, fileContent){

    	if(!this.ready) return;

    	  const filesAdded = await node.add({
            path: fileName,
            content: fileContent
        });

		  console.log('file link',`https://ipfs.io/ipfs/${filesAdded[0].hash}`);


      return [`https://ipfs.io/ipfs/${filesAdded[0].hash}`, filesAdded[0].hash];

    }

    function getID(callback) {
        return new Promise((resolve, reject) => {

            node.on('ready', async () => {
                let nodeID = await node.id();
                this.ready = true;
                resolve(nodeID.id)
            })

        })
    }

    function newSubscribe(topic, receiveMsg) {
        if (!this.ready) return;

        node.pubsub.subscribe(topic, receiveMsg, (error) => {
            if (error) {
                console.error(`failed to subscribe to ${topic}, ${error}`)
            }
            console.log(`subscribed to ${topic}`)
        })

    }

    function getPeers(topic) {

        return new Promise((resolve, reject) => {
            if (!this.ready) reject('');

            node.pubsub.peers(topic, (error, peersIDs) => {
                if (error) {
                    reject(`failed to get peers subscribed to ${topic}, ${error}`)
                }
                // console.log('found these peers', peersIDs)
                resolve(peersIDs)
            })

        })
    }


    function sendNewMsg(topic, newMsg) {
    	//console.log('sendNewMsg received: ', newMsg)
        const msg = Buffer.from(newMsg);

        node.pubsub.publish(topic, msg, (err) => {
            if (err) {
                return console.error(`failed to publish to ${topic}`, err)
            }
            // msg was broadcasted
           // console.log(`published to ${topic}`)
        })
    }

    async function getFile (hash) {

        const file = await node.get(hash);

            const content = Buffer(await file[0].content)

            appendFile( await content)

      }

  function appendFile (data) {
    const file = new window.Blob([data], { type: 'application/octet-binary' })
    const url = window.URL.createObjectURL(file)

    console.log("AppendFile::::::");
    console.log(url);
    saveAs(url, "image.png");

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
