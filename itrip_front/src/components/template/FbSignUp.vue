<template lang="pug">
.signUp
  h2 FbSignUp
  //- 印出回傳的訊息
  h6(v-if="resMsg") {{ resMsg }}
  h6(v-if="msg") {{ msg }}
  form(name='signUp' class="formLayout")
    .form-group
      .input-group
        input(v-model:url="url" type='text', required='required' placeholder="url")
        label.control-label(for='url')
          //- | url
        i.bar
      i.bar
    i.bar
    .form-group
      .input-group
        input(v-model:password="password" type='password', required='required' placeholder="密碼")
        label.control-label(for='password')
          //- | password
        i.bar
      i.bar
    i.bar
    .form-group
      .input-group
        input(v-model:reCheckPwd="reCheckPwd" type='password', required='required' placeholder="再次輸入密碼")
        label.control-label(for='reCheckPwd')
          //- | password
        i.bar
      i.bar
    i.bar
  .buttonLayout
    .d-flex.align--center.justify--space-between
      button.btn.btn-primary(type='submit' @click="checkSignUpData") 確認
  button.btn.btn-primary(@click="backToLogIn") 回到登入
</template>

<script>
import { EmailChecker, PasswordChecker } from '../../../utils/checker'
import { UserInfo } from '../../../utils/dataClass'

export default {
  name: "FbSignUp",
  props: {
    isLogIn: Boolean,
    resMsg: String,
  },
  methods: {
    checkSignUpData: function(){
      if (this.reCheckPwd != this.password){
        this.msg = "enter the wrong reCheckPwd";
        return;
      }
      if (!PasswordChecker(this.password)){
        this.msg = "wrong password format";
        return;
      }
      this.isValidate = true;
      this.msg = "";
      this.signUpUser();
    },
    signUpUser: function(){
      let user = new UserInfo(this.$store.state.user.name, this.$store.state.user.email, this.url, this.password);
      this.$emit("signUp", user);
    },
    backToLogIn: function(){
      let self = this;
      FB.logout(function(response) {
        self.$emit("backToLogIn");
      });
    }
  },
  data() {
    return {
      url: "",
      password: "",
      reCheckPwd: "",
      isValidate: false,
      msg: "", // use for show the error message
    }
  },
  computed: {
    
  },
}
</script>

<style lang="sass" scoped>
.signUp 
  width: 100%
  padding: 2rem

.formLayout
  width: 100%

.formLayout input
  width: 80%

.buttonLayout
  display: flex
</style>
