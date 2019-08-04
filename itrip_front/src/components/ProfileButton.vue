<template>
<div id="profileButton">
  <ProfileDropDown v-model="$store.state.isAuthorized" v-if="$store.state.isAuthorized"></ProfileDropDown>
  <component
    :is="view"
    v-model="visible"
    :visible.sync="visible"
    v-on:changeView="changeView"
    v-on:closeDialog="closeDialog">
  </component>
  <el-button type="warning" plain v-model="$store.state.isAuthorized" v-if="!$store.state.isAuthorized" @click="openDialog">登入</el-button>
  <!-- <LoginForm v-if="(this.$resize && this.$mq.above(1025))" :isVisible="$store.state.formState.isLogIn" v-on:changeFormState="changeFormState"></LoginForm>
  <MobileLoginForm v-else-if="(this.$resize && !this.$mq.above(1025))" :isVisible="$store.state.formState.isLogIn" v-on:changeFormState="changeFormState"></MobileLoginForm>
  <SignUpForm v-if="(this.$resize && this.$mq.above(1025))" :isVisible="$store.state.formState.isSignUp" v-on:changeFormState="changeFormState"></SignUpForm>
  <MobileSignUpForm v-else-if="(this.$resize && !this.$mq.above(1025))" :isVisible="$store.state.formState.isSignUp" v-on:changeFormState="changeFormState"></MobileSignUpForm>
  <FbSignUpForm v-if="(this.$resize && this.$mq.above(1025))" :isVisible="$store.state.formState.isFbSignUp" v-on:changeFormState="changeFormState"></FbSignUpForm>
  <MobileFbSignUpForm v-else-if="(this.$resize && !this.$mq.above(1025))" :isVisible="$store.state.formState.isFbSignUp" v-on:changeFormState="changeFormState"></MobileFbSignUpForm> -->
</div>
</template>

<script>
import LoginForm from '../components/template/LoginForm'
import MobileLoginForm from '../components/MobileLogInForm'
import SignUpForm from '../components/template/SignUpForm'
import MobileSignUpForm from '../components/MobileSignUpForm'
import FbSignUpForm from '../components/template/FbSignUpForm'
import MobileFbSignUpForm from '../components/MobileFbSignUpForm'
import ProfileDropDown from '../components/template/ProfileDropDown'
export default {
  name: 'ProfileButton',
  components: {
    LoginForm: LoginForm,
    MobileLoginForm: MobileLoginForm,
    SignUpForm: SignUpForm,
    MobileSignUpForm: MobileSignUpForm,
    FbSignUpForm: FbSignUpForm,
    MobileFbSignUpForm: MobileFbSignUpForm,
    ProfileDropDown,
  },
  props: {
    
  },
  data() {
    return {
      view: "LoginForm",
      visible: false,
      windowWidth: 0,
    }
  },
  methods: {
    handleResize() {
      this.windowWidth = window.innerWidth;
    },
    changeView: function(viewName){
      this.view = viewName;
    },
    openDialog: function(){
      this.visible = true;
      // if (!this.$store.state.isAuthorized){
      //   this.$store.dispatch("updateFormState", {
      //   isLogIn: true,
      //   isSignUp: false,
      //   isFbSignUp: false
      //   });
      // }else {
      //   this.$store.dispatch("updateAuthorized", false);
      //   this.$store.dispatch('updateUserInfo', {});
      //   this.$store.dispatch('updateUserToken', "");
      //   FB.logout(function (response) {
      //     console.log('res when logout', response);
      //   });
      // }
    },
    closeDialog: function(){
      this.visible = false;
      // this.$store.dispatch("updateFormState", {
      //   isLogIn: false,
      //   isSignUp: false,
      //   isFbSignUp: false
      // });
    },
    changeFormState: function(formState){
      this.$store.dispatch("updateFormState", formState);
    },
  },
  created() {
    window.addEventListener('resize', this.handleResize);
    this.handleResize();
    let self = this;
    if ((self.$resize && !self.$mq.above(1025))){
      this.view = "MobileLoginForm";
    }else {
      this.view = "LoginForm";
    }
  },
  destroyed: function() {
    window.removeEventListener('resize', this.handleResize)
  },
  watch: {
    windowWidth: function(newVal, oldVal){
      let currentView = this.view;
      if(newVal <= 1025 && newVal !== oldVal) {
        if (currentView.substr(0, 6) !== 'Mobile'){
          this.changeView("Mobile" + currentView);
        }
      }
      if(newVal > 1025 && newVal !== oldVal) {
        if (currentView.substr(0, 6) == 'Mobile'){
          this.changeView(currentView.substr(6));
        }
      }
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
  font-size: 25px
</style>