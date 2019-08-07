<template>
<el-dialog
  title="登入"
  v-model="isVisible"
  :visible.sync="isVisible"
  :modal="false"
  width='80vw'
  :close-on-click-modal="false"
  @close="closeDialog"
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
    <el-button class="mt-2" type="info" @click="fbLogIn">以FB帳號登入</el-button>
  </span>
</el-dialog>
</template>

<script>
import { apiLogIn, apiFbLogIn } from '../../utils/api'
import { EmailChecker } from '../../utils/checker'
import { Message } from 'element-ui';
export default {
  name: "MobileLogInForm",
  props: {
    visible: Boolean
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
      isVisible: false,
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
  methods: {
    closeDialog: function(){
      this.$emit('closeDialog');
    },
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
          self.$store.dispatch("updateUserToken", res.data.data);
          
          let userInfo = {
            id: res.data.memberId,
            name: res.data.memberName,
            email: "",
            url: ""
          }
          //console.log(userInfo)
          self.$store.dispatch("updateUserInfo", userInfo);
          // token
          self.$router.push('?currentAccessId=' + self.logInForm.account);
          self.$refs["logInForm"].resetFields();
          
          self.$store.dispatch("updateAuthorized", true); // 登入成功
          self.$message.success(self.$store.state.user.name + ', 歡迎回來!');
          // Message({
          //     message: ,
          //     type: 'success'
          //   });
          self.$socket.emit('logIn', {token: self.$store.state.userToken});
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
        FB.api('/me?fields=name,email', function (response) {
          let member = {
            id: response.email,
            name: response.name,
            email: response.email
          }
          apiFbLogIn(member).then(function(res){
            if (res.data.status == -1 || res.data.status == 200){
              // 登入成功
              // console.log("res.data", res.data);
              self.hint = "";
              self.isVisible = false;
              self.$store.dispatch("updateUserToken", res.data.data);
              let userInfo = {
                id: res.data.memberId,
                name: res.data.memberName,
                email: "",
                url: ""
              }
              //console.log(userInfo)
              self.$store.dispatch("updateUserInfo", userInfo);
              // token
              self.$router.push('?currentAccessId=' + userInfo.id);
              self.$refs["logInForm"].resetFields();
              
              self.$store.dispatch("updateAuthorized", true); // 登入成功
              Message({
                message: self.$store.state.user.name + ', 歡迎回來!',
                type: 'success'
              });
              self.$socket.emit('logIn', {token: self.$store.state.userToken});
            }
          })
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
      this.$emit("changeView", 'MobileSignUpForm');
      // this.$emit("changeFormState", {
      //   isLogIn: false,
      //   isSignUp: true,
      //   isFbSignUp: false
      // });
      this.resetForm();
    },
    toFbSignUp: function(){
      this.$emit("changeView", 'MobileFbSignUpForm');
      // this.$emit("changeFormState", {
      //   isLogIn: false,
      //   isSignUp: false,
      //   isFbSignUp: true
      // });
      this.resetForm();
    },
  },
  created() {
    this.isVisible = this.visible;
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
  },
  watch: {
    visible: function(newVal, oldVal){
      this.isVisible = newVal;
    }
  }
};
</script>

<style scoped>

  .el-button--info {
    color: #FFF;
    background-color: #3b5998;
    border-color: #3b5998;
  }

</style>
