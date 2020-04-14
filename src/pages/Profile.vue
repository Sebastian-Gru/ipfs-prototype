<template>
  <div>
  <h1>Profile</h1>
    <q-card flat bordered class="my-card q-ma-xl q-pa-xl">
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
             label="Submit"
             type="submit"
             color="primary"
             @click="onSubmit"/>
        </template>
        </q-input>
      </q-form>

    </q-card>

  <q-separator/>

    <h3>Friends</h3>

    <q-item
      v-for="friend in friends"
      clickable v-ripple
      :key="friend.name"
    >
      <q-item-section side>
        <q-avatar rounded size="100px">
          <img src="https://cdn.quasar.dev/img/avatar.png" />
          <q-badge floating color="teal">new</q-badge>
        </q-avatar>
      </q-item-section>
      <q-item-section>
        <q-item-label>{{friend.name}}</q-item-label>
        <q-item-label caption>Age: {{friend.age}}</q-item-label>
      </q-item-section>
      <q-item-section side>
        3 min ago
      </q-item-section>
    </q-item>


  </div>
</template>

<script>
  import {mapGetters, mapMutations} from 'vuex'
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
                myID: 'DataStore/myIDGetter',
                myComputedName: 'DataStore/myNameGetter'
            })
        },
        methods:{
            ...mapMutations({
                myName: 'DataStore/myNameChange',
            }),
            onSubmit(){
                if(this.name != "")
                    this.myName(this.name);
                this.name = "";
            },
        }
    };
</script>
