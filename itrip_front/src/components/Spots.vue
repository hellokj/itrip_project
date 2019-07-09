<template>
  
  <div class="spotContainer">
    <div class="Result">
      <p>搜尋結果</p>
    </div>
    
    <div :key="spot.id" v-for="(spot, index) in spots" overflow:auto>
      <!-- SpotItem -->
      <SpotItem :spot="spot" :index="index" v-on:add-spot="$emit('add-spot', spot)" />
    </div>
    <!-- <h1>hello</h1> -->

  </div>
</template>

<script>
import SpotItem from './SpotItem'
export default {
    name: "Spots",
    components: {
      SpotItem
    },
    props: {
     "spots": Array 
    }
}
</script>

<style scoped>
  .spotContainer {
    margin: 0px;
    padding: 0px;
    width: 365px;
    height: calc(100vh - 80px);
    border-left: 2px solid rgb(199, 199, 199);
    background: #F1F0F0;
    color: #515151;
    display: flex;
    flex-direction: column;
    justify-content: flex-start;
    align-items: flex-start;
  }

    .Result {
    font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
    size: 16px; /*This line does not work in chrome*/
    color: #515151;
    margin-left: 11px;
    margin-top: 4px;
  }
</style>