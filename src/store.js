import Vue from 'vue';
import Vuex from 'vuex';
import axios from 'axios';
import cookies from 'vue-cookies';

Vue.use(Vuex);

export const store = new Vuex.Store({
  state: {
    isAuth: cookies.isKey('Authentication'),
    user: {},
    usersList: [],

    messages: [],
    chats: [],
    currentChatUser: {},
    currentChatRoom: null,
  },
  mutations: {
    SET_AUTH_STATUS: (state, status) => {
      state.isAuth = status;
    },
    SET_AUTH_USER: (state, user) => {
      state.user = user;
    },
    SET_USERS_LIST: (state, usersList) => {
      state.usersList = usersList;
    },
    SET_CURRENT_CHAT_USER: (state, user) => {
      state.currentChatUser = user;
    },
    SET_MESSAGES: (state, messages) => {
      state.messages = messages;
    },
    SET_CHAT_ROOM: (state, roomId) => {
      state.currentChatRoom = roomId;
    },
    SET_CHATS: (state, chats) => {
      state.chats = chats;
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
      return axios.get(`/users`, { params: { take: payload.take, skip: payload.skip, keyWord: payload.keyWord } })
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
      return axios.get(`/chat/${payload.id}`)
        .then(response => {
          context.commit('SET_MESSAGES', response.data.messages);
          context.commit('SET_CHAT_ROOM', response.data.roomId);
        });
    },
    getAllChats: (context) => {
      return axios.get(`/chat`)
        .then(response => {
          context.commit('SET_CHATS', response.data);
        });
    },

  },
  getters: {
    isAuth: state => state.isAuth,
    authUser: state => state.user,
    usersList: state => state.usersList,

    messages: state => state.messages,
    chats: state => state.chats,
    currentChatUser: state => state.currentChatUser,
    currentChatRoom: state => state.currentChatRoom,
  },
});