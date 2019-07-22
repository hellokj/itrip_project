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
            <span class="search-icon" width="30px;"><img @click.native="handleSearch" 
             src="../assets/home/Search.svg" /><a href="http://google.com.tw" /></span>
          </b-col>
        </b-row>
        <b-row class="mt-2" align-h="center">
          <b-col cols="11" sm="7" md="7" >
            <p class="key-word" style="display: inline-block; margin-right: 2rem;" @click="clickKeyWord" :key="keyWord" v-for="keyWord in keyWords">{{ keyWord }}</p>
          </b-col>
        </b-row>
      </b-container>
    </div>
    <div>{{window.width +", "+ window.height}}</div>

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
      options: ["美食", "購物", "景點", "交通", "住宿", "娛樂"],
      types: {'美食':'gourmet', '購物':'shopping', '景點':'scenic spot', '交通':'transportation', '住宿':'lodging', '娛樂':'entertainment'},
      keyWords: ["雙心石滬", "老梅石槽", "九份"],
      SearchHover: false,
      params: {},
      window: {
        width: 0,
        height: 0
      },
    }
  },
  created() {
    window.addEventListener('resize', this.handleResize)
    this.handleResize();
  },
  destroyed() {
    window.removeEventListener('resize', this.handleResize)
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
    },
    handleSearch: function() {
      alert(this.selected);

      if (options.indexOf(this.selected) !== -1){
        this.params = makeParams(null, null, this.selected, null);  // type 
      } else {
        this.params = makeParams(null, null, null, this.selected);  // name
      }
      this.$router.push({path: '/trip'});
      this.$emit('search-click', this.params);
      
    },
    handleResize() {
      this.window.width = window.innerWidth;
      this.window.height = window.innerHeight;
    }
  },
  watch: {
    window: function() {
      alert(this.window.width + ", " + this.window.height)
    }
  }
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
    cursor: pointer;
  }

  .search-icon{
    cursor: pointer;
  }
</style>
