<template lang="pug">
.login
  h2 welcome
  form(method='post', name='login')
    .form-group
      .input-group
        input(:account="account" type='text', required='required' placeholder="帳號")
        label.control-label(for='account')
          //- | account
        i.bar
      i.bar
    i.bar
    .form-group
      .input-group
        input(:password="password" type='password', required='required' placeholder="密碼")
        label.control-label(for='password')
          //- | password
        i.bar
      i.bar
    i.bar
      .d-flex.align--center.justify--space-between
        button.btn.btn-primary(type='submit') 登入
        button.btn.btn-primary(type='submit') 註冊
</template>

<script>
export default {
  name: "Login",
  props: {
    isLogin: Boolean,
  },
  methods: {
    login: function(account, password){
      
    },
    register: function(){
      // 顯示註冊元件
    }
  },
  data() {
    return {
      
    }
  },
}
</script>

<style lang="sass" scoped>
.login 
  width: 100%
  padding: 2rem

</style>