<template>
  <el-carousel :interval="4000" type="card" height="30vh">
    <el-carousel-item v-model="itineraries" v-for="item in itineraries" :key="item">
      <div style="width: auto; height: 100%;" @click="checkDetail(item)">
        <img :fit="cover" :src='item.togos[0][0].images[0]' style="width: 100%; height: 100%;" class="card_img">
        <span class="card_text">{{ item.name }} {{ item.startDate.year }} - {{ item.startDate.month }} - {{ item.startDate.day }}</span>
      </div>
    </el-carousel-item>
  </el-carousel>
</template>

<script>
export default {
  name: "MemberItineraryCarouselItem",
  props: {
    itineraries: Array
  },
  methods: {
    checkDetail: function(itinerary){
      this.$emit("checkDetail", itinerary);
    }
  },
}
</script>

<style>

</style>
