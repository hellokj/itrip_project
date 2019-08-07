<template>
  <el-dropdown class="py-2 px-1" trigger="hover" style="margin-right: 10px">
    <span style="white-space: nowrap; overflow: hidden;" class="el-dropdown-link">個人檔案<i class="el-icon-arrow-down el-icon--right"></i>
    </span>
    <el-dropdown-menu slot="dropdown">
      <el-dropdown-item @click.native="myProfile">我的行程</el-dropdown-item>
      <el-dropdown-item @click.native="logOut" divided>登出</el-dropdown-item>
    </el-dropdown-menu>
  </el-dropdown>
</template>

<style>
  .el-dropdown-link {
    cursor: pointer;
    color: #FFFFFF;
    font-size: 15px;
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
 @media only screen and (max-width: 768px) {
   .el-dropdown-link {
     color: black;
   }
 }
</style>

<script>
  export default {
    name: "ProfileDropDown",
    data() {
      return {
        
      }
    },
    methods: {
      myProfile: function(){
        this.$bus.$emit("loading", {duration: 2500});
        // 導向瀏覽行程元件
        this.$router.push({path: '/member'});
        this.$bus.$emit("changeToCarousel");
      },
      logOut: function(){
        this.$socket.emit('logOut', {token: this.$store.state.userToken});
        this.$store.dispatch('updateAuthorized', false);
        this.$store.dispatch("updateUserToken", "");
        this.$store.dispatch('updateUserInfo', {});
        FB.logout(function (response) {
          console.log('res when logout', response);
        });
        // 登出後導向首頁
        this.$router.push({path: '/'});
      }
    },
  }
</script>