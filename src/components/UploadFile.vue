<template>
  <div class='file_upload p-5 relative border-4 border-dotted border-gray-300 rounded-lg'
       @dragover='dragOver'
       @dragleave='dragleave'
       @drop='dropFile'>
    <div class='' v-if='url'>
      <img height='200px' width='200px' :src='url' class='mx-auto rounded-full'>
    </div>
    <svg v-else class='text-indigo-500 w-24 mx-auto mb-4' xmlns='http://www.w3.org/2000/svg' fill='none'
         viewBox='0 0 24 24' stroke='currentColor'>
      <path stroke-linecap='round' stroke-linejoin='round' stroke-width='2'
            d='M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12' />
    </svg>
    <div class='input_field flex flex-col w-max mx-auto text-center'>
      <label>
        <input class='text-sm cursor-pointer w-36 hidden' name='file' id='file' type='file' accept='image/*'
               @change='uploadFile'>
        <div
          v-if='url'
          class='text bg-indigo-600 text-white border border-gray-300 rounded font-semibold cursor-pointer p-1 px-3 hover:bg-indigo-500'>
          Choose another
        </div>
        <div v-else
             class='text bg-indigo-600 text-white border border-gray-300 rounded font-semibold cursor-pointer p-1 px-3 hover:bg-indigo-500'>
          Select
        </div>
      </label>
      <div class='title text-indigo-500 uppercase'>or drop file here</div>
    </div>

  </div>
</template>

<script>
import { mapGetters, mapMutations } from 'vuex';

export default {
  name: 'UploadFile',
  data() {
    return {
      url: null,
    };
  },
  methods: {
    ...mapMutations(['SET_UPLOADED_FILE']),
    uploadFile(e) {
      this.SET_UPLOADED_FILE(e.target.files[0]);
      if (this.uploadedFile) {
        this.url = URL.createObjectURL(this.uploadedFile);
      }
    },
    dropFile(e) {
      e.preventDefault();
      this.SET_UPLOADED_FILE(e.dataTransfer.files[0]);
      if (this.uploadedFile) {
        this.url = URL.createObjectURL(this.uploadedFile);
      }
      e.currentTarget.classList.remove('bg-gray-100');
    },
    dragOver(e) {
      e.preventDefault();
      if (!e.currentTarget.classList.contains('bg-gray-100')) {
        e.currentTarget.classList.add('bg-gray-100');
      }
    },
    dragleave(e) {
      e.currentTarget.classList.remove('bg-gray-100');
    },
  },
  computed: {
    ...mapGetters(['uploadedFile']),
  },
};
</script>

<style scoped>

</style>