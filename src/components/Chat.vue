<template>
  <div v-if='!loading' class='main flex-1 flex flex-col'>
    <div class='hidden lg:block heading flex-2'>
      <h1 class='text-3xl text-gray-700 mb-4'>Chat</h1>
    </div>

    <div class='flex-1 flex'>
      <div
        :class="['transition-all', 'duration-700', 'flex-2', 'flex-col', 'pr-0',
                 isChatsSidebarOpen? 'w-72' : 'w-0', 'overflow-hidden',
                 'bg-gray-200', 'absolute', 'right-0', 'h-full', 'bot-0', 'top-0', 'z-20',
                 'lg:pr-6', 'lg:static', 'lg:w-1/3', 'lg:bg-transparent', 'lg:z-0']"
        style='@media (min-width: 1280px) {
              height: 585px}'>
        <div class='search  flex-2 pb-6 px-2'>
          <div @click='closeChatsSideBar' class='text-gray-500 mt-2'>
            <svg xmlns='http://www.w3.org/2000/svg' class='h-8 w-8 lg:hidden cursor-pointer' fill='none'
                 viewBox='0 0 24 24'
                 stroke='currentColor'>
              <path stroke-linecap='round' stroke-linejoin='round' stroke-width='2' d='M17 8l4 4m0 0l-4 4m4-4H3' />
            </svg>
          </div>
          <input v-model='searchRoomKeyWord'
                 type='text'
                 @keypress.enter='searchByKeyWord'
                 class='outline-none py-2 block w-full w- bg-transparent border-b-2 border-gray-300 xl:border-gray-200 mt-3 xl:mt-0'
                 placeholder='Search'>
        </div>
        <div v-if='!isChatsEmpty && chats.length === 0' class='h-full flex flex-col items-center justify-center'>
          <span class='text-gray-400 font-bold text-2xl'>You haven't chats yet</span>
        </div>
        <div v-else-if='chats.length > 0'
             class='flex flex-col flex-1 overflow-y-auto overflow-x-hidden px-2'>
          <div v-for='chat in chats'
               v-bind:key='`chat:${chat.id}`'
               @click='goToChat(chat.user.id)'
               class='entry cursor-pointer transform hover:scale-105 duration-300 transition-transform bg-white mb-4 rounded p-4 flex shadow-md'>
            <div class='flex-2'>
              <div class='w-12 h-12 relative'>
                <img class='w-12 h-12 rounded-full mx-auto avatar'
                     :src='chat.user.avatar || "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQu0-fKmFYBxGphUZr4RIuBC4GyMSuZo1htnA&usqp=CAU"'
                     alt='chat-user' />
                <span v-if='chat.user.is_online'
                      class='absolute w-4 h-4 bg-green-400 rounded-full right-0 bottom-0 border-2 border-white'>
                </span>
                <span v-else
                      class='absolute w-4 h-4 bg-gray-400 rounded-full right-0 bottom-0 border-2 border-white'>
                </span>
              </div>
            </div>
            <div class='flex-1 px-2'>
              <div class='truncate w-32'><span class='text-gray-800'>{{ chat.user.name }}</span></div>
              <div><small :ref='`lastMessageRoom${chat.id}`' class='text-gray-600'>{{ chat.lastMessage.message
                }}</small></div>
            </div>
            <div class='flex-2 text-right'>
              <div><small
                class='text-gray-500'>{{ Date.parse(chat.lastMessage.created_at) | dateMonthDay }}</small></div>
              <div v-if='chat.unreadMessagesCount > 0'>
                <small
                  class='text-xs bg-red-500 text-white rounded-full h-6 w-6 leading-6 text-center inline-block'>
                  {{ chat.unreadMessagesCount }}
                </small>
              </div>
            </div>
          </div>
          <infinite-loading ref='chatInfiniteLoading' @infinite='chatsInfinityHandler'>
            <div slot='no-more'></div>
            <div slot='no-results'></div>
          </infinite-loading>
        </div>
      </div>
      <div v-if='$route.params.id' class='chat-area flex-1 flex flex-col' style='height: 625px'>
        <div class='flex-3'>
          <h2 class='text-xl py-1 mb-8 border-b-2 border-gray-200'>Chatting with <b>{{ currentChatUser.name }}</b></h2>
        </div>
        <div ref='chatBox' class='messages flex-1 overflow-auto'>
          <infinite-loading direction='top' @infinite='infiniteHandler'>
            <div slot='no-more'></div>
            <div slot='no-results'></div>
          </infinite-loading>
          <div v-for='(message, index) in messages' v-bind:key='message.content' class='message flex flex-col'>
            <div v-if='isDaysDiff(messages[index !== 0 ? index - 1 : 0].created_at, messages[index].created_at)'
                 class='self-center mb-2 w-full text-center border-t border-gray-400 text-gray-400 font-semibold'>
              {{ message.created_at | dateMonthDay }}
            </div>
            <div v-else-if='index === 0'
                 class='self-center mb-2 w-full text-center border-t border-gray-400 text-gray-400 font-semibold'>
              {{ message.created_at | dateMonthDay }}
            </div>

            <div v-if='message.user.id !== authUser.id' class='flex'>
              <div class='relative'>
                <div
                  @click='openUserCard(message.id)'
                  class='flex-2 cursor-pointer'>
                  <div class='w-12 h-12 relative'>
                    <img :id='message.id' class='w-12 h-12 rounded-full mx-auto avatar'
                         :src='currentChatUser.avatar'
                         alt='chat-user' />
                  </div>
                </div>
                <div :ref='"userCard" + message.id' class='hidden' v-click-outside='vcoUserCardConfig'>
                  <UserCard />
                </div>
              </div>
              <div class='flex-1 px-2'>
                <img v-img:chatMessage v-if='message.privateFile' :src='message.privateFile.url' alt='chat photo'
                     style='height: 300px'>
                <div v-else class='inline-block bg-gray-300 rounded-full p-2 px-6 text-gray-700'>
                  <span>{{ message.message }}</span>
                </div>
                <div class='pl-4'><small class='text-gray-500'>{{ message.created_at | dateHoursMinutes }}</small></div>
              </div>
            </div>
            <div v-else class='w-full message flex items-end justify-items-end text-right'>
              <div
                :class="['flex-1', 'px-2', {'messageBox': !message.is_read}]">
                <img v-img:chatMessage v-if='message.privateFile' class='inline-block ml-auto mr-0'
                     :src='message.privateFile.url' alt=''
                     style='height: 300px'>
                <div v-else class='inline-block bg-blue-600 rounded-full p-2 px-6 text-white'>
                  <span>{{ message.message }}</span>
                </div>
                <div class='pr-4'><small class='text-gray-500'>{{ message.created_at | dateHoursMinutes }}</small></div>
              </div>
            </div>
          </div>
        </div>
        <span
          :class="['text-gray-400', 'animate-pulse', showTyping ? 'visible' : 'invisible']"> {{ `${currentChatUser.name} typing. . .`
          }} </span>
        <div class='flex-2 pt-2 pb-10'>
          <div class='write bg-white shadow flex rounded-lg'>
            <div class='flex-3 flex content-center items-center text-center p-4 pr-0 relative'>
              <span class='block text-center text-gray-400 hover:text-gray-800 cursor-pointer'
                    @click='toggleEmojiPicker'>
                <svg fill='none' stroke-linecap='round' stroke-linejoin='round'
                     stroke-width='2' stroke='currentColor' viewBox='0 0 24 24'
                     class='h-6 w-6 emojiPicker'><path class='emojiPicker'
                                                       d='M14.828 14.828a4 4 0 01-5.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z'></path></svg>
              </span>
              <Picker v-show='showEmojiPicker'
                      class='absolute left-0 right-20 bottom-14'
                      :data='emojiIndex'
                      v-click-outside='vcoConfig'
                      :showPreview='false'
                      set='google'
                      @select='addEmoji' />
            </div>
            <div class='flex-1'>
                      <textarea
                        ref='textarea'
                        @keypress.enter.prevent='sendMessage'
                        @keypress='regulateTypingEvent'
                        v-model='message' name='message'
                        class='w-full whitespace-nowrap resize-none block border-none outline-none py-4 px-4 bg-transparent'
                        rows='1'
                        placeholder='Type a message...' autofocus>
                      </textarea>
            </div>
            <div
              v-if='uploadFile'
              id='empty-cover-art'
              class='rounded pt-2 text-center  relative'>
              <svg class='mx-auto feather feather-image opacity-50' xmlns='http://www.w3.org/2000/svg' width='40'
                   height='40'
                   viewBox='0 0 24 24' fill='none' stroke='currentColor' stroke-width='2' stroke-linecap='round'
                   stroke-linejoin='round'>
                <rect x='3' y='3' width='18' height='18' rx='2' ry='2'></rect>
                <circle cx='8.5' cy='8.5' r='1.5'></circle>
                <polyline points='21 15 16 10 5 21'></polyline>
              </svg>
              <div class='opacity-50'>
                {{ uploadFile.name }}
              </div>
              <button
                @click='deleteFile'
                type='button'
                class='absolute -top-2.5 -right-4 bg-white rounded-full p-2 inline-flex items-center justify-center text-gray-400 hover:text-gray-500 bg-red-600 hover:bg-red-700 focus:outline-none '>
                <span class='sr-only'>Close menu</span>
                <svg class='h-3 w-3' xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 24 24'
                     stroke='white' aria-hidden='true'>
                  <path stroke-linecap='round' stroke-linejoin='round' stroke-width='2' d='M6 18L18 6M6 6l12 12' />
                </svg>
              </button>
            </div>
            <div class='flex-2 w-32 p-2 flex content-center items-center'>
              <div class='flex-1 text-center '>
                <label for='uploadFile'>
                  <input type='file' id='uploadFile' accept='.jpg, .jpeg, .png,' class='hidden'
                         @change='attachFile'>
                  <span class='text-gray-400 hover:text-gray-800'>
                  <span class='inline-block align-text-bottom cursor-pointer'>
                    <svg fill='none' stroke-linecap='round' stroke-linejoin='round'
                         stroke-width='2' stroke='currentColor' viewBox='0 0 24 24'
                         class='w-6 h-6'><path
                      d='M15.172 7l-6.586 6.586a2 2 0 102.828 2.828l6.414-6.586a4 4 0 00-5.656-5.656l-6.415 6.585a6 6 0 108.486 8.486L20.5 13'></path></svg>
                  </span>
                </span>
                </label>
              </div>
              <div class='flex-1'>
                <button
                  @click='sendMessage'
                  class='bg-blue-400 hover:bg-blue-600 w-10 h-10 rounded-full inline-block outline-none focus:outline-none'>
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
import { mapActions, mapGetters, mapMutations } from 'vuex';
import InfiniteLoading from 'vue-infinite-loading';
import data from 'emoji-mart-vue-fast/data/all.json';
import 'emoji-mart-vue-fast/css/emoji-mart.css';
import { Picker, EmojiIndex } from 'emoji-mart-vue-fast';
import UserCard from './UserCard';

let emojiIndex = new EmojiIndex(data);

export default {
  name: 'Chat',
  components: {
    InfiniteLoading,
    Picker,
    UserCard,
  },
  data() {
    return {
      loading: true,

      message: '',
      uploadFile: null,
      page: 1,
      isTyping: false,
      typingTimeout: null,
      showTyping: false,

      showUserCard: false,
      currentOpenCard: null,

      emojiIndex: emojiIndex,
      showEmojiPicker: false,
      vcoConfig: {
        handler: this.closeEmojiPicker,
        events: ['click'],
        middleware: this.emojiPickerMiddleware,
      },

      vcoUserCardConfig: {
        handler: this.closeUserCard,
        events: ['click'],
        middleware: this.userCardMiddleware,
      },

      searchRoomKeyWord: '',
    };
  },
  methods: {
    ...mapActions(['getChatsByKeyWord', 'getAllUsers', 'getUserById', 'getMessages', 'getAllChats', 'getUpdatedChats']),
    ...mapMutations(
      [
        'DELETE_MESSAGES', 'UPDATE_MESSAGES', 'ADD_MESSAGE',
        'UPDATE_CHAT_UNREAD_MESSAGES', 'UPDATE_USER_ONLINE_STATUS', 'DELETE_CHATS']),
    sendMessage() {
      if (this.message !== '' || this.uploadFile) {
        const sendMessageDTO = {
          message: this.message,
          roomId: this.currentChatRoom,
          receiverId: this.currentChatUser.id,
          userId: this.authUser.id,
        };
        if (this.uploadFile) {
          sendMessageDTO.privateFile = {
            buffer: this.uploadFile,
            originalname: this.uploadFile.name,
            type: this.uploadFile.type,
          };
        }
        this.$socket.emit('sendMessage', sendMessageDTO);
        this.sendTypingEvent(false);
      }
      this.message = '';
      this.deleteFile();
    },
    scrollToBottom() {
      if (this.$refs.chatBox) {
        const elem = this.$refs.chatBox;
        elem.scrollTop = elem.scrollHeight;
      }
    },
    regulateTypingEvent(event) {
      if (event.key !== 'Enter') {
        if (!this.isTyping) {
          this.isTyping = true;
          this.sendTypingEvent(this.isTyping);
        }
        clearTimeout(this.typingTimeot);
        this.typingTimeot = setTimeout(() => {
          this.isTyping = false;
          this.sendTypingEvent(this.isTyping);
        }, 3000);
      } else {
        this.isTyping = false;
        this.sendTypingEvent(this.isTyping);
      }
    },
    sendTypingEvent(status) {
      this.$socket.emit('typing', {
        isTyping: status,
        roomId: this.currentChatRoom,
      });
    },
    goToChat(id) {
      this.$store.commit('CHANGE_CHAT_SIDEBAR_STATUS', false);
      this.$router.replace({ name: 'chat', params: { id: id } }).catch(err => err);
    },
    openUserCard(messageId) {
      if (this.currentOpenCard) {
        this.closeUserCard(this.currentOpenCard);
      }
      this.currentOpenCard = messageId;
      const userCard = this.$refs[`userCard${messageId}`][0];
      userCard.style.display = 'block';
      this.showUserCard = true;

    },
    closeUserCard() {
      if (this.currentOpenCard) {
        this.$refs[`userCard${this.currentOpenCard}`][0].style.display = 'none';
        this.currentOpenCard = null;
        this.showUserCard = false;
      }
    },
    userCardMiddleware(event) {
      return event.target.id ? event.target.id === this.currentOpenCard : true;
    },
    infiniteHandler($state) {
      this.page += 1;
      this.getMessages({
        id: this.$route.params.id,
        params: { page: this.page },
      }).then(() => {
        if (this.isMessagesEnd) {
          $state.complete();
        } else
          $state.loaded();
      });
    },
    toggleEmojiPicker() {
      this.showEmojiPicker = !this.showEmojiPicker;
    },
    closeEmojiPicker() {
      if (this.showEmojiPicker) {
        this.showEmojiPicker = false;
      }
    },
    emojiPickerMiddleware(event) {
      return event.target.className.animVal ? !event.target.className.animVal.includes('emojiPicker') : true;
    },
    addEmoji(emoji) {
      const textarea = this.$refs.textarea;
      const cursorPosition = textarea.selectionEnd;
      const start = this.message.substring(0, textarea.selectionStart);
      const end = this.message.substring(textarea.selectionStart);
      this.message = start + emoji.native + end;
      textarea.focus();
      this.$nextTick(() => {
        textarea.selectionEnd = cursorPosition + emoji.native.length;
      });
    },
    markSeenMessages() {
      const unreadMessages = this.messages.filter((message) => !message.is_read && message.user.id !== this.authUser.id);
      if (unreadMessages.length > 0) {
        this.$socket.emit('markSeenMessages', unreadMessages);
        this.UPDATE_CHAT_UNREAD_MESSAGES(this.currentChatRoom);
      }
    },
    chatsInfinityHandler($state) {
      this.getChatsWithParams().then(() => {
        if (this.isChatsEnd) {
          $state.complete();
        } else
          $state.loaded();
      });
    },
    getChatsWithParams() {
      return this.getAllChats({
        params: { page: this.chatsPage, keyWord: this.searchRoomKeyWord },
      });
    },
    updateChats() {
      if (this.$refs.chatInfiniteLoading) {
        this.$refs.chatInfiniteLoading.stateChanger.reset();
      }
      this.getUpdatedChats();
    },
    searchByKeyWord() {
      this.getChatsByKeyWord({ keyWord: this.searchRoomKeyWord }).then(() => {
        if (this.$refs.chatInfiniteLoading) {
          this.$refs.chatInfiniteLoading.stateChanger.reset();
        }
      });
    },
    attachFile(e) {
      this.uploadFile = e.target.files[0];
    },
    deleteFile() {
      this.uploadFile = null;
    },
    isDaysDiff(prevDate, currentDate) {
      const firstDate = new Date(prevDate);
      const secondDate = new Date(currentDate);
      return secondDate.getDate() !== firstDate.getDate();
    },
    closeChatsSideBar() {
      this.$store.commit('CHANGE_CHAT_SIDEBAR_STATUS', false);
    },
  },
  computed: {
    ...mapGetters([
      'chatsPage', 'authUser', 'usersList',
      'currentChatUser', 'messages', 'currentChatRoom',
      'chats', 'messagesCount', 'isMessagesEnd',
      'isChatsEnd', 'isChatsSidebarOpen', 'isChatsEmpty']),
  },
  mounted() {
    this.getChatsWithParams().then(() => {
      if (this.$route.params.id) {
        return Promise.all(
          [
            this.getMessages({
              id: this.$route.params.id,
              params: { page: this.page },
            }),
            this.getUserById({ id: this.$route.params.id })]);
      }
    }).then(() => {
      this.loading = false;
      if (this.$route.params.id) {
        this.$nextTick(() => {
          this.scrollToBottom();
          this.$refs.textarea.focus();
        });
        this.$socket.emit('joinRoom', this.currentChatRoom);
        this.markSeenMessages();
      }
    });
  },
  destroyed() {
    if (this.$route.params.id) {
      this.$socket.emit('leaveRoom', this.currentChatRoom);
    }
    this.DELETE_MESSAGES();
    this.DELETE_CHATS();
  },
  sockets: {
    receiveMessage(message) {
      if (message.user.id !== this.authUser.id) {
        this.$socket.emit('markSeenMessages', message);
      }
      this.ADD_MESSAGE(message);
      this.updateChats();
      this.$nextTick(() => {
        this.scrollToBottom();
      });
    },
    display(status) {
      this.showTyping = status;
    },
    updateUsersStatus(user) {
      if (user.id !== this.authUser.id) {
        this.UPDATE_USER_ONLINE_STATUS(user);
        if (this.$route.params.id) {
          this.getUserById({ id: this.$route.params.id });
        }
      }
    },
    messageSeen(message) {
      this.UPDATE_MESSAGES(message);
    },
    messagesSeen(messages) {
      this.UPDATE_MESSAGES(messages);
    },
    messageNotification() {
      this.updateChats();
    },
  },
  filters: {
    dateMonthDay(date) {
      return dateFormat(date, 'mmmm dS');
    },
    dateHoursMinutes(date) {
      return dateFormat(date, 'HH:MM');
    },
  },
};
</script>

<style scoped>

.messageBox::before {
  content: ' ';
  display: inline-block;
  margin-right: 10px;
  width: 8px;
  height: 8px;
  background: rgba(37, 99, 235, var(--tw-bg-opacity));
  border-radius: 100%;
}
</style>