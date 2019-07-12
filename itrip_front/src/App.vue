<template>
  <div id="app">
    <Header v-model="isAuthorized" v-on:search-click="Search" v-on:logIn-click="LogIn" v-on:logOut-click="LogOut"/>
    <div id="nav">
    </div>
    <router-view v-bind:region="region" v-bind:type="type" v-bind:param="param"/>
    <Modal name="auth" width="300px" height="auto" :scrollable="true" class=".vue-modal-resizer">
      <Auth v-if="!isAuthorized" v-model="isAuthorized" v-on:signUp-ok="Authorize" v-on:logIn-ok="Authorize"></Auth>
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
    Auth
  },
  data() {
    return {
      togos: [],
      region: '',
      type: '',
      param: {},
      // isAuthorized: false, // 確認狀態是否登入
    }
  },
  methods: {
    Search(para) {
      this.param = para;
    },
    LogIn() {
      this.$modal.show('auth');
    },
    Authorize(){
      // this.isAuthorized = true;
      this.$store.dispatch('updateAuthorized', true);
      alert("success");
      this.$modal.hide('auth');
    },
    LogOut() {
      // this.isAuthorized = false;
      this.$store.dispatch('updateAuthorized', false);
    }
  },
  computed: {
    isAuthorized() {
      return this.$store.state.isAuthorized;
    }
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
