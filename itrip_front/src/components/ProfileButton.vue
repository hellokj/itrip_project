<template>
<div id="profileButton">
  <ProfileDropDown v-if="$store.state.isAuthorized"></ProfileDropDown>
  <el-button type="warning" plain v-model="$store.state.isAuthorized" v-if="!$store.state.isAuthorized" @click="openDialog">登入</el-button>
  <LoginForm v-if="($resize && $mq.above(1025))" :isVisible="$store.state.formState.isLogIn" v-on:changeFormState="changeFormState"></LoginForm>
  <MobileLoginForm v-else-if="($resize && !$mq.above(1025))" :isVisible="$store.state.formState.isLogIn" v-on:changeFormState="changeFormState"></MobileLoginForm>
  <SignUpForm :isVisible="$store.state.formState.isSignUp" v-on:changeFormState="changeFormState"></SignUpForm>
  <FbSignUpForm :isVisible="$store.state.formState.isFbSignUp" v-on:changeFormState="changeFormState"></FbSignUpForm>
</div>
</template>

<script>
import LoginForm from '../components/template/LoginForm'
import MobileLoginForm from '../components/MobileLogInForm'
import SignUpForm from '../components/template/SignUpForm'
import FbSignUpForm from '../components/template/FbSignUpForm'
import ProfileDropDown from '../components/template/ProfileDropDown'
export default {
  name: 'ProfileButton',
  components: {
    LoginForm,
    MobileLoginForm,
    SignUpForm,
    FbSignUpForm,
    ProfileDropDown
  },
  props: {
    
  },
  data() {
    return {
      
    }
  },
  methods: {
    openDialog: function(){
      if (!this.$store.state.isAuthorized){
        this.$store.dispatch("updateFormState", {
        isLogIn: true,
        isSignUp: false,
        isFbSignUp: false
        });
      }else {
        this.$store.dispatch("updateAuthorized", false);
        this.$store.dispatch('updateUserInfo', {});
        this.$store.dispatch('updateUserToken', "");
        FB.logout(function (response) {
          console.log('res when logout', response);
        });
      }
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
