<template>
  <el-main>
    <el-divider content-position="center">即將到來行程</el-divider>
    <MobileMemberItineraryCarouselItem :itineraries="incomingItineraries" v-on:checkDetail="checkDetail"></MobileMemberItineraryCarouselItem>
    <el-divider content-position="center">過往行程</el-divider>
    <MobileMemberItineraryCarouselItem :itineraries="historyItineraries" v-on:checkDetail="checkDetail"></MobileMemberItineraryCarouselItem>
  </el-main>
</template>

<script>
import MobileMemberItineraryCarouselItem from '../components/MobileMemberItineraryCarouselItem'
export default {
  name: "MobileMemberItineryCarousel",
  components: {
    MobileMemberItineraryCarouselItem,
  },
  props: {
    incomingItineraries: Array,
    historyItineraries: Array,
  },
  data() {
    return {
      
    }
  },
  methods: {
    checkDetail: function(itinerary){
      this.$emit("checkDetail", itinerary);
    }
  },
}
</script>

<style scoped>

</style>

