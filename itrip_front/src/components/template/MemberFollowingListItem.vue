<template>
  <el-card class="following_card" shadow="hover">
    <el-popover
      placement="bottom-start"
      width="{width: auto}"
      v-model="visible">
      <p>確定要取消追蹤XXX嗎？</p>
      <div style="text-align: right; margin: 0">
        <el-button type="primary" size="mini" @click="visible = false">確定</el-button>
        <el-button size="mini" type="text" @click="visible = false">取消</el-button>
      </div>
      <i class="el-icon-circle-close unfollow_button" slot="reference"></i>
    </el-popover>
    <el-avatar src="https://cube.elemecdn.com/0/88/03b0d39583f48206768a7534e55bcpng.png"></el-avatar>
    <p>我是XXX</p>
    <p>打一些基本資訊</p>
    <el-row>
      <el-badge :max="99" :value="200" style="margin-right: 10px;">
        <el-button type="warning" plain>看Ta的行程</el-button>
      </el-badge>
    </el-row>
  </el-card>
</template>

<script>
export default {
  name: "MemberFollowingListItem",
  data() {
    return {
      visible: false,
    };
  }
}
</script>

<style>
  .following_card {
    opacity: 10%;
    height:max-content;
    width: max-content;
    margin: 20px;
  }

  .unfollow_button:hover {
    cursor: pointer;
    transform:translateY(-2px);
    transition:.3s;
  }

  .unfollow_button {
    z-index: 5; 
    width: 10px; 
    height: 10px; 
    float: right;
  }

  .bottom {
    margin-top: 13px;
    line-height: 12px;
  }

  .button {
    padding: 0;
    float: right;
  }

  .image {
    width: 100%;
    display: block;
  }

  .clearfix:before,
  .clearfix:after {
      display: table;
      content: "";
  }
  
  .clearfix:after {
      clear: both
  }
</style>