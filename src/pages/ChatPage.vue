
<template>

  <q-page class="flex column">
    <q-header >
      <q-toolbar>
        <q-btn flat @click="drawerLeft = !drawerLeft" round dense icon="menu" />
        <q-toolbar-title>Header</q-toolbar-title>
      </q-toolbar>
    </q-header>

    <div class="q-pa-md column col justify-end">
      <q-drawer
        v-model="drawerLeft"
        show-if-above
        :width="200"
        :breakpoint="700"
        elevated
        content-class="bg-primary text-white"
      >
        <q-scroll-area class="fit">
          <div class="q-pa-sm">
            <q-list
              class="full-width"
              separator>
              <q-item
                v-for="p in peers"
                :key="p.nodeid"
                to="/chat"
                clickable v-ripple>
                <q-item-section avatar>
                  <q-avatar color="primary" text-color="white">
                    {{ p.name.charAt(0) }}
                  </q-avatar>
                </q-item-section>

                <q-item-section>
                  <q-item-label>{{ p.nodeid }}</q-item-label>
                </q-item-section>

                <q-item-section side>
                  <q-badge
                    :color="p.online ? 'light-green-5' : 'grey-4'">
                    {{ p.online ? 'Online': 'Offline' }}
                  </q-badge>

                </q-item-section>
              </q-item>


            </q-list>
          </div>
        </q-scroll-area>
      </q-drawer>
<!--      <q-chat-message-->
<!--        v-for="message in messages"-->
<!--        :key="message.text"-->
<!--        :name="message.from"-->
<!--        :text="[message.text]"-->
<!--        :sent=" message.from == 'me'? true: false "-->
<!--      />-->
      <q-chat-message
        v-for="message in allMessages[this.selectedPeer]"
        :key="message.data + Math.random()"
        :name="message.from"
        :text="[message.data]"
        :sent=" message.from == myID? true: false "
      />

    </div>
    <q-footer elevated>
      <q-toolbar>
        <q-form
          @submit="sendMessage"
          class="full-width">
          <q-input
            v-model="newMessage"
            bg-color="white"
            outlined
            rounded
            label="Message"
            dense>

            <template v-slot:after>
              <q-btn
                @click="sendMessage"
                round
                dense
                flat
                type="submit"
                color="white"
                icon="send" />
            </template>
          </q-input>
        </q-form>
      </q-toolbar>

    </q-footer>
  </q-page>
</template>


<script>
    import IPFSChat from '../js/IPFSChat';
   // import UploadFile from '../js/UploadFile';

    export default {
  data () {
      return{
          newMessage: '',
          messages: [
              {
                  text: 'Hey du!',
                  from: 'them'
              },
              {
                  text: 'Hello, was geht bei dir',
                  from: 'me'
              },
              {
                  text: 'Danke gut und usw',
                  from: 'them'
              },
              {
                  text: 'Was sonst',
                  from: 'them'
              }
          ],
          //New Variables
          myName: 'Test',
          myID: '',
          currentMsg: '',
          peers: [{
              nodeid: 123,
              name:"Global",
              online: true
          },

          ],
          selectedPeer: 'global',
          allMessages: {
              'global': []
          },
          IPFSChatInstance: null,
          drawerLeft: false,
          users: [ {
              id: 1,
              name: 'Global',
              online:true
          }, {
              id: 2,
              name: 'Mia',
              online: false
          }, {
              id: 3,
              name: 'Paul',
              online:false
          }]
      }

  },
    methods: {
      uploadFile(file){
          let name =  'file' + Math.random();
          const reader = new FileReader();

          reader.onload = async (e) => {
              let ipfsLink = await this.IPFSChatInstance.uploadFile(`file.${Math.random()}`, e.target.result);

              setTimeout(()=>{

                  this.IPFSChatInstance.sendNewMsg('global', `<a target='_blank' href='${ipfsLink}'> ${file.name} </a>`);

              },1000)

          };
          reader.readAsText(file);

          // Prevent upload
          return false;

          alert("hello!");
      },
      //Old Methods
      sendMessage() {
          if (this.newMessage != ''){
          this.messages.push({
              text: this.newMessage,
              from: 'me'
          })
              if (this.selectedPeer == 'global')
                this.IPFSChatInstance.sendNewMsg('global', this.newMessage)
              else
                  this.IPFSChatInstance.sendNewMsg('private-chat', `${this.selectedPeer}:${this.newMessage}`)
              this.newMessage = ''
          }
      },

        //New Messages

        // scrollDownTheMsgs(){
        //     setTimeout(() => {
        //         let msgContainer = document.getElementsByClassName('msg-container')[0];
        //         msgContainer.scrollTop = msgContainer.scrollHeight;
        //     }, 200)
        // },
        globalMsgHandler(msg) {
            // console.log('globalMsgHandler received', msg.data.toString(), 'from', msg.from)
           // this.scrollDownTheMsgs();

                let newMessages = Object.assign({}, this.allMessages);
                let currentDate = new Date();
                let dateString = `${currentDate.getDate()}-${currentDate.getMonth() + 1}-${currentDate.getFullYear()}    ${currentDate.getHours()}:${currentDate.getMinutes()}`;

                newMessages['global'].push({
                    from: msg.from,
                    data: msg.data.toString(),
                    date: dateString
                });


                return { allMessages: newMessages }

        },
        mapNodeIDToName(nodeid) {
            let {peers} = this.peers;
            for (let i = peers.length - 1; i >= 0; i--) {
                if (peers[i]['nodeid'] == nodeid && peers[i]['name'].length > 0) return peers[i]['name']
            }
            return nodeid;
        },

        nameServiceHandler(msg) {
            let senderID = msg.from;
            let senderName = msg.data.toString();


                let peers = this.peers.slice();
                peers.forEach(peer => {
                    if (peer.name == '' && peer.nodeid == senderID) {
                        peer.name = senderName;
                    }
                })
                return { peers }

        },

        privateChatHandler(msg){
            let senderID = msg.from;
            let data = msg.data.toString();
            let receiverID = data.split(':')[0];
            let theMsg = data.slice(data.split(':')[0].length+1)

            const {myID} = this.myID;

            // if someone send a message for me
            if(receiverID && theMsg && receiverID == myID){


                    let existingAllMessags = Object.assign({}, this.allMessages);

                    if(!existingAllMessags[senderID])
                        existingAllMessags[senderID]=[];

                    let currentDate = new Date();
                    let dateString = `${currentDate.getDate()}-${currentDate.getMonth() + 1}-${currentDate.getFullYear()}    ${currentDate.getHours()}:${currentDate.getMinutes()}`;

                    existingAllMessags[senderID].push({
                        from: this.mapNodeIDToName(senderID),
                        data: theMsg,
                        date: dateString,
                        mine: false
                    });

                    return {allMessages: existingAllMessags};

            }

            // if i'm the sender
            else if(receiverID && theMsg && senderID == myID){



                    let existingAllMessags = Object.assign({}, this.allMessages);

                    if(!existingAllMessags[receiverID])
                        existingAllMessags[receiverID]=[];

                    let currentDate = new Date();
                    let dateString = `${currentDate.getDate()}-${currentDate.getMonth() + 1}-${currentDate.getFullYear()}    ${currentDate.getHours()}:${currentDate.getMinutes()}`;

                    existingAllMessags[receiverID].push({
                        from: this.mapNodeIDToName(receiverID),
                        data: theMsg,
                        date: dateString,
                        mine: true
                    });

                    return {allMessages: existingAllMessags};


            }
        }

    },
    created(){
         this.IPFSChatInstance = new IPFSChat();

        this.IPFSChatInstance.getID()
            .then(myID => {
                this.myID = myID ;
            })
            .then(() => {
                this.IPFSChatInstance.newSubscribe('global', this.globalMsgHandler)
                this.IPFSChatInstance.newSubscribe('name-service', this.nameServiceHandler)
                this.IPFSChatInstance.newSubscribe('private-chat', this.privateChatHandler)
            });
    },

    mounted() {
        try {
            setInterval(async () => {

                let peersComing = await this.IPFSChatInstance.getPeers('global');
                if (peersComing && peersComing.length) {

                        //if i have no peers accept everything
                        if (this.peers.length == 0)
                            return {
                                peers: peersComing.map(peerID => ({ name: '', nodeid: peerID }))
                            }

                        //else i have peers and i am not gonna empty them => adding the new ones only.
                        let existingPeers = this.peers.slice();
                        let existingPeersIDs = existingPeers.map(peer => peer.nodeid);

                        peersComing.forEach(peerID => {
                            if (existingPeersIDs.indexOf(peerID) == -1) {
                                existingPeers.push({ name: '', nodeid: peerID })
                            }
                        });
                       // console.log("existingPeers: "+existingPeers);
                    //this.peers.push(existingPeers);
                    console.log("Peers:"+ this.peers.name);
                        return {
                            peers: existingPeers
                        }

                }

            }, 3000);
        } catch (error) {
            console.warn(error);
        }

        // setInterval(() => {
        //     if (this.myName)
        //         this.IPFSChatInstance.sendNewMsg('name-service', this.state.myName)
        // }, 5000)
    }
}
</script>
