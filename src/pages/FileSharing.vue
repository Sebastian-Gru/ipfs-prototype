<template>
  <q-page class="full-height q-ma-xl">
    <div
      class=" q-col-gutter-xl ">

      <div
        class="col-6">
        <q-scroll-area
          style="height: 300px"
        >
        <q-list
          separator
          padding>
          <q-item-label header>Received Files: </q-item-label>
          <q-item-label caption class="q-pl-md q-pb-md"> Click on Files to download</q-item-label>
          <q-separator spaced />
          <q-item
            v-for="file in files['global']"
            :key="file.from + Math.random()"
            clickable
            @click="logItemName(file.name, file.hash)"
            v-ripple>
            <q-item-section avatar>
              <q-avatar color="teal" text-color="white" icon="attach_file" />
            </q-item-section>
            <q-item-section>
              <q-item-label overline>{{file.name}}</q-item-label>
              <q-item-label>From: {{file.from}}</q-item-label>
            </q-item-section>
            <q-item-section side>
              <q-badge
                :color="fileOnline(file.from) ? 'light-green-5' : 'grey-4'">
                {{ fileOnline(file.from)? 'Online': 'Offline' }}
              </q-badge>

            </q-item-section>
          </q-item>
        </q-list>
        </q-scroll-area>
      </div>
      <div>

      <div
        class="col-6">
        <q-list
          separator
          padding>
          <q-item-label header>Peers:  </q-item-label>
          <q-item-label caption class="q-pl-md q-pb-md"> Select Peer to filter Files and send Files</q-item-label>
          <q-separator spaced />
          <q-item
            :active="active"
            v-for="user in peers"
            :key="user.nodeid + Math.random()"
            clickable
            v-ripple>
            <q-checkbox v-model="user.checked" />
            <q-item-section avatar>
              <q-avatar color="teal" text-color="white" icon="mood" />
            </q-item-section>
            <q-item-section>
              <q-item-label overline>{{user.nodeid}}</q-item-label>

            </q-item-section>
            <q-item-section side>
              <q-badge
                :color="user.online ? 'light-green-5' : 'grey-4'">
                {{ user.online ? 'Online': 'Offline' }}
              </q-badge>

            </q-item-section>
          </q-item>
          <q-separator spaced />
          <q-item-label caption class="q-pl-md q-pb-md"> Other Peers</q-item-label>
        </q-list>
      </div>


      <q-card flat bordered >
        <q-card-section>
          <q-form @submit="uploadFiletoIPFS" >

            <q-file v-model="model" label="Click to choose File to selected Peers" >

              <q-btn v-slot:after label="Submit" type="submit" color="primary" />

            </q-file>

          </q-form>
        </q-card-section>
      </q-card>

    </div>
    </div>

  </q-page>
</template>

<script>
  import {mapGetters, mapActions, mapMutations} from 'vuex'
    export default {
        data(){
            return {
                active: true,
                check1: true,
                model: null
            }
        },
        computed: {
            ...mapGetters({
                files: 'DataStore/fileGetter',
                peers: 'DataStore/peerGetter',
                IPFSChatInstance: 'DataStore/IPFSChatInstanceGetter'
            })

        },
        methods: {
            ...mapActions({
                uploadFileToSharingPannel: 'DataStore/uploadFileToSharingPannel'
            }),
            ...mapMutations({
                changeSelected: 'DataStore/changeSelected'
            }),
          sendMessage(){
              console.log("Hello");
          },

          uploadFiletoIPFS(){
              this.uploadFileToSharingPannel(this.model);

            },
          logItemName(name, hash){
              this.IPFSChatInstance.getFile(hash, name);
          },
          fileOnline(hash){
              //not implemented yet
              return true;

          },
        },
    };
</script>
