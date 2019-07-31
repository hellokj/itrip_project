<template>
<el-dialog
  title="註冊"
  :visible.sync="isVisible"
  width="80vw"
  :modal="false"
  center>
  <span style="text-align: center">{{ hint }}</span>
  <div style="height: 10px"></div>
  <el-form :model="signUpForm" ref="signUpForm" status-icon :rules="rules" class="demo-ruleForm">
    <el-form-item prop="name" resetField="resetForm">
      <el-input v-model="signUpForm.name" placeholder="名稱" clearable></el-input>
    </el-form-item>
    <el-form-item prop="url" resetField="resetForm">
      <el-input v-model="signUpForm.url" placeholder="url" clearable></el-input>
    </el-form-item>
    <el-form-item prop="email" resetField="resetForm">
      <el-input v-model="signUpForm.email" placeholder="email" clearable></el-input>
    </el-form-item>
    <el-form-item prop="password" resetField="resetForm">
      <el-input v-model="signUpForm.password" placeholder="密碼" clearable show-password></el-input>
    </el-form-item>
    <el-form-item prop="reCheckPwd" resetField="resetForm">
      <el-input v-model="signUpForm.reCheckPwd" placeholder="再次確認密碼" clearable show-password></el-input>
    </el-form-item>
  </el-form>
  <span slot="footer" class="dialog-footer">
    <el-button type="primary" @click="submit">送出</el-button>
    <el-button @click="toLogIn">回到登入</el-button>
  </span>
</el-dialog>
</template>

<script>
import { EmailChecker, PasswordChecker } from '../../utils/checker'
import { apiSignUp } from '../../utils/api'
import { UserInfo } from '../../utils/dataClass'
export default {
  name: "MobileSignUpForm",
  props: {
    isVisible: Boolean
  },
  data() {
    var validateEmail = (rule, value, callback) => {
      if (!EmailChecker(value)){
        callback(new Error('輸入格式不符'));
      } else {
        if (EmailChecker(this.signUpForm.email)){
          this.$refs.signUpForm.validateField('checkPass');
        }
        callback();
      }
    };
    var validatePassword = (rule, value, callback) => {
      if (!PasswordChecker(value)){
        callback(new Error('密碼長度需至少6個字，且包含至少一個大寫字母'));
      } else {
        if (PasswordChecker(this.signUpForm.password)){
          this.$refs.signUpForm.validateField('checkPass');
        }
        callback();
      }
    };
    var validateReCheckPwd = (rule, value, callback) => {
      if (value !== this.signUpForm.password){
        callback(new Error('兩次輸入密碼不一致'));
      } else {
        callback();
      }
    };
    return {
      hint: "",
      signUpForm: {
        name: "",
        url: "",
        email: "",
        password: "",
        reCheckPwd: "",
      },
      rules: {
        name: [
          { required: true, message: '請輸入名稱', trigger: 'blur' },
          { min: 0, max: 20, message: '長度不得超過20個字', trigger: 'blur' }
        ],
        url: [
          { required: true, message: '請輸入url', trigger: 'blur' },
          { min: 0, max: 20, message: '格式不符', trigger: 'blur' }
        ],
        email: [
          { required: true, message: '請輸入email', trigger: 'blur' },
          { validator: validateEmail, trigger: 'blur'}
        ],
        password: [
          { required: true, message: '請輸入密碼', trigger: 'blur' },
          { validator: validatePassword, trigger: 'blur'}
        ],
        reCheckPwd: [
          { required: true, message: '請再次輸入密碼', trigger: 'blur' },
          { validator: validateReCheckPwd, trigger: 'blur'}
        ],
      }
    };
  },
  methods: {
    submit: function(){
      let self = this;
      let data = {
        name: this.signUpForm.name,
        url: this.signUpForm.url,
        email: this.signUpForm.email,
        password: this.signUpForm.password
      }
      
      apiSignUp(data)
      .then(function(res) {
        if (res.data.status == 200){
          self.hint = "註冊成功，回到登入頁重新登入";
          self.$refs["signUpForm"].resetFields();
        }else{
          self.hint = res.data.msg;
        }
      })
      .catch(function(err){
        console.log(err);
      });
    },
    resetForm: function(){
      this.$refs["signUpForm"].resetFields();
    },
    toLogIn: function(){
      this.$emit("changeFormState", {
        isLogIn: true,
        isSignUp: false,
        isFbSignUp: false
      });
      this.resetForm();
    }
  },
};
</script>

