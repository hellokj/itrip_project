<template>
  <div id="app">
    <Header v-model="isAuthorized" v-on:search-click="Search" v-on:logIn-click="LogIn" v-on:logOut-click="LogOut"/>
    <div id="nav">
    </div>
    <router-view :param="param" :region="region" :type="type"/>
    <Modal name="auth" :scrollable="true" :class="modal">
      <Auth v-if="!isAuthorized" v-model="isAuthorized" v-on:signUp-ok="Authorize" v-on:logIn-ok="Authorize"></Auth>
      <!-- <BForm></BForm> -->
    </Modal>
  </div>
</template>

<script>
import Header from './components/layout/Header'
import Auth from './components/Auth'
import FbSignUp from './components/template/FbSignUp'
import BForm from './components/template/BForm'

export default {
  name:'app',
  components: {
    Header,
    Auth,
    FbSignUp,
    BForm
  },
  data() {
    return {
      togos: [],
      region: '',
      type: '',
      param: {},
    }
  },
  methods: {
    Search(para) {
      this.param = para;
      //console.log(this.param);
    },
    LogIn() {
      this.$modal.show('auth');
    },
    LogOut() {
      // this.isAuthorized = false;
      this.$store.dispatch('updateAuthorized', false);
      this.$store.dispatch('updateUserInfo', {});
      FB.logout(function (response) {
        console.log('res when logout', response);
      });
    },
    Authorize(){
      // this.isAuthorized = true;
      this.$store.dispatch('updateAuthorized', true);
      alert("success");
      this.$modal.hide('auth');
    },
  },
  computed: {
    isAuthorized() {
      return this.$store.state.isAuthorized;
    }
  },
  created() {
    // 啟動時，先查看localStorage的資料
    let status = window.localStorage.getItem('isAuthorized');
    if (status == "true"){
      this.$store.dispatch('updateAuthorized', true);
    }else{
      this.$store.dispatch('updateAuthorized', false);
    }
  },
  mounted() {
    let vm = this;
    window.fbAsyncInit = function () {
        FB.init({
          appId: "2353529008088124",
          xfbml: true,
          status: true,
          cookie: true,
          autoLogAppEvents: true,
          version: "v3.3"
        });
      };
    if (!vm.$store.state.isAuthorized){
      //login
      FB.AppEvents.logPageView();
      //Get FB Login Status
      FB.getLoginStatus(response => {
        vm.statusChangeCallback(response);
      });
    }
  },
}
</script>
<style>
@font-face {
  font-family: logoFont;
  src: url(/../assets/Noto_Serif_TC/NotoSerifTC-Medium.otf);
}

* {
    box-sizing: border-box;
    margin: 0;
    padding: 0;
    font-family: logoFont;
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

  .modal {
    width: 40%;
    height: auto;
    text-align: center;
  }


</style>
