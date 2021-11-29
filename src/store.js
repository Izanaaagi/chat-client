import Vue from 'vue';
import Vuex from 'vuex';
import axios from 'axios';
import cookies from 'vue-cookies';

Vue.use(Vuex);

export const store = new Vuex.Store({
  state: {
    isAuth: cookies.isKey('Authentication'),
    user: {},
    isNameChanged: false,
    uploadedFile: null,

    usersList: [],

    messages: [],
    messagesCount: 0,
    isMessagesEnd: false,
    chats: [],
    isChatsEnd: false,
    isChatsEmpty: false,
    chatsPage: 1,
    currentChatUser: {},
    currentChatRoom: null,

    isChatsSidebarOpen: false,
  },
  mutations: {
    SET_AUTH_STATUS: (state, status) => {
      state.isAuth = status;
    },
    SET_AUTH_USER: (state, user) => {
      state.user = user;
    },
    SET_CHANGE_NAME_STATUS: (state, status) => {
      state.isNameChanged = status;
    },
    SET_USERS_LIST: (state, usersList) => {
      state.usersList = usersList;
    },
    SET_CURRENT_CHAT_USER: (state, user) => {
      state.currentChatUser = user;
    },
    SET_MESSAGES: (state, messages) => {
      if (state.messages.length === 0) {
        state.messages = messages.reverse();
      } else {
        state.messages.unshift(...messages.reverse());
      }
    },
    ADD_MESSAGE: (state, message) => {
      state.messages.push(message);
    },
    UPDATE_MESSAGES: (state, messages) => {
      if (Array.isArray(messages)) {
        const index = state.messages.length - messages.length;
        state.messages.splice(index, messages.length, ...messages);
      } else {
        const index = state.messages.findIndex(msg => msg.id === messages.id);
        if (index !== -1) state.messages.splice(index, 1, messages);
      }
    },

    SET_MESSAGES_COUNT: (state, messagesCount) => {
      state.messagesCount = messagesCount;
    },
    DELETE_MESSAGES: (state) => {
      state.messages = [];
    },
    CHANGE_MESSAGES_END_STATUS: (state, status) => {
      state.isMessagesEnd = status;
    },
    SET_CHAT_ROOM: (state, roomId) => {
      state.currentChatRoom = roomId;
    },
    SET_CHATS: (state, chats) => {
      if (state.chats.length !== 0 && !state.isChatsEnd) {
        state.chats.push(...chats);
      } else {
        state.chats = chats;
      }
    },
    DELETE_CHATS: (state) => {
      state.chats = [];
      state.chatsPage = 1;
      state.isChatsEnd = false;
    },
    SET_UPDATED_CHATS: (state, chats) => {
      state.chatsPage = 1;
      state.isChatsEnd = false;
      state.chats = chats;
    },
    SET_CHATS_BY_KEYWORD: (state, chats) => {
      state.chatsPage = 2;
      state.chats = chats;
    },
    INCREMENT_CHAT_PAGE: (state) => {
      state.chatsPage++;
    },
    CHANGE_CHATS_END_STATUS: (state, status) => {
      state.isChatsEnd = status;
    },
    SET_CHATS_EMPTY_STATUS: (state, status) => {
      state.isChatsEmpty = status;
    },
    UPDATE_CHAT_UNREAD_MESSAGES: (state, chatId) => {
      const index = state.chats.findIndex(chat => chat.id === chatId);
      if (index !== -1) {
        delete state.chats[index].unreadMessagesCount;
      }
    },
    UPDATE_USER_ONLINE_STATUS: (state, user) => {
      const userIndex = state.chats.findIndex((chat) => chat.user.id === user.id);
      if (userIndex !== -1) {
        state.chats[userIndex].user = user;
      }
    },
    SET_UPLOADED_FILE: (state, file) => {
      state.uploadedFile = file;
    },
    SET_AVATAR: (state, avatar) => {
      state.user.avatar = avatar;
    },
    CHANGE_CHAT_SIDEBAR_STATUS: (state, status) => {
      state.isChatsSidebarOpen = status;
    },
  },
  actions: {
    login: (context, payload) => {
      return axios.post(`/auth/login`, payload)
        .then(response => {
          context.commit('SET_AUTH_STATUS', true);
          console.log(response);
        });
    },
    register: (context, payload) => {
      return axios.post(`/auth/register`, payload)
        .then(response => {
          console.log(response);
        });
    },
    logout: (context) => {
      return axios.post(`/auth/logout`)
        .then(response => {
          context.commit('SET_AUTH_STATUS', false);
          console.log(response);
        });
    },
    getAuthUser: (context) => {
      return axios.get(`/users/getMe`)
        .then(response => {
          const user = response.data;
          context.commit('SET_AUTH_USER', user);
        });
    },
    getAllUsers: (context, payload) => {
      return axios.get(`/users`, { params: payload.params })
        .then(response => {
          const users = response.data;
          context.commit('SET_USERS_LIST', users);
        });
    },
    getUserById: (context, payload) => {
      return axios.get(`/users/${payload.id}`)
        .then(response => {
          const user = response.data;
          context.commit('SET_CURRENT_CHAT_USER', user);
        });
    },
    getMessages: (context, payload) => {
      return axios.get(`/chat/${payload.id}`, { params: payload.params })
        .then(response => {
          if (response.status === 204) {
            context.commit('CHANGE_MESSAGES_END_STATUS', true);
          } else if (response.data.count > 0) {
            context.commit('SET_MESSAGES', response.data.messages);
            context.commit('CHANGE_MESSAGES_END_STATUS', false);
            context.commit('SET_CHAT_ROOM', response.data.roomId);
            context.commit('SET_MESSAGES_COUNT', response.data.count);
          } else if (response.data.count === 0) {
            context.commit('CHANGE_MESSAGES_END_STATUS', true);
            context.commit('SET_CHAT_ROOM', response.data.roomId);
            context.commit('SET_MESSAGES_COUNT', response.data.count);
          }
        });
    },
    getAllChats: (context, payload) => {
      return axios.get(`/chat`, { params: payload ? payload.params : null })
        .then(response => {
          if (response.status === 204) {
            context.commit('CHANGE_CHATS_END_STATUS', true);
          } else if (response.status === 200) {
            context.commit('CHANGE_CHATS_END_STATUS', false);
            context.commit('SET_CHATS', response.data);
            context.commit('INCREMENT_CHAT_PAGE');
          }
        });
    },
    getUpdatedChats: (context) => {
      return axios.get(`/chat`)
        .then(response => {
          context.commit('SET_UPDATED_CHATS', response.data);
          context.commit('INCREMENT_CHAT_PAGE');
        });
    },
    getChatsByKeyWord: (context, payload) => {
      return axios.get(`/chat`, { params: { keyWord: payload.keyWord } })
        .then(response => {
          context.commit('SET_CHATS_BY_KEYWORD', response.data);
          if (response.status === 204) {
            context.commit('SET_CHATS_EMPTY_STATUS', true);
          }
        });
    },
    changeUsername: (context, payload) => {
      return axios.patch(`/users/${payload.id}`, { name: payload.name })
        .catch((error) => {
          if (error.response.status === 400) {
            Vue.notify({
              group: 'profileSettings',
              type: 'error',
              title: 'Change name error',
              text: error.response.data.message[0],
            });
          }
          context.commit('SET_CHANGE_NAME_STATUS', false);
        })
        .then(response => {
          context.commit('SET_AUTH_USER', response.data);
          context.commit('SET_CHANGE_NAME_STATUS', true);
          return response;
        });
    },
    uploadAvatar: (context, payload) => {
      let file = new FormData();
      file.append('file', payload.file);
      return axios.post('/users/avatar', file)
        .then(response => {
          context.commit('SET_AVATAR', response.data);
        });
    },
  },
  getters: {
    isAuth: state => state.isAuth,
    authUser: state => state.user,
    uploadedFile: state => state.uploadedFile,
    isNameChanged: state => state.isNameChanged,

    usersList: state => state.usersList,

    messages: state => state.messages,
    messagesCount: state => state.messagesCount,
    isMessagesEnd: state => state.isMessagesEnd,

    chats: state => state.chats,
    isChatsEnd: state => state.isChatsEnd,
    isChatsEmpty: state => state.isChatsEmpty,
    chatsPage: state => state.chatsPage,
    currentChatUser: state => state.currentChatUser,
    currentChatRoom: state => state.currentChatRoom,

    isChatsSidebarOpen: state => state.isChatsSidebarOpen,
  },
});