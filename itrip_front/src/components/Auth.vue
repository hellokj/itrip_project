<template lang="pug">
  SignUp(v-model="isSignUp" v-if="isSignUp && !isLogIn" v-on:backToLogIn="backToLogIn" v-on:signUp="signUp" v-bind:resMsg="resMsg")
  LogIn(v-model="isLogIn" v-else="!isSignUp && isLogIn" v-on:backToSignUp="backToSignUp" v-on:logIn="logIn" v-on:fbLogIn="fbLogIn" v-bind:resMsg="resMsg")
</template>

<script>
import LogIn from './template/LogIn'
import SignUp from './template/SignUp'
import { apiLogIn, apiSignUp } from '../../utils/api'

export default {
  name: "Auth",
  components: {
    LogIn,
    SignUp,
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
          self.$emit("logIn-ok");
          self.resMsg = "";
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
    },
    backToSignUp: function(){
      this.isSignUp = true;
      this.isLogIn = false;
    },
    fbLogIn: function(){
      this.$emit('fbLogIn');
    }
  },
  data() {
    return {
      isSignUp: false,
      isLogIn: true,
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