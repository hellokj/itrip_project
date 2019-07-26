<template>
  <el-aside width="20%" style="background-color: rgb(238, 241, 246)">
    <el-menu :default-openeds="['0', '2']">
      <el-menu-item index="0-0" @click="changeToCarousel"><i class="fas fa-search-location"></i>瀏覽行程</el-menu-item>
      <el-submenu index="1">
        <template slot="title"><i class="el-icon-menu"></i>我的行程</template>
        <el-menu-item-group :index="1" title="即將到來行程">
          <el-menu-item :index="'1-1-'+i" v-for="(item, i) in incomingItineraries" :key="item.id" @click="checkDetail(item)">
            <i class="fas fa-suitcase-rolling"></i>     {{ item.name }}</el-menu-item>
        </el-menu-item-group>
        <el-menu-item-group :index="2" title="過往行程">
          <el-menu-item :index="'1-2-'+i" v-for="(item, i) in historyItineraries" :key="item.id" @click="checkDetail(item)">
            <i class="fas fa-suitcase-rolling"></i>     {{ item.name }}</el-menu-item>
        </el-menu-item-group>
      </el-submenu>
      <el-submenu index="2">
        <template slot="title"><i class="el-icon-setting"></i>設定</template>
        <el-menu-item-group title="帳戶安全">
          <el-menu-item index="2-1" @click.native="setting">會員資訊</el-menu-item>
        </el-menu-item-group>
        <el-menu-item-group title="社群網路">
          <el-menu-item index="2-2" @click.native="checkFollowing">我的追蹤清單</el-menu-item>
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
    },
    setting: function(){
      this.$emit("setMemberInfo");
    },
    checkFollowing: function(){
      this.$emit("checkFollowing");
    },
  },
  watch: {

  },
}
</script>

<style scoped>

</style>

