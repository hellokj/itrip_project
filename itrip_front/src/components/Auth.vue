<template lang="pug">
  SignUp(v-model="isSignUp" v-if="isSignUp && !isLogIn && !isFbSignUp" v-on:backToLogIn="backToLogIn" v-on:signUp="signUp" v-bind:resMsg="resMsg")
  LogIn(v-model="isLogIn" v-bind="isFbSignUp" v-else-if="isLogIn && !isFbSignUp" v-on:backToSignUp="backToSignUp" v-on:logIn="logIn" v-on:fbLogIn="fbLogIn" v-bind:resMsg="resMsg")
  FbSignUp(v-model="isFbSignUp" v-else="isFbSignUp" v-on:signUp="signUp" v-bind:resMsg="resMsg" v-on:backToLogIn="backToLogIn")
</template>

<script>
import LogIn from './template/LogIn'
import SignUp from './template/SignUp'
import FbSignUp from './template/FbSignUp'
import { apiLogIn, apiSignUp } from '../../utils/api'

export default {
  name: "Auth",
  components: {
    LogIn,
    SignUp,
    FbSignUp
  },
  props: {
    // isAuthorized: Boolean,
  },
  methods: {
    logIn: function(email, password){
      // 接收到子元件傳來的 account password
      let self = this;
      let data = {
        email: email,
        password: password
      };
      // 傳送資料去api取得response
      apiLogIn(data)
      .then(function(res) {
        self.resMsg = res.data.msg;
        if (res.data.status == -1){
          self.$store.dispatch("updateUserToken", res.data.data); // token
          self.resMsg = "";
          self.$emit("logIn-ok");
        }
      })
      .catch(function(err){
        console.log(err);
      });
      // 根據回傳值status 做事
    },
    signUp: function(user){
      let self = this;
      // 通過SignUp元件的審核，傳至此的user
      apiSignUp(user)
      .then(function(res) {
        // 傳送資料去api取得response
        self.resMsg = res.data.msg;
        if (res.data.status == 200){
          // self.$emit("signUp-ok");
          self.backToLogIn();
          self.resMsg = "註冊成功，重新登入";
        }
      })
      .catch(function(err) {
        console.log(err);
      });
      // 根據回傳值status 做事
    },
    backToLogIn: function(){  
      this.isSignUp = false;
      this.isLogIn = true;
      this.isFbSignUp = false;
      this.resMsg = "";
    },
    backToSignUp: function(){
      this.isSignUp = true;
      this.isLogIn = false;
      this.isFbSignUp = false;
      this.resMsg = "";
    },
    fbLogIn: function(){
      let vm = this;
      FB.login(
        function (response) {
          vm.statusChangeCallback(response);
        }, {
          scope: "email, public_profile",
          return_scopes: true
        }
      );
    },
    statusChangeCallback(response) {
      let vm = this;
      console.log('response', response);
      if (response.status === "connected") {
        // vm.Authorize();
        FB.api('/me?fields=name,id,email', function (response) {
          console.log('res in getProfile', response);
          vm.$store.dispatch('updateUserInfo', {
            id: response.id,
            name: response.name,
            email: response.email
          });
        });
        this.isSignUp = false;
        this.isLogIn = false;
        this.isFbSignUp = true;
        this.$emit("fbSignUp");
      } else if (response.status === "not_authorized") {
        vm.$store.dispatch('updateAuthorized', false);
      } else if (response.status === "unknown") {
        vm.$store.dispatch('updateAuthorized', false);
      } else {
        vm.$store.dispatch('updateAuthorized', false);
      }
    },
  },
  data() {
    return {
      isSignUp: false,
      isLogIn: true,
      isFbSignUp: false,
      resMsg: "",
      update: 0,
    }
  },
  computed: {
    
  },
}
</script>

<style lang="sass" scoped>

</style>