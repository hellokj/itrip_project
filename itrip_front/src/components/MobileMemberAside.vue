<template>
  <el-aside width="auto" style="background-color: rgb(238, 241, 246)">
    <el-menu default-active="1" class="el-menu-vertical-demo" :menu-trigger="'click'" @open="handleOpen" @close="handleClose" :collapse="true">
      <el-menu-item index="0-0" @click="changeToCarousel"><i class="el-icon-search"></i></el-menu-item>

        <el-submenu index="1" >
          <template slot="title"><i class="el-icon-menu"></i></template>
            <el-menu-item-group title="行程">
              <el-submenu index="1-1">
                <span slot="title">即將到來行程</span>
                <el-menu-item :index="'1-1-'+i" v-for="(item, i) in incomingItineraries" :key="item.id" @click="checkDetail(item)">
                  <i class="el-icon-place"></i>{{ item.name }}
                </el-menu-item>
              </el-submenu>
              <el-submenu index="1-2">
                <span slot="title">過往行程</span>
                <el-menu-item :index="'1-2-'+i" v-for="(item, i) in historyItineraries" :key="item.id" @click="checkDetail(item)">
                  <i class="el-icon-position"></i>{{ item.name }}
                </el-menu-item>
              </el-submenu>
            </el-menu-item-group>
        </el-submenu>
        <el-submenu index="2">
          <template slot="title"><i class="el-icon-setting"></i></template>
          <el-menu-item-group title="帳戶安全">
            <el-menu-item index="2-1" @click.native="setting"><i class="el-icon-user"></i>會員資訊</el-menu-item>
          </el-menu-item-group>
          <el-menu-item-group title="社群網路">
            <el-menu-item index="2-2" @click.native="checkFollowing"><i class="el-icon-star-off"></i>我的追蹤清單</el-menu-item>
          </el-menu-item-group>
        </el-submenu>
    </el-menu>
  </el-aside>
</template>

<script>
  export default {
    name: "MobileMemberAside",
    data() {
      return {
        isCollapse: true
      };
    },
    props: {
      myItineraries: Array,
      incomingItineraries: Array,
      historyItineraries: Array,
      // titles: Array
    },
    methods: {
      changeToCarousel: function(){
        this.$emit("changeToCarousel", "MobileMemberItineraryCarousel");
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
      handleOpen(key, keyPath) {
        console.log(key, keyPath);
      },
      handleClose(key, keyPath) {
        console.log(key, keyPath);
      }
    }
  }
</script>

<style>

</style>