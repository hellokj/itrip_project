<template>
<div id="profileButton">
  <!-- <button v-model="$store.state.isAuthorized" @click="$emit('button-click')">{{ logInLogOut() }}</button> -->
  <el-button type="warning" plain v-model="$store.state.isAuthorized" @click="openDialog">{{ logInLogOut() }}</el-button>
  <LoginForm :isVisible="$store.state.formState.isLogIn" v-on:changeFormState="changeFormState"></LoginForm>
  <SignUpForm :isVisible="$store.state.formState.isSignUp" v-on:changeFormState="changeFormState"></SignUpForm>
  <FbSignUpForm :isVisible="$store.state.formState.isFbSignUp" v-on:changeFormState="changeFormState"></FbSignUpForm>
  
</div>
</template>

<script>
import LoginForm from '../components/template/LoginForm'
import SignUpForm from '../components/template/SignUpForm'
import FbSignUpForm from '../components/template/FbSignUpForm'
export default {
  name: 'ProfileButton',
  components: {
    LoginForm,
    SignUpForm,
    FbSignUpForm
  },
  props: {
    
  },
  data() {
    return {
      
    }
  },
  methods: {
    openDialog: function(){
      this.$store.dispatch("updateFormState", {
        isLogIn: true,
        isSignUp: false,
        isFbSignUp: false
      });
    },
    closeDialog: function(){
      this.$store.dispatch("updateFormState", {
        isLogIn: false,
        isSignUp: false,
        isFbSignUp: false
      });
    },
    changeFormState: function(formState){
      this.$store.dispatch("updateFormState", formState);
    },
    logInLogOut: function() {
      if (this.$store.state.isAuthorized){
        return "登出";
      }
      // 之後換成下拉
      return "登入";
    }
  },
}
</script>

<style lang="sass" scoped>
.button
  width: 125px
  height: 40px
  border: 2px solid #ffffff
  border-radius: 20px
  display: flex
  align-items: center
  justify-content: center
  margin-right: 50px
  background: #FFFFFF
</style>
