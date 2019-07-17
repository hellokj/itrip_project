<template>
  <el-dropdown trigger="hover" style="margin-right: 10px">
    <span class="el-dropdown-link">個人檔案<i class="el-icon-arrow-down el-icon--right"></i>
    </span>
    <el-dropdown-menu slot="dropdown">
      <el-dropdown-item @click.native="myProfile">我的行程</el-dropdown-item>
      <el-dropdown-item @click.native="setting">設定</el-dropdown-item>
      <el-dropdown-item @click.native="logOut" divided>登出</el-dropdown-item>
    </el-dropdown-menu>
  </el-dropdown>
</template>

<style>
  .el-dropdown-link {
    cursor: pointer;
    color: #FFFFFF;
  }
  .el-icon-arrow-down {
    font-size: 12px;
  }
  .demonstration {
    display: block;
    color: #8492a6;
    font-size: 14px;
    margin-bottom: 20px;
  }
</style>

<script>
  export default {
    methods: {
      myProfile: function(){
        
      },
      setting: function(){

      },
      logOut: function(){
        this.$store.dispatch('updateAuthorized', false);
        this.$store.dispatch('updateUserInfo', {});
        FB.logout(function (response) {
          console.log('res when logout', response);
        });
      }
    }
  }
</script>