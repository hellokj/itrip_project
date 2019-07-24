<template>
  <el-form class="el-form" ref="form" label-width="120px" size="medium">
    <div class="row" style="width:100%;display:flex;justify-content:center;">
      <h4 class="my-0">幫助我們讓資料更完善:)</h4>
    </div>
    <el-divider></el-divider>
    <el-form-item class="my-0" label="ID: ">
      <p class="my-0">{{spot._id}}</p>
    </el-form-item>
    <el-form-item class="my-0" label="景點名稱: ">
      <el-input v-model="name" style="width:200px;"></el-input>
    </el-form-item>
    <el-form-item class="my-0" label="景點類別: ">
      <el-input v-model="category" style="width:200px;"></el-input>
    </el-form-item>
    <el-form-item class="my-0" label="地址: ">
      <el-input v-model="getAddress" style="width:400px;"></el-input>
    </el-form-item>
    <el-form-item class="my-0" label="TAGS: ">
      <el-input v-model="tags" style="width:400px;"></el-input>
    </el-form-item>
    <div class="pic" :key="index" v-for="index in getImages.length">
      <el-form-item class="my-1" label="照片">
        <el-input v-model="images[index-1]"></el-input>
      </el-form-item>
    </div>
    <el-divider></el-divider>
    <div class="flex" style="display:flex;flex-direction:row;justify-content:space-between;">
      <el-button class="mt-2" type="danger" round>刪除此景點</el-button>
      <div class="pr-3 row" style="display:flex;flex-direction:row;">
        <el-button @click="$emit('close', 'edit-form')">取消</el-button>
        <el-button type="primary" @click="onSubmit">送出</el-button>
      </div>
    </div>
</el-form>
</template>

<script>
import {apiUpdateSpot} from '../../../utils/api.js'
import {getAddress} from '../../../utils/checker.js'

export default {
  props: {
    spot: Object,
  },
  data() {
    return {
      _id: this.spot._id,
      name: this.spot.name,
      category: this.spot.category,
      address: this.spot.address,
      images: this.spot.images,
      tags: this.spot.ig_tag,
      data: {id: this.spot._id},
      isChanged: false,
    }
  },
  methods: {
    onSubmit(event) {
      let self = this;
      if(this.isChanged) {
        apiUpdateSpot(this.data).then((function (res) {
          alert("資料已送出審核，感謝您!");
          self.$emit('refresh', null);
          self.$emit('close', 'edit-form');
      }))
      .catch(function (error) {
        console.log(error);
      });
      }
    }
  },
  computed: {
    getAddress: function() {
      return getAddress(this.spot.address);
    },
    getImages: function() {
      if(!Object.keys(this.spot).includes('images') || this.spot.images.length == 0) {
        this.images = ['', '', ''];
      }
      this.images = this.spot.images;
      return this.images;
    }
  },
  watch: {
    name: function() {
      this.isChanged = true;
      this.data.name = this.name;
    },
    category: function() {
      this.isChanged = true;
      this.data.category = this.category;
    },
    tags: function() {
      this.isChanged = true;
      this.data.tags = this.tags.split(',');
    },
    images: function() {
      this.isChanged = true;
      this.data.images = this.images;
    }
  },
};
</script>

<style scoped>
  .el-form {
    height: 100%;
    margin:10px;
  }
</style>


