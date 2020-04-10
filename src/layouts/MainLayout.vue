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
    </q-header>



    <q-page-container>
      <router-view />
    </q-page-container>
  </q-layout>
</template>

<script>
import EssentialLink from 'components/EssentialLink'
import {mapGetters} from 'vuex'

export default {

 computed: {
     ...mapGetters({selectedPeer: 'DataStore/selectedPeerGetter'}),
     title (){
         console.log(this.$route)
          let currentPath = this.$route.fullPath;
         if (currentPath == '/') return 'IPFS - Chat';
         else if (currentPath == '/chat') return this.selectedPeer == 'global'? "Global Chat": `Chat with ${this.shortenToLastFive(this.selectedPeer)}`;
         return 'Fehler';
     }
 },
    methods: {
        shortenToLastFive(string){
            if(string.length > 5){
                return string.slice(string.length - 5);
            } else return string;
        }
    }
}
</script>
