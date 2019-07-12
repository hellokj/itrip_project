<template lang="pug">
.signUp
  h2 signUp
  //- 印出回傳的訊息
  h6(v-if="resMsg") {{ resMsg }}
  h6(v-if="msg") {{ msg }}
  form(name='signUp')
    .form-group
      .input-group
        input(v-model:name="name" type='text', required='required' placeholder="名稱")
        label.control-label(for='name')
          //- | name
        i.bar
      i.bar
    i.bar
    .form-group
      .input-group
        input(v-model:url="url" type='text', required='required' placeholder="url")
        label.control-label(for='url')
          //- | account
        i.bar
      i.bar
    i.bar
    .form-group
      .input-group
        input(v-model:email="email" type='text', required='required' placeholder="信箱(登入帳號)")
        label.control-label(for='email')
          //- | mail
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
      .d-flex.align--center.justify--space-between
        button.btn.btn-primary(type='submit' @click="checkSignUpData") 確認
  button.btn.btn-primary(@click="$emit('backToLogIn')") 回到登入頁
</template>

<script>
import { EmailChecker, PasswordChecker } from '../../../utils/checker'
import { UserInfo } from '../../../utils/dataClass'

export default {
  name: "SignUp",
  props: {
    isLogIn: Boolean,
    resMsg: String
  },
  methods: {
    checkSignUpData: function(){
      if (this.reCheckPwd != this.password){
        this.msg = "enter the wrong reCheckPwd";
        return;
      }
      if (!EmailChecker(this.email)){
        this.msg = "wrong email format";
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
      let user = new UserInfo(this.name, this.email, this.url, this.password);
      this.$emit("signUp", user);
    }
  },
  data() {
    return {
      name: "",
      url: "",
      email: "",
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

<style lang="sass" scope>
.signUp 
  width: 100%
  padding: 2rem
</style>
