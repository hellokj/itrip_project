<template>
  <el-container class="info_container">
    <div class="info_title">我低追蹤清單</div>
    <el-divider></el-divider>
  </el-container>
</template>

<script>
export default {
  name: "MemberFollowingList"
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

  .el-divider {
    height: 1px;
    width: 100%;
    margin: 5px;
    background-color: #fcba03;
    position: relative;
  }
</style>
