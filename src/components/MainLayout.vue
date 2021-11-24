<template>
  <div v-if='!loading' class=' w-full h-screen'>
    <modal-window ref='changeNameModal'>
      <template v-slot:question>
        <h2 class='text-xl font-bold py-4'>Are you really want change name?</h2>
      </template>
      <template v-slot:content>
        <div class='flex flex-col'>
          <div class='relative'>
            <div class='absolute flex border border-transparent left-0 top-0 h-full w-10'>
              <div
                class='flex items-center justify-center rounded-tl rounded-bl z-10 bg-gray-100 text-gray-600 text-lg h-full w-full'>
                <svg viewBox='0 0 24 24'
                     width='24'
                     height='24'
                     stroke='currentColor'
                     stroke-width='2'
                     fill='none'
                     stroke-linecap='round'
                     stroke-linejoin='round'
                     class='h-5 w-5'>
                  <path d='M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2'></path>
                  <circle cx='12'
                          cy='7'
                          r='4'></circle>
                </svg>
              </div>
            </div>
            <t-input id='name'
                     name='name'
                     type='text'
                     placeholder='Name'
                     v-model='newUsername'
                     ref='changeNameInput'
                     class='text-sm sm:text-base relative w-full border rounded placeholder-gray-400 focus:border-indigo-400 focus:outline-none py-2 pr-2 pl-12'>
            </t-input>
          </div>
        </div>
      </template>
      <template v-slot:actionButton>
        <button
          @click='changeNameAction'
          class='mb-2 md:mb-0 bg-white px-5 py-2 text-sm shadow-sm font-medium tracking-wider border text-gray-600 rounded-full hover:shadow-lg hover:bg-gray-100'>
          Change name
        </button>
      </template>
    </modal-window>
    <modal-window :deletePhotoHook='deletePhotoHook' ref='changePhotoModal'>
      <template v-slot:question>
        <h2 class='text-xl font-bold py-4'>Are you really want change photo?</h2>
      </template>

      <template v-slot:content>
        <upload-file ref='uploadFile'></upload-file>
      </template>
      <template v-slot:actionButton>
        <button
          @click='uploadPhoto'
          class='mb-2 md:mb-0 bg-white px-5 py-2 text-sm shadow-sm font-medium tracking-wider border text-gray-600 rounded-full hover:shadow-lg hover:bg-gray-100'>
          Change photo
        </button>
      </template>
    </modal-window>
    <div class='flex h-full'>
      <div
        :class="[isSidebarOpen? 'w-64' : 'w-0', 'absolute', 'z-20', 'h-full', 'xl:block', 'xl:static', 'sm:flex-2', 'overflow-hidden', 'bg-gray-200', 'transition-all', 'duration-700' ]">
        <div class='user-profile text-center'>
          <div @click='toggleSidebar'
               class='text-gray-500 xl:hidden mt-2 ml-52 cursor-pointer '>
            <svg xmlns='http://www.w3.org/2000/svg' class='h-8 w-8' fill='none' viewBox='0 0 24 24'
                 stroke='currentColor'>
              <path stroke-linecap='round' stroke-linejoin='round' stroke-width='2' d='M7 16l-4-4m0 0l4-4m-4 4h18' />
            </svg>
          </div>
          <div class='w-32 h-32 rounded-full m-auto mt-16 border-2 border-white bg-white shadow-lg'>
            <img
              v-img='{cursor: "pointer"}'
              :src='authUser.avatar'
              alt='user' class='block rounded-full'>
          </div>
          <div class='text-gray-800 mt-8'>
            <button
              class='userSettings flex-1 w-full focus:outline-none transition duration-200 flex items-center justify-center'
              @click='toggleUserMenuDropdown'>
              {{ authUser.name }}
              <span class='userSettings inline-block align-text-bottom'>
                            <svg fill='none' stroke='currentColor' stroke-linecap='round' stroke-linejoin='round'
                                 stroke-width='2' viewBox='0 0 24 24' class='userSettings w-4 h-4 mt-1.5'><path
                              d='M19 9l-7 7-7-7'></path></svg>
                        </span>
            </button>
          </div>
          <div
            v-bind:class="{'hidden': !userMenuDropdownShow, 'block': userMenuDropdownShow}"
            class='relative'
            ref='userMenuDropdown'>
            <div
              v-click-outside='vcoUserSettings'
              class='block absolute bg-white left-16 w-32 text-base z-50 py-2 list-none text-left rounded shadow-lg mt-1'>
              <button
                @click='showChangeNameModal'
                class='hover:bg-gray-100 border-b text-sm py-2 px-4 font-normal block w-full whitespace-nowrap bg-transparent  text-blueGray-700'>
                Change Name
              </button>
              <button
                @click='showChangePhotoModal'
                class='hover:bg-gray-100 text-sm py-2 px-4 font-normal block w-full whitespace-nowrap bg-transparent  text-blueGray-700'>
                Change Avatar
              </button>
            </div>
          </div>
        </div>

        <div class='menu mt-8 flex flex-col xl:max-h-full '>
          <router-link
            class='block py-4 px-12 text-gray-600 hover:bg-gray-300 hover:text-black flex items-center'
            :to="{name: 'chat'}">
                        <span class='inline-block align-text-bottom mr-2'>
                            <svg fill='none' stroke='currentColor' stroke-linecap='round' stroke-linejoin='round'
                                 stroke-width='2' viewBox='0 0 24 24' class='w-4 h-4'><path
                              d='M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z'></path></svg>
                        </span>
            Chat
          </router-link>
          <router-link
            class='block py-4 px-12 border-l-4 text-gray-600 hover:bg-gray-300 hover:text-black flex items-center'
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
        </div>
      </div>
      <div class='flex-1 bg-gray-100 w-full h-full'>
        <div class='main-body container m-auto w-11/12  h-full flex flex-col'>
          <div class='py-4 flex-2 flex flex-row'>
            <div class='flex-1'>
                            <span @click='toggleSidebar'
                                  class='xl:hidden inline-block text-gray-700 hover:text-gray-900 align-bottom cursor-pointer'>
                                <span class='block h-6 w-6 p-1 rounded-full hover:bg-gray-400'>
                                    <svg class='w-4 h-4' fill='none' stroke-linecap='round' stroke-linejoin='round'
                                         stroke-width='2' stroke='currentColor' viewBox='0 0 24 24'><path
                                      d='M4 6h16M4 12h16M4 18h16'></path></svg>
                                </span>
                            </span>
              <span @click='toggleChatsSidebar'
                    v-show='$route.name === "chat"'
                    class='lg:hidden inline-block ml-8 text-gray-700 hover:text-gray-900 align-bottom cursor-pointer'>
                                <span class='block h-6 w-6 p-1 rounded-full hover:bg-gray-400'>
                                    <svg class='h-4 w-4' fill='none' stroke-linecap='round' stroke-linejoin='round'
                                         stroke-width='2' stroke='currentColor' viewBox='0 0 24 24'><path
                                      d='M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z'></path></svg>
                                </span>
                            </span>
            </div>
            <div class='leaveDropdown flex flex-col'>
              <button class='leaveDropdown flex-1 text-right focus:outline-none hover:bg-gray-200'
                      @click='toggleLeaveDropdown'>
                            <span class='leaveDropdown inline-block text-gray-700'>
                                Status: <span
                              class='leaveDropdown inline-block align-text-bottom w-4 h-4 bg-green-400 rounded-full border-2 border-white'></span> <b
                              class='leaveDropdown'>Online</b>
                                <span class='leaveDropdown inline-block align-text-bottom'>
                                    <svg fill='none' stroke='currentColor' stroke-linecap='round'
                                         stroke-linejoin='round' stroke-width='2' viewBox='0 0 24 24'
                                         class='leaveDropdown w-4 h-4'><path
                                      d='M19 9l-7 7-7-7'></path></svg>
                                </span>
                            </span>
              </button>
              <div
                v-bind:class="{'hidden': !leaveDropdownShow, 'block': leaveDropdownShow}"
                class='relative'>
                <div
                  v-click-outside='vcoLeave'
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
          <router-view :key='$route.path'></router-view>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { mapActions, mapGetters, mapMutations } from 'vuex';
import ModalWindow from './ModalWindow';
import UploadFile from './UploadFile';
import Vue from 'vue';

export default {
  name: 'MainLayout',
  components: { ModalWindow, UploadFile },
  data() {
    return {
      isSidebarOpen: true,
      leaveDropdownShow: false,
      userMenuDropdownShow: false,
      newUsername: '',
      loading: true,
      notificationSound: new Audio('https://ringon.site/?do=get-file&id=32678'),

      vcoUserSettings: {
        handler: this.closeSettings,
        events: ['click'],
        middleware: this.settingsMiddleware,
      },
      vcoLeave: {
        handler: this.closeLeave,
        events: ['click'],
        middleware: this.leaveMiddleware,
      },
    };
  },
  methods: {
    ...mapActions(['logout', 'getAuthUser', 'changeUsername', 'uploadAvatar']),
    ...mapMutations(['SET_UPLOADED_FILE']),
    leaveAccount() {
      this.logout()
        .then(() => {
          if (!this.isAuth) {
            this.$router.push({ name: 'login' });
            this.$socket.disconnect();
          }
        });
    },
    toggleLeaveDropdown() {
      this.leaveDropdownShow = !this.leaveDropdownShow;
    },
    toggleUserMenuDropdown() {
      this.userMenuDropdownShow = !this.userMenuDropdownShow;
    },
    showChangeNameModal() {
      this.$refs.changeNameModal.isShowModal = true;
      this.newUsername = this.authUser.name;
      Vue.nextTick(() => {
        this.$refs.changeNameInput.focus();
      });
      this.userMenuDropdownShow = false;
    },
    showChangePhotoModal() {
      this.$refs.changePhotoModal.isShowModal = true;
      this.userMenuDropdownShow = false;
    },
    changeNameAction() {
      this.changeUsername({ id: this.authUser.id, name: this.newUsername })
        .then(() => {
          if (this.isNameChanged) {
            this.$refs.changeNameModal.closeModal();
            this.$notify({
              group: 'profileSettings',
              type: 'success',
              title: 'Change name',
              text: 'Name successfully changed',
            });
          }
        });
    },
    closeModal() {
      this.$refs.changePhotoModal.closeModal();
    },
    deletePhotoHook() {
      this.SET_UPLOADED_FILE(null);
      this.$refs.uploadFile.url = null;
    },
    uploadPhoto() {
      this.uploadAvatar({ file: this.uploadedFile });
      this.closeModal();
      this.$notify({
        group: 'profileSettings',
        type: 'success',
        title: 'Change photo',
        text: 'Photo successfully changed',
      });
    },
    closeSettings() {
      this.userMenuDropdownShow = false;
    },
    settingsMiddleware(event) {
      return event.target.classList
        ? !event.target.classList.contains('userSettings')
        : true;
    },
    closeLeave() {
      this.leaveDropdownShow = false;
    },
    leaveMiddleware(event) {
      return event.target.classList
        ? !event.target.classList.contains('leaveDropdown')
        : true;
    },
    toggleSidebar() {
      this.isSidebarOpen = !this.isSidebarOpen;
      this.$store.commit('CHANGE_CHAT_SIDEBAR_STATUS', false);
    },
    resizeEvent() {
      return this.isSidebarOpen = window.innerWidth >= 1280;
    },
    toggleChatsSidebar() {
      this.$store.commit('CHANGE_CHAT_SIDEBAR_STATUS', !this.isChatsSidebarOpen);
      this.isSidebarOpen = false;
    },
  },
  computed: {
    ...mapGetters(['authUser', 'isAuth', 'uploadedFile', 'isNameChanged', 'isChatsSidebarOpen']),
  },
  created() {
    window.addEventListener('resize', this.resizeEvent);

    Promise.all([this.getAuthUser()])
      .then(() => {
        this.newUsername = this.authUser.name;
        this.$socket.connect();
        this.loading = false;
        this.isSidebarOpen = window.innerWidth >= 1280;
      });
  },
  beforeDestroy() {
    window.removeEventListener('resize', this.resizeEvent);
  },
  sockets: {
    messageNotification(message) {
      this.$notify({
        data: { name: message.user.name, text: message.message, avatar: message.user.avatar },
        group: 'messageNotification',
        type: 'success',
      });
      this.notificationSound.play();
    },
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