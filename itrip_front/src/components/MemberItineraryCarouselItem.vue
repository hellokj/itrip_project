<template>
  <el-carousel :interval="4000" type="card" height="30vh">
    <el-carousel-item style="border: 3px solid #edb855" v-model="itineraries" v-for="(item, index) in itineraries" :key="index">
      <div class="img-container" @click="checkDetail(item)">
        <img :src='imgSrc(item)' style="width: 100%; height: auto;" class="card_img">
        <!-- <div class="ribbon">公開</div> -->
        <span class="card_text">{{ item.name }} {{ item.startDate.year }} - {{ item.startDate.month }} - {{ item.startDate.day }}</span>
      </div>
    </el-carousel-item>
  </el-carousel>
</template>

<script>
const blank = require('../assets/blank.jpg');
export default {
  name: "MemberItineraryCarouselItem",
  props: {
    itineraries: Array
  },
  methods: {
    checkDetail: function(itinerary){
      this.$emit("checkDetail", itinerary);
    },
    imgSrc: function(itinerary){
      if (itinerary.togos[0] == undefined){
        return blank;
      }else {
        if (itinerary.togos[0][0] == undefined){
          return blank;
        }
        return String(itinerary.togos[0][0].images[0]);
      }
    }
  },
  computed: {
  },
  created() {
    
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
    background-color: #edb855;
    text-align: center;
  }

  .card_img {
    position: absolute;
    overflow: hidden;
  }

  .img-container {
    width: auto; 
    height: 100%; 
    overflow: hidden; 
    display: flex; 
    justify-content: center; 
    align-items: center;
  }

  .ribbon {
    position: relative;
    left: 75%;
    top: 12%;
    width: 150px;
    background-color: #f5ad42;
    color: #ff1f0f;
    font-weight: bold;
    padding: 5px 0;
    text-align: center;
    transform: rotate(45deg);
    box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  }
</style>
