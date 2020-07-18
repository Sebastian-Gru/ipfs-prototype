<!--   The starting point of the chat page was achieved with a YouTube tutorial for a Quasar chat app-->
<!--   The tutorial can be found here: https://www.youtube.com/watch?v=Kfg789g_UTg -->
<template>
  <q-page class="flex q-pa-md">

    <q-list
      class="full-width"
      separator>

      <q-item
        v-for="user in peers "
        :key="user.nodeid"
        @click="changePeer(user.nodeid)"
        @mousedown="changePeer(user.nodeid)"
        to="/chat"
        clickable v-ripple
      >

        <q-item-section avatar>
          <q-avatar color="primary" text-color="white">
            {{ user.name? user.name[0] :user.nodeid[0] }}
          </q-avatar>
        </q-item-section>

        <q-item-section>
          <q-item-label>{{ user.name? user.name: user.nodeid }}</q-item-label>
        </q-item-section>

        <q-item-section side>

          <q-badge
            :color="user.online ? 'light-green-5' : 'grey-4'">
            {{ user.online ? 'Online': 'Offline' }}
          </q-badge>

        </q-item-section>
      </q-item>
      <q-skeleton
        v-if="peers.length === 0"
        class="q-mt-md"
        animation="pulse-x"/>
    </q-list>

    <q-card flat bordered class="my-card fixed-bottom-right q-ma-md q-pa-md">
      <q-card-section>
        <div class="text-h6">Your IPFS CID:</div>
        {{myID}}
      </q-card-section>

      <q-separator inset />

      <q-card-section class="q-pt-none">
        <div class="text-h6">Your name:</div>
        {{myComputedName? myComputedName: "Anonym"}}
      </q-card-section>
      <q-card-section class="q-pt-none">
       <q-btn label="Reconnect!"  @click="reconnectToPeers" />
      </q-card-section>


    </q-card>

  </q-page>
</template>

<script>
    import {mapGetters, mapActions, mapMutations} from 'vuex'
    export default {
        data() {
            return {
                name: "",
            }
        },
        computed: {

            ...mapGetters({
                IPFSInstance: 'DataStore/IPFSInstanceGetter',
                userList: 'DataStore/userListGetter',
                peers: 'DataStore/peerGetter',
                myID: 'DataStore/myIDGetter',
                myComputedName: 'DataStore/myNameGetter'
            })
        },
        methods: {
            ...mapActions({
                instantiateIPFS: 'DataStore/instantiateIPFS',
                intervallIPFS: 'DataStore/intervallIPFS',
                reconnectToPeers: 'DataStore/reconnectToPeers'
            }),
            ...mapMutations({
                myName: 'DataStore/myNameChange',
                changeSelectedPeer: 'DataStore/changeSelectedPeer'
            }),

            reconnect() {
                alert("Hello");
            },
            changePeer(x) {
                console.log("User: " + x);
                this.changeSelectedPeer(x);
            }
        },
        created() {
            if (!this.IPFSInstance) {
                this.instantiateIPFS();
            }

        },
        mounted() {
            this.intervallIPFS();
        },
        beforeDestroy() {
        }

    }

</script>

