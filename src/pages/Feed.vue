
<template>

  <q-page
    ref="pageFeed"
    class="page-chat flex column">


    <div
      class="q-pa-md column col justify-end"
      id="Messages">

      <q-chat-message
        v-for="message in allMessages['global']"
        :key="message.data + Math.random()"
        :name="message.from"
        :stamp="message.date? message.date.slice(10): 'just now' "
        :text="[message.data]"
        :sent="message.from == myID|| message.from == myName"
        :bg-color="message.from == myID|| message.from == myName?  'blue' : 'amber'"
      />
    </div>

    <q-footer elevated>
      <q-toolbar>

        <q-form
          @submit="sendMessage"
          class="full-width">

          <q-input
            v-model="newMessage"
            @blur="scrollToBottom"
            ref="newMessage"
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
    import {mapGetters, mapState, mapActions} from 'vuex'
    export default {



        data () {
            return{
                newMessage: '',
                model: null,

            }

        },
        computed:  {

            ...mapState({
                //selectedPeer: state => state.selectedPeer,
            }),

            ...mapGetters({
                allMessages: 'DataStore/messageGetter',
                peers: 'DataStore/peerGetter',
                IPFSChatInstance: 'DataStore/IPFSChatInstanceGetter',
                myID: 'DataStore/myIDGetter',
                myName:'DataStore/myNameGetter',
                currentMsg: 'DataStore/currentMsgGetter',
                selectedPeer: 'DataStore/selectedPeerGetter',
            })
        },
        methods: {



            ...mapActions({
                someAction: 'DataStore/someAction',
                instantiateIPFS: 'DataStore/instantiateIPFS',
                intervallIPFS: 'DataStore/intervallIPFS',
                uploadFile: 'DataStore/uploadFile'
            }),

            open (position) {
                this.position = position
                this.dialog = true
            },


            uploadFiletoIPFS(){

                this.uploadFile(this.model);
                //this.model = "";

            },


            sendMessage() {
                if (this.newMessage != '') {

                    console.log("selectedPeer: " + this.selectedPeer);
                    if (this.selectedPeer == 'global')
                        this.IPFSChatInstance.sendNewMsg('global', this.newMessage);
                    else
                        this.IPFSChatInstance.sendNewMsg('private-chat', `${this.selectedPeer}:${this.newMessage}`);
                    this.newMessage = '';
                    this.$refs.newMessage.focus()
                    this.scrollToBottom()
                }
            },
            scrollToBottom() {
                let pageChat = this.$refs.pageFeed.$el
                setTimeout(() => {
                    window.scrollTo(0, pageChat.scrollHeight)
                }, 20);
            }
        },

        watch: {
            allMessages: function(val) {
                if (Object.keys(val).length) {
                    this.scrollToBottom()

                }
            }
        },


        created () {
            if(!this.IPFSChatInstance){
                this.instantiateIPFS();
                this.someAction();
            }
        },
        mounted() {
            if(!this.IPFSChatInstance)
                this.intervallIPFS();
        }
    }
</script>
