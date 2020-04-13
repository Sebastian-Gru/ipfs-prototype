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
          <q-item-label>{{  user.name? user.name: user.nodeid }}</q-item-label>
        </q-item-section>

        <q-item-section side>

          <q-badge
            :color="user.online ? 'light-green-5' : 'grey-4'">
            {{ user.online ? 'Online': 'Offline' }}
          </q-badge>

        </q-item-section>
      </q-item>
    </q-list>

    <q-card flat bordered class="my-card fixed-bottom-right q-ma-md q-pa-md">
      <q-card-section>
        <div class="text-h6">Your IPFS CID:</div>
      </q-card-section>

      <q-card-section class="q-pt-none">
        {{myID}}
      </q-card-section>
      <q-card-section class="q-pt-none">
        <div class="text-h6">Your name: </div>
        {{myComputedName? myComputedName: "Anonym"}}
      </q-card-section>

      <q-form @submit="onSubmit" class="q-gutter-md ">
        <q-input
          name="name"
          v-model="name"
          color="primary"
          :label="myComputedName? 'Change Name' : 'Your Name'"
          filled
          clearable
        />
        <div class="float-right " >
          <q-btn label="Submit" type="submit" color="primary"/>
        </div>
      </q-form>

    </q-card>

  </q-page>
</template>

<script>
  import {mapGetters, mapActions, mapMutations} from 'vuex'

    export default {
      data(){
          return{
              name: "",
          }
      },
        computed: {

            ...mapGetters({
                IPFSChatInstance: 'DataStore/IPFSChatInstanceGetter',
                userList: 'DataStore/userListGetter',
                peers: 'DataStore/peerGetter',
                myID: 'DataStore/myIDGetter',
                myComputedName: 'DataStore/myNameGetter'
            })
        },
        methods: {
            ...mapActions({
                someAction: 'DataStore/someAction',
                instantiateIPFS: 'DataStore/instantiateIPFS',
                intervallIPFS: 'DataStore/intervallIPFS'
            }),
            ...mapMutations({
              myName: 'DataStore/myNameChange',
              changeSelectedPeer: 'DataStore/changeSelectedPeer'
            }),

            onSubmit(){
                if(this.name != "")
                  this.myName(this.name);
                this.name = "";
            },
            changePeer(x){
                console.log("User: " + x);
                this.changeSelectedPeer(x);
            }
        },
        created () {
          if(!this.IPFSChatInstance){
              this.instantiateIPFS();
              this.someAction();
          }

        },
        mounted() {
                this.intervallIPFS();
        }

    }

</script>

