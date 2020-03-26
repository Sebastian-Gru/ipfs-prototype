<template>
  <q-page class="flex column">
    <div class="q-pa-md column col justify-end">
      <q-chat-message
        v-for="message in messages"
        :key="message.text"
        :name="message.from"
        :text="[message.text]"
        :sent=" message.from == 'me'? true: false "
      />

    </div>
    <q-footer elevated>
      <q-toolbar>
        <q-form
          @submit="sendMessage"
          class="full-width">
          <q-input
            v-model="newMessage"
            bg-color="white"
            outlined
            rounded
            label="Message"
            dense>

            <template v-slot:after>
              <q-btn
                @click="sendMessage"
                round
                dense
                flat
                type="submit"
                color="white"
                icon="send" />
            </template>
          </q-input>
        </q-form>
      </q-toolbar>
    </q-footer>
  </q-page>
</template>

<script>
export default {
  data () {
      return{
          newMessage: '',
          messages: [
              {
                  text: 'Hey du!',
                  from: 'them'
              },
              {
                  text: 'Hello, was geht bei dir',
                  from: 'me'
              },
              {
                  text: 'Danke gut und usw',
                  from: 'them'
              },
              {
                  text: 'Was sonst',
                  from: 'them'
              }
          ]
      }

  },
    methods: {
      sendMessage() {
          if (this.newMessage != ''){
          this.messages.push({
              text: this.newMessage,
              from: 'me'
          })
              this.newMessage = ''
          }
      }
    }
}
</script>
