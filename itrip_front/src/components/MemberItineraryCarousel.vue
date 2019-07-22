<template>
  <el-main>
    <el-divider content-position="center">即將到來行程</el-divider>
    <MemberItineraryCarouselItem :itineraries="incomingItineraries" v-on:checkDetail="checkDetail"></MemberItineraryCarouselItem>
    <el-divider content-position="center">過往行程</el-divider>
    <MemberItineraryCarouselItem :itineraries="historyItineraries" v-on:checkDetail="checkDetail"></MemberItineraryCarouselItem>
  </el-main>
</template>

<script>
import MemberItineraryCarouselItem from '../components/MemberItineraryCarouselItem'
export default {
  name: "MemberItineryCarousel",
  components: {
    MemberItineraryCarouselItem,
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

