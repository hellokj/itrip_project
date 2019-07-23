<template>
  <div class="spotContainer">
    <div class="tag-container">
      <p class="mx-4 pt-3">搜尋結果 排序:</p>
      <b-dropdown size="sm" class="m-2" v-model="sortBy">
          <template slot="button-content">&#x1f50d;<span class="sr-only">Search</span>{{sortString}}</template>
          <b-dropdown-item-button @click="sortBy='ig_post_num'"><i class="fab fa-instagram"></i>  IG Tag熱度</b-dropdown-item-button>
          <b-dropdown-item-button @click="sortBy='checkins'" ><i class="fab fa-facebook-square"></i>  臉書打卡王</b-dropdown-item-button>
      </b-dropdown>
    </div>
    
    <div class="vld-parent result-container">
      <virtual-list :size="165" :remain="5" @change="showLoading">
        <loading :active.sync="isLoading" 
        :is-full-page="false"></loading>
        <SpotItem :key="spot._id" v-for="(spot, index) in spots" 
          :spot="spot" :index="index" :perPage="perPage" :currentPage="currentPage" :togos="togos" :sortBy="sortBy"
          @add-spot="$emit('add-spot', spot)" 
          @mouseOver="$emit('hoverSpotItem', index, spot)"
          @mouseOut="$emit('hoverSpotItem', null, spot)"
          @show-link="Show"
          @edit-form="EditSpot"/>
        <v-pagination 
                v-if="isScrollbarShown"
                v-model="currentPage"
                :page-count="totalPages"
                :classes="bootstrapPaginationClasses"
                :labels="paginationAnchorTexts"
                style="display:flex;justify-content:center;"></v-pagination>
        <p v-if="isScrollbarShown" class="spotResults" style="text-align:center;">我們幫您找到了{{dataCount}}筆地點</p>
      </virtual-list>
    <modal name='link-window' :resizable="true" width="90%" height="80%" ><iframe width="100%" height="100%" :src="url"></iframe></modal>
    <b-modal id='edit-form' ref="edit-spot-modal" title="編輯景點資料" width="40%" height="40%"><EditSpotModal :spot="selectedSpot"/></b-modal>
    </div>
  </div>
</template>

<script>
import SpotItem from './SpotItem'
import virtualList from 'vue-virtual-scroll-list'
import vPagination from 'vue-plain-pagination'
import VueLoading from 'vue-loading-overlay';
import EditSpotModal from './template/EditSpotModal'
import 'vue-loading-overlay/dist/vue-loading.css';

export default {
    name: "Spots",
    components: {
      SpotItem,
      vPagination,
      'virtual-list': virtualList,
      loading: VueLoading,
      EditSpotModal
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
        sortBy: 'ig_post_num',
        sortString: 'IG Tag熱度',
        url: '',
        isLoading: false,
        selectedSpot: {},
      }
    },
    props: {
     spots: Array,
     paginator: Object,
     perPage: Number,
     togos: Array,
    },
    methods: {
      Show(Url){
        this.url = Url;
        this.$modal.show('link-window');
      },
      EditSpot(spot) {
        this.selectedSpot = spot;
        this.$refs['edit-spot-modal'].show()
      },
      showLoading(){
        this.isLoading = true;
        setTimeout(() => {
            this.isLoading = false
        },2000)
      },
    },
    watch: {
      spots: function() {
        if(this.spots.length > 0) this.isScrollbarShown = true;
        else{
          this.isScrollbarShown = false;
        }
      },
      paginator: function(){
        this.totalPages = this.paginator.pageCount;
        this.currentPage = this.paginator.currentPage;
        this.dataCount = this.paginator.spotCount;
        this.showLoading();
      },
      currentPage: function(newVal) {
        if(Object.keys(this.paginator).includes('nearby')) {
          this.$emit('get-nearby',  newVal);
          return;
        }
        this.$emit('get-spot', newVal);
      },
      sortBy: function(newVal) {
        // alert(this.sortBy)
        let choices = {'checkins':'臉書打卡王','ig_post_num':'IG Tag熱度'}
        this.sortString = choices[newVal];
        this.$emit('sort-spot', newVal);
      },
    },
}
</script>

<style scoped>
  .spotContainer {
    display: flex;
    flex-direction: column;
    border-right: 1px solid rgb(230, 230, 230);
    border-left: 1px solid rgb(230, 230, 230);
    background: rgb(250,250,250);
    color: black;
    height: 90%;
    margin: 10px;
    width: 100%;
  }
  .tag-container {
    display: flex;
    flex-direction: row;
  }
  .view-map {
    height: 40px;
    align-self: flex-end;
    margin-right: 10px;
  }
  .space {
    display: flex;
    flex: 1;
  }
  @media only screen and (max-width: 768px) {
    .spotContainer {
      width: 100%;
      height: 85%;
      margin: 0px;
    }
    .tag-container {
      flex-wrap: wrap;
      justify-content: center;
    }
  } 
</style>