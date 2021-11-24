<template>
  <div id='app' style='max-height: 100vh'>
    <notifications group='profileSettings' position='bottom right' width='30%' />
    <notifications group='messageNotification' position='top right'>
      <template slot='body' slot-scope='{ item, close }'>
        <div @click='close' class='flex max-w-md bg-white shadow-lg rounded-lg overflow-hidden opacity-100'>
          <div class='w-2 bg-gray-800'></div>
          <div class='flex items-center px-2 py-3'>
            <img class='w-12 h-12 object-cover rounded-full'
                 alt='avatar'
                 :src='item.data.avatar'>
            <div class='mx-3'>
              <h2 class='text-xl font-semibold text-gray-800'>{{ item.data.name }}</h2>
              <p class='text-gray-600'>{{ item.data.text }}</p>
            </div>
          </div>
        </div>
      </template>
    </notifications>
    <router-view></router-view>
  </div>
</template>

<script>


export default {
  name: 'App',
  components: {},
};
</script>

<style>

</style>
