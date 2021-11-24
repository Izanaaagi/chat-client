<template>
  <div v-if='!loading' class='antialiased font-sans'>
    <div class='container mx-auto px-4 sm:px-8'>
      <div class='py-4'>
        <div>
          <h2 class='text-2xl font-semibold leading-tight'>Users</h2>
        </div>
        <div class='my-2 flex sm:flex-row flex-col'>
          <div class='flex flex-row mb-1 sm:mb-0'>
            <div class='relative'>
              <select
                :disabled='disablePagination'
                v-model='take'
                @change='onValueChange'
                class='appearance-none h-full rounded-l border block appearance-none w-full bg-white border-gray-400 text-gray-700 py-2 px-4 pr-8 leading-tight focus:outline-none focus:bg-white focus:border-gray-500'>
                <option>5</option>
                <option>10</option>
                <option>20</option>
              </select>
              <div
                class='pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-700'>
                <svg class='fill-current h-4 w-4' xmlns='http://www.w3.org/2000/svg' viewBox='0 0 20 20'>
                  <path d='M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z' />
                </svg>
              </div>
            </div>
            <div class='relative'>
              <select
                :disabled='disablePagination'
                @change='onValueChange'
                v-model='isOnline'
                class='appearance-none h-full rounded-r border-t sm:rounded-r-none sm:border-r-0 border-r border-b block appearance-none w-full bg-white border-gray-400 text-gray-700 py-2 px-4 pr-8 leading-tight focus:outline-none focus:border-l focus:border-r focus:bg-white focus:border-gray-500'>
                <option :value='null'>All</option>
                <option :value='true'>Active</option>
                <option :value='false'>Inactive</option>
              </select>
              <div
                class='pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-700'>
                <svg class='fill-current h-4 w-4' xmlns='http://www.w3.org/2000/svg' viewBox='0 0 20 20'>
                  <path d='M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z' />
                </svg>
              </div>
            </div>
          </div>
          <div class='block relative'>
                    <span class='h-full absolute inset-y-0 left-0 flex items-center pl-2'>
                        <svg viewBox='0 0 24 24' class='h-4 w-4 fill-current text-gray-500'>
                            <path
                              d='M10 4a6 6 0 100 12 6 6 0 000-12zm-8 6a8 8 0 1114.32 4.906l5.387 5.387a1 1 0 01-1.414 1.414l-5.387-5.387A8 8 0 012 10z'>
                            </path>
                        </svg>
                    </span>
            <input
              placeholder='Name'
              v-model='keyWord'
              :disabled='disablePagination'
              @keypress.enter='onValueChange'
              class='appearance-none rounded-r rounded-l sm:rounded-l-none border border-gray-400 border-b block pl-8 pr-6 py-2 w-full bg-white text-sm placeholder-gray-400 text-gray-700 focus:bg-white focus:placeholder-gray-600 focus:text-gray-700 focus:outline-none' />
          </div>
        </div>
        <div class='-mx-4 sm:-mx-8 px-4 sm:px-8 py-4 overflow-x-auto' style='max-height: 485px'>
          <div class='inline-block min-w-full shadow rounded-lg overflow-hidden'>
            <table v-if='usersList.count > 0' class='min-w-full leading-normal'>
              <thead>
              <tr>
                <th
                  class='px-5 py-3 border-b-2 border-gray-200 bg-gray-100 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider'>
                  User
                </th>
                <th
                  class='px-5 py-3 border-b-2 border-gray-200 bg-gray-100 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider'>
                  Email
                </th>
                <th
                  class='px-5 py-3 border-b-2 border-gray-200 bg-gray-100 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider'>
                  Last online
                </th>
                <th
                  class='px-5 py-3 border-b-2 border-gray-200 bg-gray-100 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider'>
                  Status
                </th>
              </tr>
              </thead>
              <tbody>
              <tr class='hover:text-red-600 cursor-pointer'
                  v-for='user in usersList.users'
                  v-bind:key='user.email'
                  @click='goToChat(user.id)'>
                <td
                  class='px-5 py-5 border-b border-gray-200 bg-white text-sm '>
                  <div class='flex items-center'>
                    <div class='flex-shrink-0 w-10 h-10'>
                      <img class='w-full h-full rounded-full'
                           :src='user.avatar '
                           alt='' />
                    </div>
                    <div class='ml-3'>
                      <p class='text-gray-900 whitespace-no-wrap'>
                        {{ user.name }}
                      </p>
                    </div>
                  </div>
                </td>
                <td class='px-5 py-5 border-b border-gray-200 bg-white text-sm'>
                  <p class='text-gray-900 whitespace-no-wrap'>{{ user.email }}</p>
                </td>
                <td class='px-5 py-5 border-b border-gray-200 bg-white text-sm'>
                  <p v-if='user.is_online' class='font-bold text-gray-900 whitespace-no-wrap'>
                    ----------------->
                  </p>
                  <p v-else class='text-gray-900 whitespace-no-wrap'>
                    {{ user.last_online_date | dateMonthDayHoursMinutes }}
                  </p>
                </td>
                <td class='px-5 py-5 border-b border-gray-200 bg-white text-sm'>
                  <span
                    v-if='user.is_online'
                    class='relative inline-block px-3 py-1 font-semibold text-green-900 leading-tight'>
                    <span aria-hidden
                          class='absolute inset-0 bg-green-200 opacity-50 rounded-full'></span>
                    <span class='relative'>Online</span>
                  </span>
                  <span
                    v-else
                    class='relative inline-block px-3 py-1 font-semibold text-green-900 leading-tight'>
                    <span aria-hidden
                          class='absolute inset-0 bg-red-200 opacity-50 rounded-full'></span>
                    <span class='relative'>Offline</span>
                  </span>
                </td>
              </tr>
              </tbody>
            </table>
            <div class='h-full flex flex-col items-center justify-center' v-else>
              <span class='text-gray-400 font-bold text-2xl'>There are no other users yet</span>
            </div>
          </div>
        </div>
        <div
          class='px-5 py-5 border-t flex flex-col xs:flex-row items-center xs:justify-between          '>
          <div class='inline-flex xs:mt-0' v-if='usersList.count > 0'>
            <t-pagination :total-items='usersList.count'
                          :value='currentPage'
                          :per-page='take'
                          :limit='5'
                          :disabled='disablePagination'
                          @change='clickCallback'
            ></t-pagination>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { mapActions, mapGetters } from 'vuex';
import dateFormat from 'dateformat';

export default {
  name: 'Users',
  data() {
    return {
      loading: true,
      disablePagination: false,
      take: 5,
      currentPage: 1,
      keyWord: '',
      isOnline: null,
    };
  },
  methods: {
    ...mapActions(['getAllUsers']),
    clickCallback(pageNum) {
      this.currentPage = pageNum;
      this.getAllUsersWithParams();
    },
    onValueChange() {
      this.getAllUsersWithParams();
    },
    goToChat(id) {
      this.$router.push({ name: 'chat', params: { id: id } });
    },
    getAllUsersWithParams() {
      this.disablePagination = true;
      return this.getAllUsers({
        params: {
          take: this.take,
          skip: this.skip,
          keyWord: this.keyWord,
          isOnline: this.isOnline,
        },
      }).then(() => this.disablePagination = false);
    },
  },
  computed: {
    ...mapGetters(['usersList']),
    pagesCount() {
      return Math.ceil(this.usersList.count / this.take);
    },
    skip() {
      return (this.currentPage - 1) * this.take;
    },
  },
  mounted() {
    if (this.$route.params.page) {
      this.currentPage = this.$route.params.page;
    }
    return Promise.all([this.getAllUsersWithParams()])
      .then(() => {
        if (this.pagesCount !== 0 && this.currentPage > this.pagesCount) {
          this.$router.push({ name: '404' });
        } else {
          this.loading = false;
        }
      });
  },
  sockets: {
    updateUsersStatus() {
      this.getAllUsersWithParams();
    },
  },
  filters: {
    dateMonthDayHoursMinutes(date) {
      return dateFormat(date, 'mmmm d, HH:MM');
    },
  },
};
</script>

<style scoped>
</style>