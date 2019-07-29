<template>
  <el-container class="info_container">
    <div class="info_title">我低追蹤清單</div>
    <el-divider></el-divider>
    <el-container style="overflow: scroll; height: 80vh">
      <el-row>
        <el-col :span="4" v-for="num in data" :key="num+'1'" :offset="1">
          <MemberFollowingListItem></MemberFollowingListItem>
        </el-col>
      </el-row>
    </el-container>
  </el-container>
</template>

<script>
import MemberFollowingListItem from './template/MemberFollowingListItem'
export default {
  name: "MemberFollowingList",
  components: {
    MemberFollowingListItem: MemberFollowingListItem
  },
  data() {
    return {
      i: 0,
      data: Array(19).fill(this.i++),
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

  .el-divider {
    height: 1px;
    width: 100%;
    margin: 5px;
    background-color: #fcba03;
    position: relative;
  }
</style>
