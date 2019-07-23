<template>
  <el-carousel :interval="4000" type="card" height="30vh">
    <el-carousel-item v-model="itineraries" v-for="(item, index) in itineraries" :key="index">
      <div style="width: auto; height: 100%;" @click="checkDetail(item)">
        <img fit="fit" :src='item.togos[0][0].images[0]' style="width: 100%; height: 100%;" class="card_img">
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
  .card_text {
    z-index: 2;
    display: block;
    position: absolute;
    left: 0;
    right: 0;
    bottom: 0;
    font-size: 16px;
    line-height: 20px;
    color: #fff;
    background-color: black;
    text-align: center;
  }

  .card_img {
    padding: 3px;
  }
</style>
