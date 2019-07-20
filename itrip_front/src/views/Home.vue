<template>
  <div>
    <div class="index-area" style="width:100%; height:100vh; overflow: hidden">
      <b-container class="nav-bar mt-5 mb-3 mx-auto">
        <b-row >
          <b-col cols="2">
            <img href="/trip" class="bg" src="../assets/home/Logo.svg" style="width: auto;" />
          </b-col>
          <b-col class="text-center" offset="2" offset-sm="2"  offset-md="4" offset-lg="7" cols="2" sm="2" md="2" lg="1" align-self="center">
            <router-link  to="/"><b>首頁</b></router-link>
          </b-col>
          <b-col class="text-center" cols="2" sm="2" md="2" lg="1" align-h="center" align-self="center">
            <router-link  to="/trip">旅遊</router-link>
          </b-col>

          <b-col class="text-center" cols="2" sm="2" md="2" lg="1" align-h="center" align-self="center">
            <button class="btn-login">登入</button>
          </b-col>
        </b-row>
      </b-container>
      
      <b-container class="mt-5">
        <b-row align-h="center" align-v="center" style="margin-top: 20vh;">
          <b-col class="p-0" cols="10" sm="6" md="6" >
            <b-form-input class="form-input" v-model="selected" list="input-list" id="input-with-list" placeholder="輸入想去的地方"></b-form-input>
            <b-form-datalist id="input-list" v-bind:options="options"></b-form-datalist>
          </b-col>
          <b-col class="p-0" cols="1" sm="1" md="1" >
            <span width="30px;"><img  
             src="../assets/home/Search.svg" /></span>
          </b-col>
        </b-row>
        <b-row class="mt-2" align-h="center">
          <b-col class="key-word" cols="11" sm="7" md="7" >
            <p style="display: inline-block; margin-right: 2rem;" @click="clickKeyWord" :key="keyWord" v-for="keyWord in keyWords">{{ keyWord }}</p>
          </b-col>
        </b-row>
      </b-container>
    </div>

  </div>

</template>

<script>
import {getAreas, getTypes, makeParams} from '../../utils/area.js'
export default {
  name: 'home',

  data() {
    return {
      slide: 0,
      sliding: null,
      selected: null,
      options: ["購物", "景點", "交通"],
      keyWords: ["雙心石滬", "老梅石槽", "九份"],
      SearchHover: false,
    }
  },
  methods: {
    onSlideStart(slide) {
      this.sliding = true
    },
    onSlideEnd(slide) {
      this.sliding = false
    },
    toggle: function(toggle){
      console.log(toggle);
    }
  },
}
</script>

<style scoped>

  .nav-bar a {
    color: rgb(55, 51, 63);
    font-size: 1.2em;
  }

  .index-area {
    background-image: url("../assets/home/homeBg04.jpg");
    background-repeat: no-repeat;
    background-size: cover;
  }

  .form-input {
    height: 48px;
    border: none;
    border-radius: 24px;
    box-shadow: 0px 5px 5px #00102927;
  }

  button.btn-login {
    color: rgb(255, 241, 241);
    border: 2px solid #FFF;
    height: 40px;
    width: 100px;
    border-radius: 20px;
    background-color: transparent;
  }

  .key-word {
    color: rgb(30, 206, 162);
  }

</style>
