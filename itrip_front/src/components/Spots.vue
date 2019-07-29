<template>
  <div class="spotContainer">
    <div class="tag-container" style="display:flex;flex-direction:column;">
      <div class="sort-container" style="display:flex;flex-direction:row;justify-content:space-between;">
        <div style="display:flex;flex-direction:row;">
          <p class="ml-4 my-0" style="line-height:40px;">搜尋:    <b style="font-size:18px;">{{getQuery}}</b></p>
          
        </div>
        <div style="display:flex;flex-direction:row;">
          <p class="ml-4 my-0" style="line-height:40px;"> 排序:</p>
          <b-dropdown size="sm" class="m-2" v-model="sortBy" style="height:30px;padding-right:10px;">
              <template slot="button-content">&#x1f50d;<span class="sr-only">Search</span>{{sortString}}</template>
              <b-dropdown-item-button @click="sortBy='ig_post_num'"><i class="fab fa-instagram"></i>  IG Tag熱度</b-dropdown-item-button>
              <b-dropdown-item-button @click="sortBy='checkins'" ><i class="fab fa-facebook-square"></i>  臉書打卡王</b-dropdown-item-button>
          </b-dropdown>  
        </div>
      </div>
      <div class="ml-4 category-container" style="display:flex;flex-direction:column;">
        <el-checkbox :indeterminate="isIndeterminate" v-model="checkAll" @change="handleAllCategoryListChange" style="width:30px;">All</el-checkbox>
        <el-checkbox-group v-model="checkedCategories" @change="handleCheckedCategoryListChange">
          <el-checkbox v-for="(cat, index) in categories" :label="cat" :key="cat"><i :class="categoryIcons[index]"></i> {{cat}}</el-checkbox>
        </el-checkbox-group>
      </div>
    </div>
    
    <div class="vld-parent result-container">
      <div v-if="isResultNotFound" class="notFound" style="height:50%;display:flex;flex-direction:column;justify-content:center;">
        <i class="fas fa-kiwi-bird" style="font-size:50px;text-align:center;">....</i>
        <p style="font-size: 30px;text-align: center;">抱歉，沒有結果!</p>
        </div>
        <div style="width: 100%; height: 70vh; overflow-y: scroll;" ref="spotslist">
      <!-- <virtual-list :size="165" :remain="5" @change="showLoading" ref="list"> -->
        <loading :active.sync="isLoading" 
        :is-full-page="false"></loading>
        <SpotItem :key="spot._id" v-for="(spot, index) in spots" 
          :spot="spot" :index="index" :perPage="perPage" :currentPage="currentPage" :sortBy="sortBy" :isInTogos="isInTogos(spot._id)"
          @add-spot="$emit('add-spot', spot)" 
          @mouseOver="$emit('hoverSpotItem', index, spot)"
          @mouseOut="$emit('hoverSpotItem', null, spot)"
          @show-link="Show"
          @edit-form="EditSpot"
          @is-in-togos="isInTogos"/>
        <v-pagination 
                v-if="isScrollbarShown"
                v-model="currentPage"
                :page-count="totalPages"
                :classes="bootstrapPaginationClasses"
                :labels="paginationAnchorTexts"
                style="display:flex;justify-content:center;"></v-pagination>
        <p v-if="isScrollbarShown" class="spotResults" style="text-align:center;">我們幫您找到了{{dataCount}}筆地點</p>
      <!-- </virtual-list> -->
      </div>
    <modal name='link-window' :resizable="true" width="90%" height="80%" ><iframe width="100%" height="100%" :src="url"></iframe></modal>
    <modal name='edit-form' ref="edit-spot-modal" :resizable="true" width="45%" height="580px"><EditSpotModal :spot="selectedSpot" @close="closeModal" 
    @refresh="$emit('refresh', null)"/></modal>
    </div>
  </div>
</template>

<script>
import SpotItem from './SpotItem'
import virtualList from 'vue-virtual-scroll-list'
import vPagination from 'vue-plain-pagination'
import VueLoading from 'vue-loading-overlay'
import EditSpotModal from './template/EditSpotModal'
import 'vue-loading-overlay/dist/vue-loading.css'
import {types} from '../../utils/area.js'

const categoryList = ['美食','購物', '景點', '交通', '住宿', '娛樂'];
const categoryIcons = ['fas fa-utensils', 'fas fa-shopping-bag', 'fas fa-binoculars', 'fas fa-bus-alt', 'fas fa-hotel', 'fas fa-glass-martini-alt'];

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
        isIndeterminate: true,
        checkAll: false,
        checkedCategories: categoryList,
        categories: categoryList,
        categoryIcons: categoryIcons,
        isResultNotFound: false,
      }
    },
    props: {
     spots: Array,
     paginator: Object,
     perPage: Number,
     togos: Array,
     queryPlace: String,
     queryName: String,
    },
    methods: {
      Show(Url){
        this.url = Url;
        this.$modal.show('link-window');
      },
      EditSpot(spot) {
        this.selectedSpot = spot;
        this.$modal.show('edit-form');
      },
      closeModal(name) {
        this.$modal.hide(name);
      },
      showLoading(){
        this.isLoading = true;
        setTimeout(() => {
            this.isLoading = false
        },2000)
      },
      isInTogos(_id) {
        if(this.togos === undefined) return false;
        let tmpArr = this.togos.filter(function(togo) {
          return togo._id === _id;
        })
        if(tmpArr.length > 0) return true;
        return false;
      },
      handleAllCategoryListChange(val) {
        this.checkedCategories = val ? categoryList : [];
        this.isIndeterminate = false;
      },
      handleCheckedCategoryListChange(value) {
        let checkedCount = value.length;
        this.checkAll = checkedCount === this.categories.length;
        this.isIndeterminate = checkedCount > 0 && checkedCount < this.categories.length;
      },
    },
    computed: {
      getQuery: function() {
        //console.log(this.queryName, this.queryPlace);
        if(this.queryName !== '') return this.queryName;
        if(this.queryPlace !== '') return this.queryPlace;
        return '全部';
      }
    },
    watch: {
      spots: function() {
        if(this.spots.length > 0) {
          this.isScrollbarShown = true;
          this.isResultNotFound = false;
        } 
        else{
          this.isScrollbarShown = false;
          this.isResultNotFound = true;
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
          this.$emit('get-nearby', null, newVal);
          return;
        }
        this.$emit('get-spot', newVal);
        var elem = this.$refs["spotslist"];
        elem.scrollTo({
          top: 0,
          left: 0,
          behavior: "smooth",
        });
      },
      sortBy: function(newVal) {
        // alert(this.sortBy)
        let choices = {'checkins':'臉書打卡王','ig_post_num':'IG Tag熱度'}
        this.sortString = choices[newVal];
        this.$emit('sort-spot', newVal);
      },
      checkedCategories: function(newVal) {
        let catArr = [];
        for(let i=0;i<newVal.length;i++) {
          catArr.push(types[newVal[i]]);
        }
        this.$emit('filter-spot', catArr);
      }
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
    height: 90vh;
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