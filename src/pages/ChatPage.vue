
<template>

  <q-page class="flex column">
    <q-card flat bordered class="my-card fixed-top-right q-ma-md q-pa-md">
      <q-card-section>
        <div class="text-h6">Upload a File</div>
      </q-card-section>
      <q-card-section>
        <input type="file" @change="uploadFile">
      </q-card-section>
    </q-card>

    <div class="q-pa-md column col justify-end">

      <q-chat-message
        v-for="message in allMessages[selectedPeer]"
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
    import {mapGetters, mapState, mapActions} from 'vuex'
    export default {



  data () {
      return{
          newMessage: '',
          file: null

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


        uploadFile(){
          console.log("Not implemented yet!");
        },


      ...mapActions({
          someAction: 'DataStore/someAction',
          anotherFunction: 'DataStore/anotherFunction',
          instantiateIPFS: 'DataStore/instantiateIPFS',
          intervallIPFS: 'DataStore/intervallIPFS'
      }),


        sendMessage() {
            if (this.newMessage != '') {

                console.log("selectedPeer: " + this.selectedPeer);
                if (this.selectedPeer == 'global')
                    this.IPFSChatInstance.sendNewMsg('global', this.newMessage);
                else
                    this.IPFSChatInstance.sendNewMsg('private-chat', `${this.selectedPeer}:${this.newMessage}`);
                this.newMessage = ''
            }
        },

        mapNodeIDToName(nodeid) {
            let {peers} = this.peers;
            for (let i = peers.length - 1; i >= 0; i--) {
                if (peers[i]['nodeid'] == nodeid && peers[i]['name'].length > 0) return peers[i]['name']
            }
            return nodeid;
        },
    },
    created () {
        if(!this.IPFSChatInstance){
            this.instantiateIPFS();
            this.someAction();
            this.anotherFunction();
        }

    },
    mounted() {
        if(!this.IPFSChatInstance)
        this.intervallIPFS();
    }


}
</script>


