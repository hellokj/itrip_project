<template>
  <form class="form" ref="form" @submit.stop.prevent="onSubmit">
    <b-row>
      <b-col>
        <p>ID:  {{spot._id}}</p>
        <b-row>
          <b-col class="px-0" cols="1" style="justify-content:center;">
            <p class="mt-2 mb-0" style="text-align:center;">名稱:</p>
          </b-col>
          <b-col class="px-0 mr-5" cols="4">
            <el-input
              class="name-input"
              v-model="name"
            ></el-input>
          </b-col>
          <b-col class="px-0" cols="1" style="justify-content:center;">
             <p class="mt-2 mb-0" style="text-align:center;">類別:</p>
          </b-col>
          <b-col class="px-0" cols="3">
            <el-input
              class="category-input"
              v-model="category"
            ></el-input>
          </b-col>
        </b-row>
        <b-row>
          <b-col class="px-0 mt-4 " cols="1">
             <p class="mb-0" style="text-align:center;">TAG:</p>
          </b-col>
          <b-col class="px-0 mt-3" cols="10">
            <b-form-input
              id="ig-tag-input"
              v-model="tags"
            ></b-form-input>
          </b-col>
        </b-row>
        <b-row :key="index" v-for="index in images.length">
          <b-col class="px-0 mt-4 " cols="1">
             <p class="mb-0" style="text-align:center;">照片{{index}}</p>
          </b-col>
          <b-col class="px-0 mt-3" cols="10">
            <b-form-input
              id="ig-image-input"
              v-model="images[index-1]"
            ></b-form-input>
          </b-col>
        </b-row>
      </b-col>
    </b-row>
  </form>
</template>

<script>
export default {
  props: {
    spot: Object,
  },
  data() {
    return {
      name: this.spot.name,
      category: this.spot.category,
      tags: this.spot.ig_tag,
      images: this.spot.images,
    }
  },
  methods: {
    onSubmit(event) {
      console.log('event');
    }
  },
  watch: {
    name: function() {
      console.log('name changed!');
    },
    category: function() {
      console.log('cat changed!');
    },
    tags: function() {
      console.log('tag changed!');
    },
    images: function() {
      console.log('image changed!');
    }

  }
};
</script>

<style scoped>
  .form {
    margin: 10px;
  }
</style>


