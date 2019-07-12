<template>
  
  <div class="spotContainer">
    <div class="Result">
      <p>搜尋結果</p>
    </div>

    <virtual-list :size="100" :remain="8">
      <SpotItem :key="spot._id" v-for="(spot, index) in spots" :spot="spot" :index="index" v-on:add-spot="$emit('add-spot', spot)" />
    </virtual-list>
    
    <!-- <div :key="spot.id" v-for="(spot, index) in spots" overflow:auto>
      <!-- SpotItem -->
      
    <!-- <v-pagination v-model="currentPage"
                  :page-count="totalPages"
                  :classes="bootstrapPaginationClasses"
                  :labels="paginationAnchorTexts"></v-pagination> -->
    <!-- <h1>hello</h1> -->

  </div>
</template>

<script>
import SpotItem from './SpotItem'
import virtualList from 'vue-virtual-scroll-list'
import vPagination from 'vue-plain-pagination'

export default {
    name: "Spots",
    components: {
      SpotItem,
      'virtual-list': virtualList,
      vPagination
    },
    data() {
      return {
        currentPage: 1,
        totalPages: 30,
        bootstrapPaginationClasses: {
          ul: 'pagination',
          li: 'page-item',
          liActive: 'active',
          liDisable: 'disabled',
          button: 'page-link'  
        },
        paginationAnchorTexts: {
        first: '<<',
        prev: '<',
        next: '>',
        last: '>>'
      }
      }
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