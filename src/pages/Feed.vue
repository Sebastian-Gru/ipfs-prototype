
<template>

  <q-page
    ref="pageFeed"
    class="page-chat flex column">

    <div class="q-pa-xl row items-start q-gutter-md justify-center" >
    <div
      class="q-pa-md column col justify-end"
      id="Messages"
      style="max-width: 800px">
      <q-list >
      <q-card
        class="q-ma-md"
        flat bordered
        v-for="message in allMessages['global']"
        :key="message.data + Math.random()">
      <q-card-section>
        <div class="text-overline text-orange-9">{{message.from}}</div>
        <div class="text-subtitle2">by User</div>
      </q-card-section>
        <q-separator v-if="message.img"/>
        <img aria-label="Message" v-if="message.img" :src="message.img">
        <q-separator  />
      <q-card-section class="q-pt-md">
        {{ message.data }}
      </q-card-section>
        <q-card-section align="right">
          {{message.date}}
        </q-card-section>
      </q-card>
    </q-list>
    </div>
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
            label="Write a public Post"
            dense>


            <template v-slot:after>

              <q-btn-dropdown
                dropdown-icon="change_history"
                push color="red" label="Add Image">
                <q-card class="full-width" flat bordered >
                  <q-card-section>
                    <q-form @submit="uploadFiletoIPFS" class="q-gutter-md">
                      <q-file v-model="model" accept=".jpg, image/*" label="Image">
                        <template v-if="model" v-slot:append>
                          <q-icon name="cancel" @click.stop.prevent="model = null" class="cursor-pointer" />
                        </template>
                      </q-file>
                    </q-form>
                  </q-card-section>
                </q-card>
              </q-btn-dropdown>

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
    import {mapGetters, mapActions} from 'vuex'
    import Notify from "quasar/src/plugins/Notify";

    export default {

        data () {
            return{
                newMessage: '',
                model: null,

            }
        },
        computed:  {
            ...mapGetters({
                allMessages: 'DataStore/messageGetter',
                peers: 'DataStore/peerGetter',
                IPFSInstance: 'DataStore/IPFSInstanceGetter',
                myID: 'DataStore/myIDGetter',
                myName:'DataStore/myNameGetter',
                currentMsg: 'DataStore/currentMsgGetter',
            })
        },
        methods: {



            ...mapActions({
                someAction: 'DataStore/someAction',
                instantiateIPFS: 'DataStore/instantiateIPFS',
                intervallIPFS: 'DataStore/intervallIPFS',
                uploadFile: 'DataStore/uploadFile',
                simpleUpload: 'DataStore/simpleUpload',
            }),

            open (position) {
                this.position = position;
                this.dialog = true
            },


            uploadFiletoIPFS(){
                this.uploadFile(this.model);
            },


            async sendMessage() {
                if (this.newMessage !== '') {

                    let hash = "";
                    if(this.model){

                        hash = await this.simpleUpload(this.model);
                        console.log("selectedPeer: " + 'global');
                        await this.IPFSInstance.sendNewMsg('global', `${this.newMessage}:${hash}`);

                    } else
                        await this.IPFSInstance.sendNewMsg('global', `${this.newMessage}`);
                    this.newMessage = '';
                    this.model = null;
                    this.$refs.newMessage.focus();
                    this.scrollToBottom();
                }else
                    Notify.create({
                        message: `An Image cannot be sent without a message!`,
                        position: "center",
                        color: "info"
                    });
            },
            scrollToBottom() {
                let pageChat = this.$refs.pageFeed.$el;
                setTimeout(() => {
                    window.scrollTo(0, pageChat.scrollHeight);
                }, 0);
            }
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
        },
        beforeUpdate() {
            this.scrollToBottom()
        }
    }
</script>
