<template>
<el-container>
  <el-divider content-position="center">即將到來行程</el-divider>
  <el-carousel :interval="4000" type="card" height="30vh">
    <!-- 即將到來行程陣列 -->
    <el-carousel-item v-model="itineraries" v-for="item in itineraries" :key="item">
      <div style="width: auto; height: 100%;" @click="checkDetail">
        <img :fit="cover" :src='item.togos[0][0].images[0]' style="width: 100%; height: 100%;" class="card_img">
        <span class="card_text">{{ item.name }} {{ item.startDate.year }} - {{ item.startDate.month }} - {{ item.startDate.day }}</span>
      </div>
    </el-carousel-item>
  </el-carousel>
</el-container>
</template>

<script>
export default {
  name: "MemberItineryCarousel",
  props: {
    title,
    itineraries
  },
  data() {
    return {
      
    }
  },
  methods: {
    checkDetail: function(){
      alert("???");
    }
  },
}
</script>

<style scoped>

</style>

