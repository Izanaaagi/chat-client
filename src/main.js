import Vue from 'vue';
import App from './App';
import { router } from './routes';
import { store } from './store';
import './assets/tailwind.css';
import Axios from 'axios';
import VueCookies from 'vue-cookies';
import VueSocketIO from 'vue-socket.io';
import Paginate from 'vuejs-paginate';


Vue.use(VueCookies);

Vue.use(new VueSocketIO({
  debug: true,
  connection: 'http://localhost:5000',
  vuex: {
    store,
    actionPrefix: 'SOCKET_',
    mutationPrefix: 'SOCKET_',
  },
}));

Axios.defaults.withCredentials = true;
Axios.defaults.baseURL = 'http://localhost:5000/api';

Axios.interceptors.response.use((response) => {
  return response;
}, (error) => {
  if (error.response.status === 401) {
    store.commit('SET_AUTH_STATUS', false);
    VueCookies.remove('Authentication');
    router.push({ name: 'login' });
  }
  if (error.response.status === 404) {
    router.push({ name: '404' });
  }
  return Promise.reject(error.message);
});

Vue.component('paginate', Paginate);

new Vue({
  render: h => h(App),
  router,
  store,
}).$mount('#app');
