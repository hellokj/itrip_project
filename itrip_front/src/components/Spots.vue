<template>
  
  <div class="spotContainer">
    <div>
      <p>搜尋結果</p>
    </div>
    <div  v-bind:key="spot.id" v-for="spot in spots" overflow:auto>
      <!-- SpotItem -->
      <SpotItem v-bind:spot="spot" v-on:add-spot="$emit('add-spot', spot)" />
    </div>
    <h1>hello</h1>

  </div>
</template>

<script>
import SpotItem from './SpotItem'
export default {
    name: "Spots",
    components: {
      SpotItem
    },
    props: ["spots"]
}
</script>

<style scoped>
  .spotContainer {
    margin: 0px;
    padding: 0px;
    width: 365px;
    border-left: 2px solid rgb(199, 199, 199);
    /* background: #F1F0F0; */
    background: #F1F0F0;
    color: #515151;
    display: flex;
    flex-direction: column;
    justify-content: flex-start;
    align-items: flex-start;
  }
</style>