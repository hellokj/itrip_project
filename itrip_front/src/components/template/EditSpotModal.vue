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
      <el-input v-model="address" style="width:400px;"></el-input>
    </el-form-item>
    <el-form-item class="my-0" label="TAGS: ">
      <el-input v-model="tags" style="width:400px;"></el-input>
    </el-form-item>
    <div class="pic" :key="index" v-for="index in images.length">
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
import {getAddress} from '../../../utils/checker.js'

export default {
  props: {
    spot: Object,
  },
  data() {
    return {
      name: this.spot.name,
      category: this.spot.category,
    }
  },
  methods: {
    onSubmit(event) {
      console.log(event);
    }
  },
  computed: {
    address: function() {
      return getAddress(this.spot.address);
    },
    images: function() {
      if(!Object.keys(this.spot).includes('images')) {
        return ['', '', '']
      }
      return this.spot.images;
    },
    tags: function() {
      let s = '';
      for(let i=0;i<this.spot.ig_tag.length;i++) {
        s += this.spot.ig_tag[i];
        if(i != this.spot.ig_tag.length - 1) {
          s += ',';
        }
      }
      return s;
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
  .el-form {
    height: 100%;
    margin:10px;
  }
</style>


