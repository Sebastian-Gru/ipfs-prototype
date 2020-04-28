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
      <q-card-section >
        <div class="text-h6">All connected Peers: </div>
        <q-btn @click="this.swarmAdressesBtn" label="Get connected Peers"/>
        <q-scroll-area style="height: 550px;" class="q-mt-md">
      <q-list>
        <q-card
          class="q-ma-md"
          flat bordered
          v-for="address in swarmAdresses"
          :key="address">
          <q-card-section>
            <h4>Peer</h4>
          </q-card-section>
          <q-card-section v-for="singleAdress in address.toString().split(',')" :key="singleAdress">
            {{singleAdress}}
          </q-card-section>
          </q-card>
      </q-list>
        </q-scroll-area>
      </q-card-section>

    </q-card>



    <q-card flat bordered class="my-card q-ma-xl q-pa-xl">
      <q-btn @click="this.statsButton" label="Get Statistics"/>
      <h2>Stats:</h2>
      {{stats}}
    </q-card>


  </div>
</template>

<script>
  import {mapGetters, mapMutations, mapActions} from 'vuex'
    export default {

        data(){
            return{
                friends: [
                    {
                        name: "Mary",
                        age: 24
                    },
                    {
                        name: "Peter",
                        age: 24
                    },
                    {
                        name: "Max",
                        age: 24
                    },
                    {
                        name: "Lisa",
                        age: 24
                    },

                ],
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
                if(this.name != "")
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
