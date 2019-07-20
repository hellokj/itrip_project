<template>
  <el-aside width="20%" style="background-color: rgb(238, 241, 246)">
    <el-menu :default-openeds="['']">
      <el-submenu index="2">
        <template slot="title"><i class="el-icon-menu"></i>我的行程</template>
        <el-menu-item-group title="即將到來行程">
          <el-menu-item index=2-item.name v-for="item in myItineraries" :key="item.name">{{ item.name }}</el-menu-item>
        </el-menu-item-group>
        <el-menu-item-group title="過往行程">
          <el-menu-item index=2-item.name v-for="item in myItineraries" :key="item.name">{{ item.name }}</el-menu-item>
        </el-menu-item-group>
      </el-submenu>
      <el-submenu index="3">
        <template slot="title"><i class="el-icon-setting"></i>設定</template>
        <el-menu-item-group title="帳戶安全">
          <el-menu-item index="3-1">會員資訊</el-menu-item>
          <el-menu-item index="3-2">更改密碼</el-menu-item>
        </el-menu-item-group>
        <el-menu-item-group title="社群網路">
          <el-menu-item index="3-3">我的追蹤清單</el-menu-item>
        </el-menu-item-group>
      </el-submenu>
    </el-menu>
  </el-aside>
</template>

<script>
export default {
  name: "MemberAside",
  props: {
    myItineraries,
    // incomingItineraries,
    // historyItineraries,
    // titles
  },
  data() {
    return {

    }
  },
  methods: {
    
  },
  watch: {
    myItineraries(newVal, oldVal){
      console.log(newVal);
    }
  },
}
</script>

<style scoped>

</style>

