<template>
  <el-aside width="20%" style="background-color: rgb(238, 241, 246)">
    <el-menu :default-openeds="['1', '2']">
      <el-submenu index="1">
        <template slot="title"  @click="changeToCarousel"><i class="el-icon-menu"></i>我的行程</template>
        <el-menu-item-group :index="1" title="即將到來行程">
          <el-menu-item :index="'1-1-'+i" v-for="(item, i) in incomingItineraries" :key="item.id" @click="checkDetail(item)">{{ item.name }}</el-menu-item>
        </el-menu-item-group>
        <el-menu-item-group :index="2" title="過往行程">
          <el-menu-item :index="'1-2-'+i" v-for="(item, i) in historyItineraries" :key="item.id" @click="checkDetail(item)">{{ item.name }}</el-menu-item>
        </el-menu-item-group>
      </el-submenu>
      <el-submenu index="2">
        <template slot="title"><i class="el-icon-setting"></i>設定</template>
        <el-menu-item-group title="帳戶安全">
          <el-menu-item index="2-1">會員資訊</el-menu-item>
          <el-menu-item index="2-2">更改密碼</el-menu-item>
        </el-menu-item-group>
        <el-menu-item-group title="社群網路">
          <el-menu-item index="2-3">我的追蹤清單</el-menu-item>
        </el-menu-item-group>
      </el-submenu>
    </el-menu>
  </el-aside>
</template>

<script>
export default {
  name: "MemberAside",
  props: {
    myItineraries: Array,
    incomingItineraries: Array,
    historyItineraries: Array,
    // titles: Array
  },
  data() {
    return {

    }
  },
  methods: {
    changeToCarousel: function(){
      this.$emit("changeToCarousel", "MemberItineraryCarousel");
    },
    checkDetail: function(itinerary){
      this.$emit("checkDetail", itinerary);
    }
  },
  watch: {

  },
}
</script>

<style scoped>

</style>

