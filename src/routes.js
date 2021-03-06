import VueRouter from 'vue-router';
import Vue from 'vue';
import Register from './components/Register';
import Login from './components/Login';
import Chat from './components/Chat';
import Page404 from './components/Page404';
import { store } from './store';
import Users from './components/Users';
import MainLayout from './components/MainLayout';

Vue.use(VueRouter);

export const router = new VueRouter({
  mode: 'history',
  routes: [
    { path: '/', redirect: '/login' },
    { path: '/register', component: Register, name: 'register', meta: { guestRoute: true, title: 'Register' } },
    { path: '/login', component: Login, name: 'login', meta: { guestRoute: true, title: 'Login' } },

    {
      path: '/chat',
      component: MainLayout,
      children: [
        { path: ':id?', component: Chat, name: 'chat', meta: { title: 'Chat' } },
        { path: '/users/:page?', component: Users, name: 'users', meta: { title: 'Users' } },
      ],
    },


    { path: '*', component: Page404, name: '404', meta: { title: 'Error' } },
  ],
});

router.beforeEach((to, from, next) => {
  if (to.meta.guestRoute && store.getters.isAuth) {
    next({ name: 'chat' });
  }
  if (!to.meta.guestRoute && !store.getters.isAuth) {
    next({ name: 'login' });
  }
  next();
});

router.beforeEach((to, from, next) => {
  document.title = to.meta.title;
  next();
});