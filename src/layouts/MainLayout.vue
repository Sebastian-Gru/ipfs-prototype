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

export default {
 computed: {
     title (){
         console.log(this.$route)
          let currentPath = this.$route.fullPath;
         if (currentPath == '/') return 'IPFS - Chat';
         else if (currentPath == '/chat') return 'Chat';
         return 'Fehler';
     }
 }
}
</script>
