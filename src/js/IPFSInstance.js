/*
 * The starting inspiration for some of the functionality in this file
 * IPFSStance.js file was taken from the IPFS Chat App at
 * https://github.com/lalosh/ipfs-chat
 * although most code went trough many iterations and
 * looks quite different now
 */

import IPFS from "ipfs";
import BufferPackage from "buffer";
import { saveAs } from "file-saver";
const Buffer = BufferPackage.Buffer;
const all = require("it-all");

let node = null;

async function IPFSInstance() {
  this.ready = false;

  node = await IPFS.create({
    repo: "ipfs-" + Math.random(),
    config: {
      Addresses: {
        Swarm: [
          // These are public webrtc-star server:
          // If my servers stop working these can be tried
          //'/dns4/star-signal.cloud.ipfs.team/tcp/443/wss/p2p-webrtc-star'
          // '/dns4/ws-star.discovery.libp2p.io/tcp/443/wss/p2p-webrtc-star',

          //These are my own signalling server hosted on heroku:
          //Heroku server in the US:
          // "/dns4/ipfs-webrtc-singalling-server.herokuapp.com/tcp/443/wss/p2p-webrtc-star/",

          //Heroku server in the EU:
          "/dns4/ipfs-webrtc-signalling.herokuapp.com/tcp/443/wss/p2p-webrtc-star/",
        ],
      },
      // If you want to connect to the public bootstrap nodes, remove the next line
      // Bootstrap: []
    },
  });

  async function uploadFile(fileName, fileContent) {
    if (!this.ready) return;

    for await (const result of node.add(fileContent)) {
      if (result) return [`https://ipfs.io/ipfs/${result.path}`, result.path];
    }
  }

  async function getID() {
    this.ready = true;
    return await node.id();
  }

  const newSubscribe = (topic, receiveMsg) => {
    node.pubsub.subscribe(topic, receiveMsg);
    console.log(`Subscribed to workspace ${topic}`);
  };

  const getPeers = async (topic) => {
    return await node.pubsub.peers(topic);
  };

  async function sendNewMsg(topic, newMsg) {
    const msg = Buffer.from(newMsg);
    node.pubsub.publish(topic, msg);
  }

  async function getFile(hash, name) {
    for await (const file of node.get(hash)) {
      if (file.content) {
        const content = Buffer.concat(await all(file.content));
        await appendFile(name, content);
      }
    }
  }

  async function uploadGlobalFeedFile(hash) {
    let url = "";
    for await (const file of node.get(hash)) {
      if (file.content) {
        const content = Buffer.concat(await all(file.content));
        const windowBlob = new window.Blob([content], {
          type: "application/octet-binary",
        });
        url = window.URL.createObjectURL(windowBlob);
      }
    }
    return url;
  }

  function appendFile(name, data) {
    const file = new window.Blob([data], { type: "application/octet-binary" });
    const url = window.URL.createObjectURL(file);
    saveAs(url, name);
  }

  async function swarmAdresses() {
    return await node.swarm.addrs();
  }
  async function reconnect(addr) {
    const multiadress = `/dns4/ipfs-webrtc-signalling.herokuapp.com/tcp/443/wss/p2p-webrtc-star/
${addr}`;

    await node.swarm.connect(multiadress).catch(() => {
      console.log("Reconnect is not possible");
    });
  }

  async function stats() {
    let returnObjects = [];
    for await (const stats of node.stats.bw()) {
      console.log(stats);
      returnObjects.push(stats);
    }
    return returnObjects;
  }

  return {
    newSubscribe,
    getID,
    getPeers,
    sendNewMsg,
    uploadFile,
    getFile,
    swarmAdresses,
    stats,
    reconnect,
    uploadGlobalFeedFile,
  };
}

export default IPFSInstance;
