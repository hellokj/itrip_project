<template lang="pug">
.logIn
  .form(style="display: inline-block; width: fit-content; text-align: center;")
    .title(style="display: inline-block; width: fit-content; text-align: center;") logIn
    //- 印出回傳的訊息
    h6 {{ resMsg }}
    .form-group(style="text-align: center; display: inline-block; width: auto;")
      .input-group(style="text-align: center; display: inline-block; width: auto;")
        input(v-model:email="email" type='text', required='required' placeholder="帳號/信箱")
    .form-group(style="text-align: center; display: inline-block; width: auto;")
      .input-group(style="text-align: center; display: inline-block; width: auto;")
        input(v-model:password="password" type='password', required='required' placeholder="密碼")
    .buttonLayout
      .d-flex.align--center.justify--space-between
      .btn(class="btn-left")
        button.btn.btn-primary(type='submit' @click="$emit('logIn', email, password)") 登入
      .btn(class="btn-right")
        button.btn.btn-primary(@click="$emit('backToSignUp')" class="btn") 註冊
  VFBLoginScope(v-if="!isFbSignUp" app-id="2353529008088124" @click="fbLogIn" class="v-facebook-login")
</template>

<script>
import VFBLoginScope from 'vue-facebook-login-component'
export default {
  name: "LogIn",
  components: {
    VFBLoginScope
  },
  props: {
    isLogIn: Boolean,
    isFbSignUp: Boolean,
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

<style lang="sass" scoped>
$color-white: #ffffff
$color-nepal: #8b9dc3
$color-chambray: #3b55a0
.logIn 
  width: auto
  padding: 2rem
  text-align: center

.title
  width: fit-content

// .buttonLayout
//   display: flex

.btn-left
  width: auto
  height: auto
  float: left

.btn-right
  width: auto
  height: auto
  float: right

.v-facebook-login
  width: auto
  box-sizing: border-box
  margin: 0 // Normalize Flex-box
  display: flex
  padding-top: 0
  padding-left: 0
  padding-right: 0
  padding-bottom: 0
  align-items: center
  border-radius: 0.5rem
  justify-content: center
  background-color: lighten($color-chambray, 1%)
  .token
    margin-right: 1.2rem
    transform: translateX(-0.5rem)

  .loader 
    display: inline-block
    border-radius: 50%
    border-style: solid
    border-width: 0.1rem
    border-top-color: $color-nepal
    border-right-color: rgba($color-white, 1)
    border-left-color: rgba($color-white, 1)
    border-bottom-color: rgba($color-white, 1)
    animation: v-facebook-login-spin 2s linear infinite
  
  .loader 
    height: 1.5rem
    margin-right: 0.5rem
  .token, .loader 
    opacity: 0.9
    width: 1.5rem
</style>
