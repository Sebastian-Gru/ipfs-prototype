<template>
  <div>
    <q-card flat bordered class="my-card q-ma-xl q-pa-xl">
      <q-card-section>
        <div class="text-h6">Your IPFS CID:</div>

        {{myID}}
      </q-card-section>
      <q-separator inset />

      <q-card-section class="q-pt-none">
        <div class="text-h6">Your name: </div>
        {{myComputedName? myComputedName: "Anonym"}}
      </q-card-section>
    <q-card-section>
      <q-form
        @submit="onSubmit" class="full-width">
        <q-input
          name="name"
          v-model="name"
          color="primary"
          :label="myComputedName? 'Change Name' : 'Your Name'"
          filled
          clearable
        >
        <template v-slot:after>
          <q-btn
             label="Change"
             type="submit"
             color="primary"
             @click="onSubmit"/>
        </template>
        </q-input>
      </q-form>
    </q-card-section>
      <q-separator inset />
      <q-card-section class="q-pt-none">
        <div class="text-h6">Number of connected Peers over Pubsub: </div>
        {{peers.length}}
      </q-card-section>
    </q-card>
  </div>
</template>

<script>
  import {mapGetters, mapMutations, mapActions} from 'vuex'
    export default {

        data(){
            return{
                name: ""
            }
        },
        computed: {
            ...mapGetters({
                IPFSInstance: 'DataStore/IPFSInstanceGetter',
                myID: 'DataStore/myIDGetter',
                myComputedName: 'DataStore/myNameGetter',
                peers: 'DataStore/peerGetter',
                swarmAdresses: 'DataStore/swarmAdressesGetter',
                stats: 'DataStore/statsGetter'
            })
        },
        methods:{
            ...mapMutations({
                myName: 'DataStore/myNameChange',
            }),
            ...mapActions({
                swarmAdressesBtn:'DataStore/swarmAdresses',
                statsButton: 'DataStore/statsBtn',
                instantiateIPFS: 'DataStore/instantiateIPFS',
                intervallIPFS: 'DataStore/intervallIPFS'
            }),

            onSubmit(){
                if(this.name !== "")
                    this.myName(this.name);
                this.name = "";
            },
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
        }
    };
</script>
