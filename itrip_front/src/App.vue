<template>
  <div id="app">
    <Header v-on:search-click="Search" v-on:login-click="Login"/>
    <div id="nav">
    </div>
    <router-view v-bind:param="param" v-bind:type="type"/>
      <Modal name="login" :width="300" :height="300">
        <Auth :isLogin="isLogin"></Auth>
      </Modal>
    
  </div>
</template>

<script>
import Header from './components/layout/Header'
import Auth from './components/Auth'

export default {
  name:'app',
  components: {
    Header,
    Auth,
  },
  data() {
    return {
      togos: [],
      region: '',
      type: '',
      param: {},
      isLogin: false, // 確認狀態是否登入
    }
  },
  methods: {
    Search(para) {
      this.param = para;
    },
    Login() {
      this.$modal.show('login');
    },
  },
}
</script>
<style>

* {
    box-sizing: border-box;
    margin: 0;
    padding: 0;
  }

  .btn {
    display: inline-block;
    border: none;
    background: #555;
    color:#fff;
    padding: 7px 20px;
    cursor: pointer;
  }

  body {
    font-family: Arial, Helvetica, sans-serif;
    line-height: 1.4;
  }


</style>
