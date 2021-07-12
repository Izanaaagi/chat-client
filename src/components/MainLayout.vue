<template>
  <div v-if='!loading' class=' w-full h-screen'>
    <div class='flex h-full'>
      <div class='hidden xl:block sm:flex-2 w-64 bg-gray-200'>
        <div class='user-profile text-center'>
          <div class='w-32 h-32 rounded-full m-auto mt-16 border-2 border-white bg-white shadow-lg'>
            <img
              src='https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQu0-fKmFYBxGphUZr4RIuBC4GyMSuZo1htnA&usqp=CAU'
              alt='user' class='block rounded-full'>
          </div>
          <div class='text-gray-800 mt-8'>
            {{ authUser.name }}
            <span class='inline-block align-text-bottom'>
                            <svg fill='none' stroke='currentColor' stroke-linecap='round' stroke-linejoin='round'
                                 stroke-width='2' viewBox='0 0 24 24' class='w-4 h-4'><path
                              d='M19 9l-7 7-7-7'></path></svg>
                        </span>
          </div>
        </div>

        <div class='menu mt-8'>
          <router-link
            class='block py-4 px-12 text-gray-600 hover:bg-gray-300 hover:text-black'
            :to="{name: 'chat'}">
                        <span class='inline-block align-text-bottom mr-2'>
                            <svg fill='none' stroke='currentColor' stroke-linecap='round' stroke-linejoin='round'
                                 stroke-width='2' viewBox='0 0 24 24' class='w-4 h-4'><path
                              d='M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z'></path></svg>
                        </span>
            Chat
          </router-link>
          <router-link class='block py-4 px-12 border-l-4 text-gray-600 hover:bg-gray-300 hover:text-black'
                       :to="{name: 'users' }">
                        <span class='inline-block align-text-bottom mr-2'>
                            <svg
                              fill='none'
                              stroke='currentColor'
                              viewBox='0 0 24 24'
                              class='w-5 h-5'><path
                              d='M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z' /></svg>
                        </span>
            Users
          </router-link>
          <a class='block py-4 px-12 border-l-4 text-gray-600 hover:bg-gray-300 hover:text-black'
             href='javascript:return false;'>
                        <span class='inline-block align-text-bottom mr-2'>
                            <svg fill='none' stroke='currentColor' stroke-linecap='round' stroke-linejoin='round'
                                 stroke-width='2' viewBox='0 0 24 24' class='w-4 h-4'><path
                              d='M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z'></path><path
                              d='M15 12a3 3 0 11-6 0 3 3 0 016 0z'></path></svg>
                        </span>
            Settings
          </a>
        </div>
      </div>
      <div class='flex-1 bg-gray-100 w-full h-full'>
        <div class='main-body container m-auto w-11/12  h-full flex flex-col'>
          <div class='py-4 flex-2 flex flex-row'>
            <div class='flex-1'>
                            <span class='xl:hidden inline-block text-gray-700 hover:text-gray-900 align-bottom'>
                                <span class='block h-6 w-6 p-1 rounded-full hover:bg-gray-400'>
                                    <svg class='w-4 h-4' fill='none' stroke-linecap='round' stroke-linejoin='round'
                                         stroke-width='2' stroke='currentColor' viewBox='0 0 24 24'><path
                                      d='M4 6h16M4 12h16M4 18h16'></path></svg>
                                </span>
                            </span>
              <span class='lg:hidden inline-block ml-8 text-gray-700 hover:text-gray-900 align-bottom'>
                                <span class='block h-6 w-6 p-1 rounded-full hover:bg-gray-400'>
                                    <svg class='h-4 w-4' fill='none' stroke-linecap='round' stroke-linejoin='round'
                                         stroke-width='2' stroke='currentColor' viewBox='0 0 24 24'><path
                                      d='M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z'></path></svg>
                                </span>
                            </span>
            </div>
            <div class='flex flex-col'>
              <button class='flex-1 text-right focus:outline-none hover:bg-gray-200' @click='toggleDropdown'>
                            <span class='inline-block text-gray-700'>
                                Status: <span
                              class='inline-block align-text-bottom w-4 h-4 bg-green-400 rounded-full border-2 border-white'></span> <b>Online</b>
                                <span class='inline-block align-text-bottom'>
                                    <svg fill='none' stroke='currentColor' stroke-linecap='round'
                                         stroke-linejoin='round' stroke-width='2' viewBox='0 0 24 24' class='w-4 h-4'><path
                                      d='M19 9l-7 7-7-7'></path></svg>
                                </span>
                            </span>

              </button>
              <div
                v-bind:class="{'hidden': !dropdownShow, 'block': dropdownShow}"
                class='relative'>
                <div
                  class='block absolute bg-white text-base z-50 float-left py-2 list-none text-left rounded shadow-lg mt-1'>
                  <button
                    @click='leaveAccount'
                    class='hover:bg-gray-100 text-sm py-2 px-4 font-normal block w-full whitespace-nowrap bg-transparent  text-blueGray-700'>
                    Logout
                  </button>
                </div>
              </div>
            </div>
          </div>
          <router-view></router-view>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { mapActions, mapGetters } from 'vuex';

export default {
  name: 'MainLayout',
  data() {
    return {
      dropdownShow: false,
      loading: true,
    };
  },
  methods: {
    ...mapActions(['logout', 'getAuthUser']),
    leaveAccount() {
      this.logout()
        .then(() => {
          if (!this.isAuth) {
            this.$router.push({ name: 'login' });
          }
        });
    },
    toggleDropdown() {
      this.dropdownShow = !this.dropdownShow;
    },
  },
  computed: {
    ...mapGetters(['authUser', 'isAuth']),
  },
  created() {
    Promise.all([this.getAuthUser()])
      .then(() => {
        this.loading = false;
      });
  },
};
</script>

<style>
.router-link-active {
  font-weight: 700;
  border-left-width: 4px;

  --tw-border-opacity: 1;
  border-color: rgba(31, 41, 55, var(--tw-border-opacity));
  --tw-bg-opacity: 1;
  background-color: rgba(209, 213, 219, var(--tw-bg-opacity));
  color: black;
}
</style>