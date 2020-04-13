
<template>

  <q-page class="flex column">
    <q-card flat bordered class="my-card fixed-top-right q-ma-md q-pa-md">
      <q-card-section>
        <div class="text-h6">Upload a File</div>
      </q-card-section>
      <q-card-section>
        <q-form @submit="uploadFiletoIPFS" class="q-gutter-md">

        <q-file v-model="model" label="Standard" />

          <div>
            <q-btn label="Submit" type="submit" color="primary"/>
          </div>

        </q-form>
      </q-card-section>
    </q-card>

    <div class="q-pa-md column col justify-end" id="Messages">

      <q-chat-message
        v-for="message in allMessages[selectedPeer]"
        :key="message.data + Math.random()"
        :name="message.from"
        :text="[message.data]"
        :sent="message.from == myID|| message.from == myName"
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
          file: null,
          files: null,
          model: null

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
          anotherFunction: 'DataStore/anotherFunction',
          instantiateIPFS: 'DataStore/instantiateIPFS',
          intervallIPFS: 'DataStore/intervallIPFS',
          uploadFile: 'DataStore/uploadFile'
      }),

        uploadFiletoIPFS(){

            this.uploadFile(this.model);
            this.model = "";
        },


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
<style scoped>
  #Messages {
    overflow-y: scroll;
  }
</style>


