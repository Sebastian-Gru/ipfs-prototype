<template>
  <q-layout view="lHh Lpr lFf">
    <q-header elevated>
      <q-toolbar>

        <q-btn
          v-if="$route.fullPath.includes('/chat')"
          v-go-back.single
          flat
          dense
          label="Back" />

        <q-toolbar-title class="absolute-center">
          {{ title }}
        </q-toolbar-title>


      </q-toolbar>

      <q-tabs
        dense
        align="center"
        v-if="$route.meta.tabs">
        <q-route-tab to="/" label="Chat" icon="chat"/>
        <q-route-tab to="/profile" label="Profil" icon="person"/>
        <q-route-tab to="/filesharing" label="File Sharing" icon="attach_file" />
      </q-tabs>

    </q-header>



    <q-page-container>
      <router-view />
    </q-page-container>
  </q-layout>
</template>

<script>

import {mapGetters} from 'vuex'

export default {

 computed: {
     ...mapGetters({
         selectedPeer: 'DataStore/selectedPeerGetter',
         peers: 'DataStore/peerGetter',
         myID: 'DataStore/myIDGetter'
     }),
     title (){
          let currentPath = this.$route.fullPath;
         if (currentPath === '/') return 'IPFS - Chat';
         else if (currentPath === '/chat') return this.selectedPeer === 'global'? "Global Chat": `Chat with ${this.mapNodeIDToName(this.selectedPeer)}`;
         return 'Fehler';
     }
 },
    methods: {

        mapNodeIDToName(nodeid) {
            let peers = this.peers;
            for (let i = peers.length - 1; i >= 0; i--) {
                if (peers[i]['nodeid'] === nodeid && peers[i]['name'].length > 0) return peers[i]['name']
            }
            if(nodeid.length > 5){
                return nodeid.slice(nodeid.length - 5);
            } else return nodeid;
        }
    }
}
</script>
