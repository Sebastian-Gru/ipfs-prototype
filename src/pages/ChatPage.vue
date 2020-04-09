
<template>

  <q-page class="flex column">

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
    import {mapGetters, mapState} from 'vuex'
    export default {

  data () {
      return{
          newMessage: '',

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


      //Not yet implemented...
        uploadFile(file) {
            let name = 'file' + Math.random();
            const reader = new FileReader();

            reader.onload = async (e) => {
                let ipfsLink = await this.IPFSChatInstance.uploadFile(`file.${Math.random()}`, e.target.result);

                setTimeout(() => {

                    this.IPFSChatInstance.sendNewMsg('global', `<a target='_blank' href='${ipfsLink}'> ${file.name} </a>`);

                }, 1000)

            };
            reader.readAsText(file);

            // Prevent upload
            return false;

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

        mapNodeIDToName(nodeid) {
            let {peers} = this.peers;
            for (let i = peers.length - 1; i >= 0; i--) {
                if (peers[i]['nodeid'] == nodeid && peers[i]['name'].length > 0) return peers[i]['name']
            }
            return nodeid;
        },
    }


}
</script>



