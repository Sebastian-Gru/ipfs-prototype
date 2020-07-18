
<template>

  <q-page
    ref="pageChat"
    class="page-chat flex column">


    <div
      class="q-pa-md fixed-top-right z-top q-mt-xl"
     >
    <q-btn-dropdown
      color="primary" label="Share File with the Chat">
    <q-card flat bordered >
      <q-card-section>
        <q-form @submit="uploadFiletoIPFS" class="q-gutter-md">
        <q-file v-model="model" label="Click to choose File" />
          <div>
            <q-btn label="Submit" type="submit" color="primary"/>
          </div>
        </q-form>
      </q-card-section>
    </q-card>
    </q-btn-dropdown>
    </div>



    <div
      class="q-pa-md column col justify-end"
      id="Messages">

      <q-chat-message
        v-for="message in allMessages[selectedPeer]"
        :key="message.data + Math.random()"
        :name="message.from"
        :stamp="message.date? message.date.slice(10): 'just now' "
        :text="[message.data]"
        :sent="message.from === myID|| message.from === myName"
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
            :bg-color="this.$q.dark.isActive? 'dark grey': 'white'"
            outlined
            autofocus
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
          showMessages: false,

      }

  },
        computed:  {

        ...mapState({
           //selectedPeer: state => state.selectedPeer,
        }),

        ...mapGetters({
            allMessages: 'DataStore/messageGetter',
            peers: 'DataStore/peerGetter',
            IPFSInstance: 'DataStore/IPFSInstanceGetter',
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
          uploadFileToSelectedPeer: 'DataStore/uploadFileToSelectedPeer'
      }),

        open (position) {
            this.position = position;
            this.dialog = true;
        },


        uploadFiletoIPFS(){
            this.uploadFileToSelectedPeer(this.model, [this.selectedPeer]);
        },


        sendMessage() {
            if (this.newMessage !== '') {

                console.log("selectedPeer: " + this.selectedPeer);
                if (this.selectedPeer === 'global')
                    this.IPFSInstance.sendNewMsg('global', this.newMessage);
                else
                    this.IPFSInstance.sendNewMsg('private-chat', `${this.selectedPeer}:${this.newMessage}`);
                this.newMessage = '';
                this.$refs.newMessage.focus()
                this.scrollToBottom()
            }
        },
        scrollToBottom() {
            let pageChat = this.$refs.pageChat.$el
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
            },
        },


    created () {
        if(!this.IPFSInstance){
            this.instantiateIPFS();
            this.someAction();
        }
    },
    mounted() {
        if(!this.IPFSInstance)
        this.intervallIPFS();
    }
}
</script>



