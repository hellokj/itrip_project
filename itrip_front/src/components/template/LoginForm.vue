<template>
<div class="logInForm">
    <el-dialog
      title="登入"
      :visible.sync="isVisible"
      width="30%"
      center>
      <span style="text-align: center">{{ hint }}</span>
      <div style="height: 10px"></div>
      <el-form :model="logInForm" ref="logInForm" status-icon :rules="rules" class="demo-ruleForm">
        <el-form-item prop="account" resetField="resetForm">
          <el-input v-model="logInForm.account" placeholder="帳號/信箱" clearable></el-input>
        </el-form-item>
        <el-form-item prop="password" resetField="resetForm">
          <el-input v-model="logInForm.password" placeholder="密碼" show-password clearable></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button type="primary" @click="confirm">確認</el-button>
        <el-button @click="toSignUp">註冊</el-button>
        <el-button type="info" @click="fbLogIn">FB帳號註冊</el-button>
        <!-- <div class="fb-login-button" data-width="40" data-size="small" data-button-type="continue_with" data-auto-logout-link="true" data-use-continue-as="true" data-onlogin="fbLogIn()"></div> -->
      </span>
    </el-dialog>
  </div>
</template>

<script>
import { apiLogIn } from '../../../utils/api'
import { EmailChecker } from '../../../utils/checker'
export default {
  props: {
    isVisible: Boolean
  },
  data() {
    var validateEmail = (rule, value, callback) => {
      if (!EmailChecker(value)){
        callback(new Error('輸入格式不符'));
      } else {
        if (EmailChecker(this.logInForm.account)){
          this.$refs.logInForm.validateField('checkPass');
        }
        callback();
      }
    };
    return {
      hint: "",
      logInForm: {
        account: "",
        password: ""
      },
      rules: {
        account: [
          { required: true, message: '請輸入帳號/信箱', trigger: 'blur' },
          { validator: validateEmail, trigger: 'blur'}
        ],
        password: [
          { required: true, message: '請輸入密碼', trigger: 'blur' },
          { min: 6, max: 20, message: '密碼長度介於6至20字', trigger: 'blur' }
        ]
      }
    };
  },
  mounted() {
    let self = this;
    window.fbAsyncInit = function () {
        FB.init({
          appId: "2353529008088124",
          xfbml: true,
          status: true,
          cookie: true,
          autoLogAppEvents: true,
          version: "v3.3"
        });
      };
    //login
    FB.AppEvents.logPageView();
      //Get FB Login Status
    if (!self.$store.state.isAuthorized){
      //login
      FB.AppEvents.logPageView();
      //Get FB Login Status
      FB.getLoginStatus(response => {
        self.statusChangeCallback(response);
      });
    }
  },
  methods: {
    confirm: function(){
      let self = this;
      let data = {
        email: this.logInForm.account,
        password: this.logInForm.password
      }
      apiLogIn(data)
      .then(function(res) {
        if (res.data.status == -1){
          self.hint = "";
          self.isVisible = false;
          self.$refs["logInForm"].resetFields();
          self.$store.dispatch("updateUserToken", res.data.data); // token
          self.$store.dispatch("updateFormState", {
            isLogIn: false,
            isSignUp: false,
            isFbSignUp: false
          });
          self.$store.dispatch("updateAuthorized", true); // 登入成功
        }else{
          self.hint = res.data.msg;
        }
      })
      .catch(function(err){
        console.log(err);
      });
    },
    fbLogIn(){
      let self = this;
      FB.login(function (response) {
          self.statusChangeCallback(response);
        }, {
          scope: "email, public_profile",
          return_scopes: true
        }
      );
    },
    statusChangeCallback(response) {
      let self = this;
      if (response.status === "connected") {
        FB.api('/me?fields=name,id,email', function (response) {
          self.$store.dispatch('updateUserInfo', {
            id: response.id,
            name: response.name,
            email: response.email
          });
          self.toFbSignUp();
        });
      } else if (response.status === "not_authorized") {
        self.$store.dispatch('updateAuthorized', false);
      } else if (response.status === "unknown") {
        self.$store.dispatch('updateAuthorized', false);
      } else {
        self.$store.dispatch('updateAuthorized', false);
      }
    },
    resetForm: function(){
      this.$refs["logInForm"].resetFields();
    },
    toSignUp: function(){
      this.$emit("changeFormState", {
        isLogIn: false,
        isSignUp: true,
        isFbSignUp: false
      });
      this.resetForm();
    },
    toFbSignUp: function(){
      this.$emit("changeFormState", {
        isLogIn: false,
        isSignUp: false,
        isFbSignUp: true
      });
    }
  },
};
</script>

