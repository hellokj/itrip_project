<template>
  <div id="app">
    <Header v-model="isAuthorized" v-on:search-click="Search" v-on:logIn-click="LogIn" v-on:logOut-click="LogOut"/>
    <div id="nav">
    </div>
    <router-view :param="param" :region="region" :type="type"/>
    <Modal name="auth" width="300px" height="auto" :scrollable="true" class=".vue-modal-resizer">
      <Auth v-if="!isAuthorized" v-model="isAuthorized" v-on:signUp-ok="Authorize" v-on:logIn-ok="Authorize" v-on:fbLogIn="fbLogIn"></Auth>
    </Modal>
  </div>
</template>

<script>
import VFacebookLogin from 'vue-facebook-login-component'
import Header from './components/layout/Header'
import Auth from './components/Auth'

export default {
  name:'app',
  components: {
    Header,
    Auth,
    VFacebookLogin
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
    Authorize(){
      // this.isAuthorized = true;
      this.$store.dispatch('updateAuthorized', true);
      alert("success");
      this.$modal.hide('auth');
    },
    LogOut() {
      // this.isAuthorized = false;
      this.$store.dispatch('updateAuthorized', false);
      this.$store.dispatch('updateUserInfo', "");
      FB.logout(function (response) {
        console.log('res when logout', response)
      });
    },
    getProfile() {
        let vm = this;
        FB.api("/me", function (response) {
          vm.$store.dispatch('updateUserInfo', response.id);
        });
      },
    statusChangeCallback(response) {
      let vm = this;
      if (response.status === "connected") {
        vm.Authorize();
        vm.getProfile();
      } else if (response.status === "not_authorized") {
        vm.$store.dispatch('updateAuthorized', false);
      } else if (response.status === "unknown") {
        vm.$store.dispatch('updateAuthorized', false);
      } else {
        vm.$store.dispatch('updateAuthorized', false);
      }
    },
    fbLogIn() {
      let vm = this;
      FB.login(
        function (response) {
          vm.statusChangeCallback(response);
        }, {
          scope: "email, public_profile",
          return_scopes: true
        }
      );
      vm.$modal.hide('auth');
    }
  },
  computed: {
    isAuthorized() {
      return this.$store.state.isAuthorized;
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
      //login
      FB.AppEvents.logPageView();
      //Get FB Login Status
      FB.getLoginStatus(response => {
        vm.statusChangeCallback(response);
      });
    };
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


</style>
