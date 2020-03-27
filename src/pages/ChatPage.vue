<template>
  <q-page class="flex column">
    <div class="q-pa-md column col justify-end">
      <q-chat-message
        v-for="message in messages"
        :key="message.text"
        :name="message.from"
        :text="[message.text]"
        :sent=" message.from == 'me'? true: false "
      />
      <q-chat-message
        v-for="message in allMessages['global']"
        :key="message.data"
        :name="message.from"
        :text="[message.data]"
        :sent=" message.from == 'me'? true: false "
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
          peers: [],
          selectedPeer: 'global',
          allMessages: {
              'global': []
          },
          IPFSChatInstance: null
      }

  },
    methods: {
      //Old Methods
      sendMessage() {
          if (this.newMessage != ''){
          this.messages.push({
              text: this.newMessage,
              from: 'me'
          })
              this.IPFSChatInstance.sendNewMsg('global', this.newMessage)
              this.newMessage = ''
          }
      },

        //New Messages

        scrollDownTheMsgs(){
            setTimeout(() => {
                let msgContainer = document.getElementsByClassName('msg-container')[0];
                msgContainer.scrollTop = msgContainer.scrollHeight;
            }, 200)
        },
        globalMsgHandler(msg) {
            // console.log('globalMsgHandler received', msg.data.toString(), 'from', msg.from)
            this.scrollDownTheMsgs();

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

        nameServiceHandler(msg) {
            let senderID = msg.from;
            let senderName = msg.data.toString();

            this.setState(oldState => {
                let peers = oldState.peers.slice();
                peers.forEach(peer => {
                    if (peer.name == '' && peer.nodeid == senderID) {
                        peer.name = senderName;
                    }
                })
                return { peers }
            });
        },

        mapNodeIDToName(nodeid) {
            let {peers} = this.state;
            for (let i = peers.length - 1; i >= 0; i--) {
                if (peers[i]['nodeid'] == nodeid && peers[i]['name'].length > 0) return peers[i]['name']
            }
            return nodeid;;
        },
        lastFive(string){
            if(string.length > 5){
                return string.slice(string.length - 5);
            } else return string;
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
                //this.IPFSChatInstance.newSubscribe('name-service', this.nameServiceHandler)
                //this.IPFSChatInstance.newSubscribe('private-chat', this.privateChatHandler)
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

                        //else i have peers and i am not gonna empty them => adding the new ones olny.
                        let existingPeers = this.peers.slice();
                        let existingPeersIDs = existingPeers.map(peer => peer.nodeid);

                        peersComing.forEach(peerID => {
                            if (existingPeersIDs.indexOf(peerID) == -1) {
                                existingPeers.push({ name: '', nodeid: peerID })
                            }
                        });

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
