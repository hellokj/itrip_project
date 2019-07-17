<template>
  <div class="spotContainer">
    <div class="tag-container">
      <p class="mx-4 pt-3">搜尋結果 排序:</p>
      <b-dropdown size="sm" class="m-2" v-model="sortBy">
          <template slot="button-content">&#x1f50d;<span class="sr-only">Search</span>{{sortString}}</template>
          <b-dropdown-item-button @click="sortBy='checkins'" >臉書打卡王</b-dropdown-item-button>
          <b-dropdown-item-button @click="sortBy='ig_post_num'">IG Tag熱度</b-dropdown-item-button>
          <b-dropdown-item-button @click="sortBy='government_data'">政府推薦</b-dropdown-item-button>
      </b-dropdown>
    </div>
    <div class="result-container">
      <virtual-list :size="180" :remain="5">
        <SpotItem :key="spot._id" v-for="(spot, index) in spots" 
        :spot="spot" :index="index" :perPage="perPage" :currentPage="currentPage"
        @add-spot="$emit('add-spot', spot)" 
        @mouseOver="$emit('hoverSpotItem', index, spot)"
        @show-link="Show"/>
        <v-pagination 
                v-if="isScrollbarShown"
                v-model="currentPage"
                :page-count="totalPages"
                :classes="bootstrapPaginationClasses"
                :labels="paginationAnchorTexts"
                style="display:flex;justify-content:center;"></v-pagination>
        <p v-if="isScrollbarShown" class="spotResults" style="text-align:center;">共搜尋到{{dataCount}}筆地點</p>
      </virtual-list>
    <modal name='link-window' resizable="true" width="90%" height="80%" ><iframe width="100%" height="100%" :src="url"></iframe></modal>
    </div>
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
      vPagination,
      'virtual-list': virtualList
    },
    data() {
      return {
        currentPage: 1,
        totalPages: 0,
        dataCount: 0,
        bootstrapPaginationClasses: {
          ul: 'pagination',
          li: 'page-item',
          liActive: 'active',
          liDisable: 'disabled',
          button: 'page-link'  
        },
        paginationAnchorTexts: {
          prev: '<',
          next: '>',
        },
        isScrollbarShown: false,
        sortBy: '',
        sortString: '臉書打卡王',
        url: ''
      }
    },
    props: {
     spots: Array,
     paginator: Object,
     perPage: Number
    },
    methods: {
      Show(Url){
        this.url = Url;
        this.$modal.show('link-window');
      }
    },
    watch: {
      spots: function() {
        if(this.spots.length > 0) this.isScrollbarShown = true;
        else{
          this.isScrollbarShown = false;
        }
      },
      paginator: function(){
        //console.log(this.paginator);
        this.totalPages = this.paginator.pageCount;
        this.currentPage = this.paginator.currentPage;
        this.dataCount = this.paginator.spotCount;
      },
      currentPage: function(newVal) {
        //console.log(this.paginator);
        this.$emit('get-spot', null, newVal);
      },
      sortBy: function(newVal) {
        // alert(this.sortBy)
        let choices = {'checkins':'臉書打卡王','ig_post_num':'IG Tag熱度','government_data':'政府推薦'}
        this.sortString = choices[newVal];
        this.$emit('sort-spot', null, 1, newVal);
      },
    },
}
</script>

<style scoped>
  .spotContainer {
    display: flex;
    flex-direction: column;
    border-left: 2px solid rgb(199, 199, 199);
    background: #F1F0F0;
    color: #515151;
    width: 500px;
    height: 90%;
  }
  .tag-container {
    display: flex;
    flex-direction: row;
  }
  /* .Result {
    font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
    color: #515151;
    margin-left: 11px;
    margin-top: 4px;
  }
  .spotResults {
    font-size: 15px;
    margin-left: 80px;
  }

  p, b-dropdown {
    display: inline-block;
  }*/

  @media only screen and (max-width: 780px) {
    .spotContainer {
      width: 100%;
      height: 85%;
    }
  } 
</style>