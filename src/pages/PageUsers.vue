<template>
  <q-page class="flex q-pa-md">
    <q-list
      class="full-width"
      separator>
      <q-item
        v-for="user in peers "
        :key="user.nodeid"
        to="/chat"
        clickable v-ripple>
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

<!--      <q-item-->
<!--                        v-for="p in this.peers"-->
<!--                        :key="p.nodeid"-->
<!--                        to="/chat"-->
<!--                        clickable v-ripple>-->
<!--                        <q-item-section avatar>-->
<!--                          <q-avatar color="primary" text-color="white">-->
<!--                            {{ p.nodeid.charAt(0) }}-->
<!--                          </q-avatar>-->
<!--                        </q-item-section>-->

<!--                        <q-item-section>-->
<!--                          <q-item-label>{{ p.nodeid}}</q-item-label>-->
<!--                        </q-item-section>-->

<!--        &lt;!&ndash;                <q-item-section side>&ndash;&gt;-->
<!--        &lt;!&ndash;                  <q-badge&ndash;&gt;-->
<!--        &lt;!&ndash;                    :color="p.online ? 'light-green-5' : 'grey-4'">&ndash;&gt;-->
<!--        &lt;!&ndash;                    {{ p.online ? 'Online': 'Offline' }}&ndash;&gt;-->
<!--        &lt;!&ndash;                  </q-badge>&ndash;&gt;-->

<!--        &lt;!&ndash;                </q-item-section>&ndash;&gt;-->
<!--      </q-item>-->


    </q-list>

    <q-card flat bordered class="my-card fixed-bottom-right q-ma-md q-pa-md">
      <q-card-section>
        <div class="text-h6">Your IPFS CID:</div>
      </q-card-section>

      <q-card-section class="q-pt-none">
        {{myID}}
      </q-card-section>

      <q-form @submit="onSubmit" class="q-gutter-md ">
        <q-input
          name="name"
          v-model="name"
          color="primary"
          label="Your Name"
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
  import {mapGetters, mapActions} from 'vuex'
  //import {someAction} from "../store/DataStore/actions";



    export default {
      data(){
          return{
              name: "",
          }
      },
        computed: {
            // userList: {
            //     get () {
            //         return this.$store.state.DataStore.userList
            //     }}

            ...mapGetters({
                IPFSChatInstance: 'DataStore/IPFSChatInstanceGetter',
                userList: 'DataStore/userListGetter',
                peers: 'DataStore/peerGetter',
                myID: 'DataStore/myIDGetter',
                myName: 'DataStore/myNameGetter'
            })
        },
        methods: {
            ...mapActions({
                someAction: 'DataStore/someAction',
                anotherFunction: 'DataStore/anotherFunction',
                instantiateIPFS: 'DataStore/instantiateIPFS',
                intervallIPFS: 'DataStore/intervallIPFS'
            }),
            onSubmit(){
                this.myName = this.name;
                this.name = "";
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

                this.intervallIPFS();
        }

    }

</script>

