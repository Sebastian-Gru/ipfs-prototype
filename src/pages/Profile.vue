<template>
  <div>
  <h1>Profile</h1>

  <q-separator/>

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
    export default {
        props: {
        },
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
                ]

            }
        }
    };
</script>
