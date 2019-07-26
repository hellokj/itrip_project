<template>
<el-container class="info_container">
  <div class="info_title">會員資訊</div>
  <el-divider></el-divider>
  <el-card class="box-card info_card" shadow="never">
    <div class="info_msg">{{ msg }}</div>
    <el-form label-position="right" label-width="80px" ref="memberInfo" :model="memberInfo" :rules="rules">
      <el-form-item label="帳號/信箱" prop="account">
        <el-input v-model="memberInfo.account" :disabled="true"></el-input>
      </el-form-item>
      <el-form-item label="名稱" prop="name">
        <el-input v-model="memberInfo.name" clearable></el-input>
      </el-form-item>
      <el-form-item label="url" prop="url">
        <el-input v-model="memberInfo.url" clearable></el-input>
      </el-form-item>
      <el-form-item label="原密碼" prop="originPassword">
        <el-input v-model="memberInfo.originPassword" clearable show-password></el-input>
      </el-form-item>
      <el-form-item label="新密碼" prop="password">
        <el-input v-model="memberInfo.password" clearable show-password></el-input>
      </el-form-item>
      <el-form-item label="再次確認" prop="reCheckPwd">
        <el-input v-model="memberInfo.reCheckPwd" clearable show-password></el-input>
      </el-form-item>
    </el-form>
    <el-button type="warning" round @click="modifyProfile(packMemberInfo)" native-type="submit">修改</el-button>
    <el-button round @click="reset">取消</el-button>
  </el-card>
</el-container>
</template>

<script>
import { apiGetMember, apiModifyProfile } from '../../utils/api'
import { PasswordChecker } from '../../utils/checker'
export default {
  name: "MemberInfos",
  data() {
    var validatePassword = (rule, value, callback) => {
      if (!PasswordChecker(value)){
        callback(new Error('密碼長度需至少6個字，且包含至少一個大寫字母'));
      } else {
        if (PasswordChecker(this.memberInfo.password)){
          this.$refs.memberInfo.validateField('checkPass');
        }
        callback();
      }
    };
    var validateReCheckPwd = (rule, value, callback) => {
      if (value !== this.memberInfo.password){
        callback(new Error('兩次輸入密碼不一致'));
      } else {
        callback();
      }
    };
    return {
      memberInfo: {
        name: "",
        account: "",
        url: "",
        originPassword: "",
        password: "",
        reCheckPwd: "",
      },
      isValidate: false,
      msg: "我這邊放一些提示訊息",
      originInfo: {},
      rules: {
        name: [
          { required: true, message: '請輸入名稱', trigger: 'blur' },
          { min: 0, max: 20, message: '長度不得超過20個字', trigger: 'blur' }
        ],
        url: [
          { required: true, message: '請輸入url', trigger: 'blur' },
          { min: 0, max: 20, message: '格式不符', trigger: 'blur' }
        ],
        originPassword: [
          { required: true, message: '請輸入原密碼', trigger: 'blur' },
          { validator: validatePassword, trigger: 'blur'}
        ],
        password: [
          { required: false, message: '請輸入新密碼', trigger: 'blur' },
          { validator: validatePassword, trigger: 'blur'}
        ],
        reCheckPwd: [
          { required: false, message: '請再次輸入新密碼', trigger: 'blur' },
          { validator: validateReCheckPwd, trigger: 'blur'}
        ],
      }
    }
  },
  methods: {
    modifyProfile: function(memberInfo){
      let self = this;
      // console.log("我是memberInfo", memberInfo);
      if (memberInfo == {}){
        return;
      }else {
        apiModifyProfile(memberInfo)
        .then(function(res){
          // success
          // console.log(res);
          self.msg = "修改成功"
        })
        .catch(function (error) {
          console.log(error);
        });
      }
    },
    reset: function(){
      this.$refs["memberInfo"].resetFields();
      this.memberInfo.account = this.originInfo.account;
      this.memberInfo.name = this.originInfo.name;
      this.memberInfo.url = this.originInfo.url;
    },
    validate: function(){
      this.$refs["memberInfo"].validate((valid) => {
        if (valid) {
          alert('submit!');
        } else {
          // console.log('error submit!!');
          return false;
        }
      });
    }
  },
  created() {
    let self = this;
    apiGetMember(this.$store.state.userToken)
      .then(function(res){
        // console.log("apiGetMember", res);
        self.memberInfo.name = res.data.data.name;
        self.memberInfo.account = res.data.data.account;
        self.memberInfo.url = res.data.data.url;
        self.originInfo = res.data.data;
      })
      .catch(function (error) {
        console.log(error);
      });
  },
  computed: {
    packMemberInfo: function(){
      let memberInfo = {
        name: this.memberInfo.name,
        account: this.memberInfo.account,
        url: this.memberInfo.url,
        originPassword: this.memberInfo.originPassword,
        password: this.memberInfo.password
      }
      return memberInfo;
    }
  },
}
</script>

<style scoped>
  .info_container {
    padding-left: 5px;
    padding-right: 5px;
    display: inline;
    text-align: center;
  }

  .info_title {
    font-weight: bold;
    font-size: xx-large;
    margin-left: 10px;
    text-align: left;
  }

  .info_msg {
    margin-bottom: 20px;
    font-weight: bold;
    font-size: medium;
  }

  .info_card {
    place-content: center;
    padding-top: 10px;
    margin: auto;
    width: 60%;
    height: auto;
    text-align: center;
  }

  .info_input {
    margin-top: 5vh;
  }

  .el-card {
    border: 1px solid rgba(235, 238, 245, 0);
    background-color: #FFF;
    color: #303133;
    -webkit-transition: .3s;
    transition: .3s;
  }

  .el-divider {
    height: 1px;
    width: 100%;
    margin: 5px;
    background-color: #fcba03;
    position: relative;
  }
</style>
