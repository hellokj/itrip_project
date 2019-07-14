<template lang="pug">
.logIn
  h2 logIn
  //- 印出回傳的訊息
  h6 {{ resMsg }}
  form(name='logIn')
    .form-group
      .input-group
        input(v-model:email="email" type='text', required='required' placeholder="帳號/信箱")
        label.control-label(for='email')
          //- | email
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
      .d-flex.align--center.justify--space-between
        button.btn.btn-primary(type='submit' @click="$emit('logIn', email, password)") 登入
  button.btn.btn-primary(@click="$emit('backToSignUp')") 註冊
  v-facebook-login(app-id="2353529008088124" @click="fbLogIn")
</template>

<script>
import VFacebookLogin from 'vue-facebook-login-component'
export default {
  name: "LogIn",
  components: {
    VFacebookLogin
  },
  props: {
    isLogIn: Boolean,
    resMsg: String
  },
  data() {
    return {
      email: "",
      password: "",
    }
  },
  methods: {
    fbLogIn() {
      this.$emit('fbLogIn');
    }
  },
  mounted() {
    
  }
}

</script>

<style lang="sass" scope>
.logIn 
  width: 100%
  padding: 2rem
</style>
