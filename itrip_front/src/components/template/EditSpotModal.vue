<template>
  <el-form class="pb-2 el-form" ref="form" label-width="120px" size="medium">
    <div class="row" style="width:100%;display:flex;justify-content:center;">
      <h4 class="my-0">幫助我們讓資料更完善:)</h4>
    </div>
    <el-divider></el-divider>
    <el-form-item class="my-0" label="ID: ">
      <p class="my-0">{{spot._id}}</p>
    </el-form-item>
    <el-form-item class="my-0" label="名稱: ">
      <el-input v-model="name" style="width:200px;"></el-input>
    </el-form-item>
    <el-form-item class="my-0" label="類別: ">
      <el-radio-group v-model="category">
        <el-radio label="美食"></el-radio>
        <el-radio label="購物"></el-radio>
        <el-radio label="住宿"></el-radio>
        <el-radio label="景點"></el-radio>
        <el-radio label="交通"></el-radio>
        <el-radio label="娛樂"></el-radio>
      </el-radio-group>
    </el-form-item>
    <el-form-item class="my-0" label="地址: ">
      <el-input v-model="getAddress" style="width:400px;"></el-input>
    </el-form-item>
    <el-form-item class="my-0" label="TAGS: ">
      <el-input v-model="tags" style="width:400px;"></el-input>
    </el-form-item>
    <div class="pic" :key="index" v-for="index in getImages.length">
      <el-form-item class="my-1" label="照片">
        <el-input v-model="getImages[index-1]"></el-input>
      </el-form-item>
    </div>
    <el-divider></el-divider>
    <div class="flex" style="display:flex;flex-direction:row;justify-content:space-between;">
      <el-button @click="deleteSpot" class="mt-2" type="danger" round>刪除此景點</el-button>
      <div class="pr-3 row" style="display:flex;flex-direction:row;">
        <el-button @click="$emit('close', 'edit-form')">取消</el-button>
        <el-button type="primary" @click="onSubmit">送出</el-button>
      </div>
    </div>
</el-form>
</template>

<script>
import {apiUpdateSpot, apiDeleteSpot} from '../../../utils/api.js'
import {getAddress} from '../../../utils/checker.js'
import {catTranslation} from '../../../utils/translation.js'
import { MessageBox } from 'element-ui'
import { Message } from 'element-ui'


export default {
  props: {
    spot: Object,
  },
  data() {
    return {
      _id: this.spot._id,
      name: this.spot.name,
      category: catTranslation[this.spot.category],
      images: this.spot.images,
      address: this.spot.address,
      tags: '',
      data: {id: this.spot._id},
      isChanged: false,
    }
  },
  methods: {
    onSubmit(event) {
      let self = this;
      if(this.isChanged) {
        apiUpdateSpot(this.data).then((function (res) {
          console.log(self.data);
          Message({
            type: 'success',
            message: '資料已送出審核!'
          });
          self.$emit('refresh', null);
          self.$emit('close', 'edit-form');
      })).catch(function (error) {
        console.log(error);
      });
      }
    },
    deleteSpot() {
      let self = this;
      MessageBox.confirm('這將會刪除此景點，確定繼續嗎?', 'Warning', {
          confirmButtonText: '確認',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          let obj = {id: self.spot._id};
          apiDeleteSpot(obj).then((function (res) {
              self.$emit('refresh', null);
              self.$emit('close', 'edit-form');
              Message({
                type: 'success',
                message: '景點刪除成功!'
              });
          })).catch(function (error) {
            console.log(error);
          });
        }).catch(() => {
          Message({
            type: 'info',
            message: '刪除取消!'
          });          
        });
    },
    getKeyByValue(object, value) {
      return Object.keys(object).find(key => object[key] === value);
    }
  },
  computed: {
    getAddress: function() {
      return getAddress(this.spot.address);
    },
    getImages: function() {
      if(this.images === undefined || this.spot.images.length == 0) {
        this.spot.images = [' ',' ',' '];
        this.images = this.spot.images;
      };
      return this.images;
    },
    getTags: function() {
      
    },
  },
  watch: {
    name: function() {
      this.isChanged = true;
      this.data.name = this.name;
    },
    category: function(newVal) {
      this.isChanged = true;
      this.data.category = this.getKeyByValue(catTranslation, newVal);
    },
    tags: function(newVal) {
      this.isChanged = true;
      this.data.tags = newVal.split(',');
    },
    images: function() {
      this.isChanged = true;
      this.data.images = this.images;
    }
  },
  created: function(){
    if(this.spot.ig_tag === undefined || this.spot.ig_tag.length == 0) {
        this.spot.ig_tag = [""];
    }
    this.tags = this.spot.ig_tag.toString();
  }
}
</script>

<style scoped>
  .el-form {
    height: 100%;
    margin:10px;
  }
</style>


