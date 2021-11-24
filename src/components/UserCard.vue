<template>
  <div
    class='bg-white flex items-center p-2 rounded-xl shadow border block absolute w-80 -top-4 left-14'>
    <div class='relative flex items-center space-x-4'>
      <img :src='currentChatUser.avatar'
           alt='My profile' class='w-16 h-16 rounded-full'>
      <span
        :class='["absolute", "h-4", "w-4", currentChatUser.is_online ? "bg-green-400" : "bg-gray-400", "rounded-full", "bottom-0", "right-0", "border-2", "border-white"]'></span>
    </div>
    <div class='flex-grow p-3'>
      <div class='font-semibold text-gray-700'>
        {{ currentChatUser.name }}
      </div>
      <div v-if='!currentChatUser.is_online' class='text-sm text-gray-500'>
        last seen {{ currentChatUser.last_online_date | dateMonthDayHoursMinutes }}
      </div>
    </div>
  </div>
</template>

<script>
import { mapGetters } from 'vuex';
import * as dateFormat from 'dateformat';

export default {
  name: 'UserCard',
  data() {
    return {};
  },
  computed: {
    ...mapGetters(['currentChatUser']),
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