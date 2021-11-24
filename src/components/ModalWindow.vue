<template>
  <transition name='modal' v-on:after-leave='$props.deletePhotoHook'>
    <div
      v-show='isShowModal'
      @click.self='closeModal'
      class='min-w-screen h-screen animated fixed  left-0 top-0 flex justify-center items-center inset-0 z-50 outline-none focus:outline-none bg-no-repeat bg-center bg-cover'
      id='modal-id'
      style='background:rgba(0, 0, 0, 0.39)'>
      <div class='w-full  max-w-lg p-5 relative mx-auto my-auto rounded-xl shadow-lg  bg-white'>
        <!--content-->
        <div class=''>
          <!--body-->
          <div class='flex text-center p-5 flex-col justify-center'>
            <slot name='question'>
              <h2 class='text-xl font-bold py-4'>Default Question?</h2>
            </slot>
            <slot name='content'>Default Content</slot>
          </div>
          <!--footer-->
          <div class='p-3  mt-2 text-center space-x-4 md:block'>
            <slot name='cancelButton'>
              <button
                @click='closeModal'
                class='mb-2 md:mb-0 bg-red-500 px-5 py-2 text-sm shadow-sm font-medium tracking-wider border border-red-500 hover:bg-red-600 text-white rounded-full hover:shadow-lg hover:bg-gray-100'>
                Cancel
              </button>
            </slot>
            <slot name='actionButton'>
              <button
                class='mb-2 md:mb-0 bg-white px-5 py-2 text-sm shadow-sm font-medium tracking-wider border text-gray-600 rounded-full hover:shadow-lg hover:bg-gray-100'>
                Change
              </button>
            </slot>
          </div>
        </div>
      </div>
    </div>
  </transition>
</template>

<script>
export default {
  name: 'ModalWindow',
  props: {
    deletePhotoHook: {
      type: [Function],
      required: false,
      default: function() {
      },
    },
  },
  data() {
    return {
      isShowModal: false,
    };
  },
  methods: {
    closeModal() {
      this.isShowModal = false;
    },
  },
};
</script>

<style scoped>
.modal-enter-active, .modal-leave-active {
  transition: opacity 1s
}

.modal-enter, .modal-leave-to {
  opacity: 0
}
</style>