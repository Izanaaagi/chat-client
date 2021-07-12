<template>
  <div v-if='!loading' class='main flex-1 flex flex-col'>
    <div class='hidden lg:block heading flex-2'>
      <h1 class='text-3xl text-gray-700 mb-4'>Chat</h1>
    </div>

    <div class='flex-1 flex '>
      <div class='sidebar hidden lg:flex w-1/3 flex-2 flex-col pr-6' style='height: 600px'>
        <div class='search  flex-2 pb-6 px-2'>
          <input type='text' class='outline-none py-2 block w-full bg-transparent border-b-2 border-gray-200'
                 placeholder='Search'>
        </div>
        <div class='flex-1 overflow-y-auto overflow-x-hidden px-2'>
          <div v-for='chat in chats'
               v-bind:key='chat.id'
               class='entry cursor-pointer transform hover:scale-105 duration-300 transition-transform bg-white mb-4 rounded p-4 flex shadow-md'>
            <div class='flex-2'>
              <div class='w-12 h-12 relative'>
                <img class='w-12 h-12 rounded-full mx-auto'
                     src='https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQu0-fKmFYBxGphUZr4RIuBC4GyMSuZo1htnA&usqp=CAU'
                     alt='chat-user' />
                <span
                  class='absolute w-4 h-4 bg-green-400 rounded-full right-0 bottom-0 border-2 border-white'></span>
              </div>
            </div>
            <div class='flex-1 px-2'>
              <div class='truncate w-32'><span class='text-gray-800'>{{ chat.participants[0].user.name }}</span></div>
              <div><small class='text-gray-600'>{{ chat.messages[0].message }}</small></div>
            </div>
            <div class='flex-2 text-right'>
              <div><small
                class='text-gray-500'>{{ Date.parse(chat.messages[0].created_at) | dateMonthDay }}</small></div>
              <div>
                <small
                  class='text-xs bg-red-500 text-white rounded-full h-6 w-6 leading-6 text-center inline-block'>
                  23
                </small>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div class='chat-area flex-1 flex flex-col' style='height: 625px'>
        <div class='flex-3'>
          <h2 class='text-xl py-1 mb-8 border-b-2 border-gray-200'>Chatting with <b>{{ currentChatUser.name }}</b></h2>
        </div>
        <div ref='chatBox' class='messages flex-1 overflow-auto'>
          <div v-for='message in messages' v-bind:key='message.content' class='message flex'>
            <div v-if='message.user.id !== authUser.id' class='flex'>
              <div
                class='flex-2'>
                <div class='w-12 h-12 relative'>
                  <img class='w-12 h-12 rounded-full mx-auto'
                       src='https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQu0-fKmFYBxGphUZr4RIuBC4GyMSuZo1htnA&usqp=CAU'
                       alt='chat-user' />
                  <span
                    class='absolute w-4 h-4 bg-gray-400 rounded-full right-0 bottom-0 border-2 border-white'></span>
                </div>
              </div>
              <div
                class='flex-1 px-2'>
                <div class='inline-block bg-gray-300 rounded-full p-2 px-6 text-gray-700'>
                  <span>{{ message.message }}</span>
                </div>
                <div class='pl-4'><small class='text-gray-500'>15 April</small></div>
              </div>
            </div>
            <div v-else class='w-full message flex text-right'>
              <div class='flex-1 px-2'>
                <div class='inline-block bg-blue-600 rounded-full p-2 px-6 text-white'>
                  <span>{{ message.message }}</span>
                </div>
                <div class='pr-4'><small class='text-gray-500'>15 April</small></div>
              </div>
            </div>
          </div>
        </div>
        <div class='flex-2 pt-2 pb-10'>
          <span class='text-gray-400 animate-pulse'> {{ `${currentChatUser.name} typing. . .` }} </span>
          <div class='write bg-white shadow flex rounded-lg'>
            <div class='flex-3 flex content-center items-center text-center p-4 pr-0'>
              <span class='block text-center text-gray-400 hover:text-gray-800'>
                <svg fill='none' stroke-linecap='round' stroke-linejoin='round'
                     stroke-width='2' stroke='currentColor' viewBox='0 0 24 24'
                     class='h-6 w-6'><path
                  d='M14.828 14.828a4 4 0 01-5.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z'></path></svg>
              </span>
            </div>
            <div class='flex-1'>
                      <textarea
                        @keypress.enter.prevent='sendMessage'
                        v-model='message' name='message'
                        class='w-full whitespace-nowrap resize-none block outline-none py-4 px-4 bg-transparent'
                        rows='1'
                        placeholder='Type a message...' autofocus></textarea>
            </div>
            <div class='flex-2 w-32 p-2 flex content-center items-center'>
              <div class='flex-1 text-center'>
                <span class='text-gray-400 hover:text-gray-800'>
                  <span class='inline-block align-text-bottom'>
                    <svg fill='none' stroke-linecap='round' stroke-linejoin='round'
                         stroke-width='2' stroke='currentColor' viewBox='0 0 24 24'
                         class='w-6 h-6'><path
                      d='M15.172 7l-6.586 6.586a2 2 0 102.828 2.828l6.414-6.586a4 4 0 00-5.656-5.656l-6.415 6.585a6 6 0 108.486 8.486L20.5 13'></path></svg>
                  </span>
                </span>
              </div>
              <div class='flex-1'>
                <button
                  @click='sendMessage'
                  class='bg-blue-400 w-10 h-10 rounded-full inline-block'>
                  <span class='inline-block align-text-bottom'>
                    <svg fill='none' stroke='currentColor' stroke-linecap='round'
                         stroke-linejoin='round' stroke-width='2'
                         viewBox='0 0 24 24' class='w-4 h-4 text-white'><path
                      d='M5 13l4 4L19 7'></path></svg>
                  </span>
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import * as dateFormat from 'dateformat';
import { mapActions, mapGetters } from 'vuex';

export default {
  name: 'Chat',
  data() {
    return {
      loading: true,
      message: '',
      typing: false,
    };
  },
  methods: {
    ...mapActions(['getAllUsers', 'getUserById', 'getMessages', 'getAllChats']),
    sendMessage() {
      if (this.message !== '') {
        this.$socket.emit('sendMessage', {
          message: this.message,
          roomId: this.currentChatRoom,
          receiverId: this.currentChatUser.id,
          userId: this.authUser.id,
        });
      }
      this.message = '';
    },
    scrollToBottom() {
      const elem = this.$refs.chatBox;
      elem.scrollTop = elem.scrollHeight;
    },
  },
  computed: {
    ...mapGetters(['authUser', 'usersList', 'currentChatUser', 'messages', 'currentChatRoom', 'chats']),
  },
  mounted() {
    Promise.all([this.getAllUsers({
      take: 10,
      skip: this.currentPage,
      keyWord: '',
    }), this.getMessages({ id: this.$route.params.id }), this.getAllChats()])
      .then(() => {
        if (this.$route.params.id) {
          this.getUserById({ id: this.$route.params.id });
        }
      }).then(() => {
      this.loading = false;

      this.$socket.emit('joinRoom', this.currentChatRoom);
    });
  },
  updated() {
    this.scrollToBottom();
  },
  destroyed() {
    this.$socket.emit('leaveRoom', this.currentChatRoom);
  },
  sockets: {
    receiveMessage: function(message) {
      console.log(message);
      this.messages.push(message);
    },
  },
  filters: {
    dateMonthDay(date) {
      return dateFormat(date, 'mmmm dS');
    },
  },
};
</script>

<style scoped>

</style>