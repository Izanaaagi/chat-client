import Vue from 'vue';
import App from './App';
import { router } from './routes';
import { store } from './store';
import './assets/tailwind.css';
import Axios from 'axios';
import VueCookies from 'vue-cookies';
import VueSocketIO from 'vue-socket.io';
import Notifications from 'vue-notification';
import VueTailwind from 'vue-tailwind';
import { settings } from './vueTailwindSettings';
import SocketIO from 'socket.io-client';
import vClickOutside from 'v-click-outside';
import VueImg from 'v-img';

const BASE_URL = process.env.NODE_ENV === 'development' ? 'http://localhost:5000' : 'http://139.185.41.90:5000';

Axios.defaults.withCredentials = true;
Axios.defaults.baseURL = `${BASE_URL}/api`;

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
  return Promise.reject(error);
});

Vue.use(VueCookies);

Vue.use(new VueSocketIO({
  debug: true,
  connection: SocketIO(BASE_URL, {
    autoConnect: false,
    withCredentials: true,
    transports: ['websocket'],
  }),
  vuex: {
    store,
    actionPrefix: 'SOCKET_',
    mutationPrefix: 'SOCKET_',
  },
}));

Vue.use(Notifications);
Vue.use(VueTailwind, settings);
Vue.use(vClickOutside);
Vue.use(VueImg);

new Vue({
  render: h => h(App),
  router,
  store,
}).$mount('#app');
