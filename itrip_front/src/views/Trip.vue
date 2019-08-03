<template>
  <b-container class="trip" fluid>
    <b-row class="trip-row" fluid align-h="center">
      <b-col
        class="px-0" cols="12" sm="12" md="6" lg="4" xl="4"
        :style="[($resize && !$mq.above(1025) && selected != 0 && selected != 3) ? { display: 'none' }:{ display: 'flex'}]"
      :value="selected">
        <Togos
        id="togos"
        class="togos"
        :togos="togo" :travelInfo="travelInfo" :dayNum="itinerary.dayNum" :key="update" :shareId="qviewId" :currentAccessId="currentAccessId"
        :page="page" :isLocked="isLocked" :itinerary="itinerary"
        @togos-changeOrder="updateTogos" @click-view-map="clickViewMap" @changeMode="changeMode" @resetRoutes="resetRoutes"
        @getNearby="getNearby" @deleteTogo="deleteTogo" @change-page="changePage" @zoom-togos="zoomTogos" @add-new-day="addNewDay" @remove-day="removeDay" 
        @addMember="addMember" @changeName="changeName" @changeDate="changeDate" @removeMember="removeMember"/>
      </b-col>
      <b-col 
      class="px-0 spots-col" cols="12" sm="12" md="6" lg="5" xl="5"
      :style="[($resize && !$mq.above(1025) && selected != 1 && selected != 3) ? { display: 'none' }:{ display: 'flex'}]"
      :value="selected">
        <Spots
          id="spots"
          class="spots"
          :paginator="paginator" :spots="spots" :perPage="perPage" :togos="togo" :isMapShown="isMapShown" :queryRegion="queryRegion" :queryCounty="queryCounty" :queryName="queryName"
          @filter-spot="filterSpot"
          @hoverSpotItem="hoverSpotItem"
          @add-spot="addSpotToTrip"
          @get-spot="getSpot"
          @get-nearby="getNearby"
          @sort-spot="sortSpot"
          @refresh="refresh"/> 
      </b-col>
      <b-col
      v-if="isMapShown"
      class="px-0 pl-3 map-col" order=displayOrders[2] order-md="3"
      :style="[($resize && !$mq.above(1025) && selected != 2) ? { display: 'none' }:{ display: 'block'}]"
      :value="selected" no-gutters fluid>
        <b-col class="px-0" style="height:100%;display:flex;flex-direction:column;justify-content:space-evenly;">
          <div class="big-image-container" :style="[($resize && !$mq.above(1025)) ? { display: 'none' }:{ display: 'block'}]">
            <el-carousel height="100%" :autoplay="false" trigger="click" style="height:100%;">
              <el-carousel-item v-for="(item, index) in getImages(selectedSpot)" :key="index">
                <vue-load-image  style="width:100%;height:100%;">
                  <img ref="image" class="big-image" slot="image" :src="item">
                  <img class="px-2 py-2 preloader" slot="preloader" src="../assets/image-loader.gif"/>
                  <div slot="error"><img class="px-2 py-2 picNotFound" src="../assets/picNotFound.jpg"></div>
                </vue-load-image>
              </el-carousel-item>
            </el-carousel>
          </div>
          <div class="row" style="display:flex;justify-content:center;">
            <el-checkbox-group v-model="checkList">
              <el-checkbox label="景點圖標"><i class="fas fa-map-marker-alt"> 景點圖標</i></el-checkbox>
              <el-checkbox label="路徑指示"><i class="fas fa-road"> 路徑指示</i></el-checkbox>
            </el-checkbox-group>
          </div>
          <Map 
            id="map"
            class="map"
            :key="updateMap"
            :spots="spots" :togos="togo" :routes="routes" 
            :page="page" :perPage="perPage" :spotPage="spotPage" 
            :centerSpot="centerSpot" :selectedSpot="selectedSpot" :checkList="checkList"/>
        </b-col>
      </b-col>
    </b-row>
    <b-row>
      <ItineraryPdf :togos="itinerary.togos" :travelInfos="itinerary.travelInfos"/>
    </b-row>
  </b-container>
</template>

<script>
// @ is an alias to /src
import Vue from 'vue'
import Togos from '../components/Togos'
import Spots from '../components/Spots'
import Map from '../components/Map'
import MobileHeader from '../components/layout/MobileHeader'
import ItineraryPdf from '../components/template/ItineraryPdf'
import {TravelInfo} from '../../utils/dataClass'
import {apiGetSpots, apiGetRoutes, apiSaveTrip, apiGetNearby, apiShareTrip, apiGetSharedTrip, apiUpdateShare, apiGetItinerary} from '../../utils/api'
import {makeParams} from '../../utils/area'
import VueLoadImage from 'vue-load-image'
import { Promise, async } from 'q';
import { Message } from 'element-ui';

export default {
  name: 'trip',
  components: {
      Togos,
      Spots,
      Map,
      MobileHeader,
      ItineraryPdf,
      'vue-load-image': VueLoadImage
  },
  props: {
    param: Object,
  },
  data() {
    return {
      spots: [],
      routes: {},
      showSpots: true,
      // unused params
      Region: '',
      Type: '',
      Open: '>',
      Close: '<',
      page: 0,
      spotPage: 1,
      perPage: 10,
      changedElementValue: null,
      paginator: {},
      centerSpot: {},
      selected: 3,
      isMapShown: true,
      paramProp: '',
      selectedSpot: 0,
      update: 0,
      itinerary: {},
      updateMap:0,
      windowWidth: 0,
      tripName: '',
      tripDate: '',
      // query parameters
      qplace: this.$route.query.qplace,
      qname: this.$route.query.qname,
      qspot: this.$route.query.qspot,
      qid: this.$route.query.qid,
      qviewId: this.$route.query.viewId,
      qcurrentAccessId: this.$route.query.currentAccessId,
      qitineraryId: this.$route.query.itineraryId,
      qresult: null,
      qadded: false,
      updateMap: 0,
      checkList: ['景點圖標', '路徑指示'],
      queryCounty: '',
      queryRegion: [],
      queryName: '',
      isAddSpotLocked: false,
      currentAccessId:'',
      isLocked: false,
    }
  },
  methods: {
    editOn: function(){
      this.$emit("edit-on")
    },
    addSpotToTrip(spot) {
      if(!this.isAddSpotLocked) {
        if (this.itinerary.togos[this.page] === undefined){
          this.$set(this.itinerary.togos, this.page, []);
        }
        spot.stopTime = {
          hrs: 1,
          mins: 0
        }
        this.itinerary.togos[this.page].push(spot);
        let length = this.itinerary.togos[this.page].length;
        // only need to get travelInfo if length > 2
        if(length > 1) {
          this.addTravelInfo(this.itinerary.togos[this.page][length - 2], spot);
        }
        if(window.innerWidth <= 768) {
            this.$bus.$emit('toggle', {id: 'Togos'});
        }
        this.isAddSpotLocked = true;
        //this.$set(this.itinerary, 'togos', this.togos);
        //this.$set(this.itinerary, 'travelInfos', this.travelInfos);
      }
    },
    addTravelInfo(startOb, destOb) {
      // initialize travelInfos
      if(this.itinerary.travelInfos[this.page] === undefined) {
        this.$set(this.itinerary.travelInfos, this.page, []);
      }
      // call get routes api
      this.callGetRoutesApi(this.itinerary.travelInfos[this.page].length, startOb, destOb, 'driving-car');
    },
    deleteTogo(index) {
      if(this.itinerary.travelInfos[this.page] != undefined) {
        this.fixTravelInfo(index);
      }
      this.itinerary.togos[this.page].splice(index, 1);
    },
    fixTravelInfo(index) {
      if(index == 0) {
        this.itinerary.travelInfos[this.page].shift();
      }
      else if(index == this.itinerary.togos[this.page].length - 1) {
        this.itinerary.travelInfos[this.page].pop();
      }
      else {
        // get start and dest object
        let start = this.itinerary.togos[this.page][index - 1];
        let dest = this.itinerary.togos[this.page][index + 1];
        this.callGetRoutesApi(index - 1, start, dest, this.itinerary.travelInfos[this.page][index - 1].mode);
        this.itinerary.travelInfos[this.page].splice(index, 1);
        // reset routes
      }
      this.resetRoutes();
    },
    resetRoutes: function() {
      if(this.itinerary.travelInfos[this.page] !== undefined) {
        let length = this.itinerary.travelInfos[this.page].length;
        if(length > 0) {
          let tmp = [];
          for(let i=0;i<length;i++) {
            tmp = tmp.concat((this.itinerary.travelInfos[this.page][i]).routes);
          };
          this.$set(this.routes, this.page, {
            routes: tmp,
            color: "#FF0000"
          });
        }
        else {
          this.routes = {};
        }
      }
    },
    addNewDay() {
      this.itinerary.togos.push([]);
      this.$set(this.itinerary, 'dayNum', this.itinerary.dayNum + 1);
    },
    removeDay(index) {
      this.itinerary.togos.splice(index, 1);
      this.$set(this.itinerary, 'dayNum', this.itinerary.dayNum - 1);
    },
    changePage(p) {
      this.page = p;
    },
    // saveTrip(name, date, memberId) {
    //   // itinerary format:
    //   //{_id: Number, memberId: Number, startDate: {year: Number, month: Number, day: Number}, name: String, dayNum: Number, togos: Array, travelInfos: Array}
    //   //memberId, startDate, name, dayNum, togos, travelInfos
    //   let token = this.$store.state.userToken;
    //   let _id = "";
    //   if (this.itinerary._id != undefined && typeof(this.itinerary._id) !== Object){
    //     _id = this.itinerary._id;
    //   }
    //   let self = this;
    //   // console.log("itinerary", this.itinerary);
    //   // console.log("_id", _id);
    //   apiSaveTrip(_id, date, name, this.togos.length, this.baseTimes, this.togos, this.travelInfos, memberId, token)
    //   .then((function (res) {
    //     self.itinerary = Object.assign({}, self.itinerary, res.data.data);
    //     //console.log(self.itinerary)
    //     self.$message.success('行程儲存成功!');
    //     self.$router.push('/trip/?currentAccessId=' + self.$route.query.currentAccessId + '&itineraryId=' + self.itinerary._id);
    //   }))
    //   .catch(function (error) {
    //     console.log(error);
    //   });
    //   // this.$socket.emit('SEND_MESSAGE', {
    //   //     togos: self.togos
    //   // });
    // },
    // share(name, date) {
    //   if(this.togos[0] === undefined) {
    //     this.$message.warning('你還沒排行程!');
    //     return;
    //   }
    //   let self = this;
    //   apiShareTrip(date, name, this.togos.length, this.togos, this.travelInfos)
    //   .then((function (res) {
    //     self.qviewId = res.data.data;
    //   }))
    //   .catch(function (error) {
    //     console.log(error);
    //   });
    // },
    // updateShare(id, name, date) {
    //   let self = this;
    //   apiUpdateShare(id, date, name, this.togos.length, this.togos, this.travelInfos)
    //   .then((function (res) {
    //     console.log(res);
    //   }))
    //   .catch(function (error) {
    //     console.log(error);
    //   });
    // },
    getSharedTrip(id) {
      let self = this;
      apiGetSharedTrip(id)
      .then((function (res) {
        console.log("res", res);
        self.itinerary = Object.assign({}, res.data.data[0]);
      }))
      .catch(function (error) {
        console.log(error);
      });
    },
    addMember(memberId) {
      let memberIds = this.itinerary.memberIds;
      if(!memberIds.includes(memberId)) {
        memberIds.push(memberId);
      }
      this.$set(this.itinerary, 'memberIds', memberIds);
      this.$message.success('旅伴新增成功!');
    },
    removeMember(mailToRemove) {
      let tmp = this.itinerary.memberIds;
      for(let i=0;i<tmp.length;i++) {
        if(mailToRemove === tmp[i]) {
          tmp.splice(i, 1);
        }
      }
      this.$set(this.itinerary, 'memberIds', tmp);
      this.$message.success('旅伴刪除成功!');
    },
    changeName(name) {
      this.$set(this.itinerary, 'name', name);
    },
    changeDate(date) {
      let ob = this.undoDateOb(date);
      this.$set(this.itinerary, 'startDate', ob);
    },
    // Map
    reverseCoordinates: function(tmpCoordinates) {
      for (let i = 0; i < tmpCoordinates.length; i++) {
        // 反轉經緯度 for leaflet
        let tmp = tmpCoordinates[i][1];
        tmpCoordinates[i][1] = tmpCoordinates[i][0];
        tmpCoordinates[i][0] = tmp;
      }
    },
    hoverSpotItem: function(index, spot) {
      if(this.checkList.includes('景點圖標')) {
        this.centerSpot = Object.assign({}, spot);;
        this.$set(this.centerSpot, 'zoom', 12);
        this.$set(this.centerSpot, 'index', index);
      }
      else {
        if(this.itinerary.togos[0] !== undefined) {
          this.centerSpot = this.itinerary.togos[0];  
        }
        else {
          this.centerSpot = this.itinerary.spots[0];
        }
        
      }
      if(index != null) {
        this.selectedSpot = index;
      }  
    },
    zoomTogos: function() {
      this.centerSpot = this.itinerary.togos[this.page][0];
      this.$set( this.centerSpot, 'type', 'togos');
      this.$set( this.centerSpot, 'zoom', 10);
    },
    clickViewMap: function() {
      this.isMapShown = !this.isMapShown;
    },
    // Spots
    getNearby: function(spot, page) {
      if(spot !== null) {
          let data = {
            id: spot._id,
            distance: 10000,
            limit: 10,
            order: -1,
            sortBy: 'ig_post_num',
            page: 1
          }
          this.paramProp = data;
      }
      else {
        this.paramProp.page = page;
      }
    },
    getImages: function(index) {
      if(this.spots[index] !== undefined && Object.keys(this.spots[index]).includes('images')) {
        return this.spots[index].images;
      }
      else {
        return ['111'];
      }
    },
    sortSpot: function(sortBy) {
      this.$set( this.paramProp, 'page', 1);
      this.$set( this.paramProp, 'sortBy', sortBy);
    },
    getSpot: function(page) {
      this.$set( this.paramProp, 'page', page);
    },
    filterSpot: function(checkedCategories) {
      this.$set(this.paramProp, 'categories', checkedCategories);
    },
    
    // api
    // Togos api
    callGetRoutesApi: async function(index, startOb, destOb, mode) {
      let self = this;
      //console.log(start, dest);
      let coordinates = [[startOb.location.coordinates[0], startOb.location.coordinates[1]],
                        [destOb.location.coordinates[0], destOb.location.coordinates[1]]];
      let data = {
        'coordinates': coordinates 
      };
      // call get routes api
      await apiGetRoutes(data, mode)
      .then(function (res) {
        let tmpCoordinates = res.data.features[0].geometry.coordinates;
        // reverse coordinates because leaflet uses inverted coordinates
        self.reverseCoordinates(tmpCoordinates);
        // assign routes to draw polyLine
        let routes = tmpCoordinates;
        // Travel time
        let tmp = res.data.features[0].properties.segments[0];
        let duration = tmp.duration;
        let distance = tmp.distance;
        let start = startOb.name;
        let dest = destOb.name;
        let travelInfo = new TravelInfo(start, dest, mode, duration, distance, routes);
        self.$set(self.itinerary.travelInfos[self.page], index, travelInfo);
        // reset routes
        self.resetRoutes();
      })
      .catch(function (error) {
        //console.log(error);
      })
      .then(function () {
        // always executed
      });
    },
    changeMode(index, mode) {
      this.callGetRoutesApi(index, this.itinerary.togos[this.page][index], this.itinerary.togos[this.page][index + 1], mode);
    },
    updateTogos(arr, oldIndex, newIndex){
      this.itinerary.togos[this.page] = arr;
      //console.log(oldIndex, newIndex);
      let length = this.itinerary.togos[this.page].length;
      //update old
      for(let i=newIndex-1;i<=newIndex;i++) {
        if(i < 0 || i == length) continue;
        let startOb = this.itinerary.togos[this.page][i];
        let destOb = this.itinerary.togos[this.page][i + 1];
        this.callGetRoutesApi(i, startOb, destOb, this.itinerary.travelInfos[this.page][i].mode);
      }
      //update new
      for(let i=oldIndex-1;i<=oldIndex;i++) {
        if(i == newIndex || i < 0 || i == length) continue;
        let startOb = this.itinerary.togos[this.page][i];
        let destOb = this.itinerary.togos[this.page][i + 1];
        this.callGetRoutesApi(i, startOb, destOb, this.itinerary.travelInfos[this.page][i].mode);
      }
    },
    // Spots api
    callGetSpotApi: function(data=null, byQuery=false) {
      let self = this;
      if(data == null) {
        data=this.paramProp;
      }
      self.spotPage = data.page;
      
      // call get spots api
      apiGetSpots(data)
      .then(function (res) {
        self.spots = res.data.data.resultList;
        if(self.spots.length == 0) {
          return;
        }
        self.paginator = res.data.data.paginator;
        if (byQuery) self.qresult = res.data.data.resultList;
      })
      .catch(function (error) {
        console.log(error);
      })
      .then(function () {
        // always executed
      });
    },
    callNearbyApi: function(data=null) {
      let self = this;
      if(data == null) data=this.paramProp;
      self.spotPage = data.page;
      // call get nearby api
      apiGetNearby(data)
      .then(function (res) {
        let tmp = res.data.data;
        self.spots = res.data.data.resultList;
        self.paginator = {
          "nearby": true,
          "spotCount": tmp["spotCount"],
          "perPage": tmp["perPage"],
          "currentPage": tmp["currentPage"],
          "pageCount": tmp["pageCount"],
          "slNo": tmp["slNo"],
          "hasPrevPage": tmp["hasPrevPage"],
          "hasNextPage": tmp["hasNextPage"],
          "prev": tmp["prev"],
          "next": tmp["next"]
        }
      })
      .catch(function (error) {
        console.log(error);
      })
      .then(function () {
        // always executed
      });
    },
    // Other
    toggle: function(toggle) {
      let components = ['Togos', 'Spots', 'Map', 'Togos/Spots'];
      for(let i=0;i<components.length;i++) {
        if(toggle == components[i]) {
          this.selected = i;
        }
      }
    },
    refresh: function() {
      if(Object.keys(this.paramProp).includes('distance')) {
        this.callNearbyApi();
      }
      else {
        this.callGetSpotApi();
      }
    },
    handleResize() {
      this.windowWidth = window.innerWidth;
    },
    callGetItinerary: async function() {
      //console.log(this.qcurrentAccessId, this.qitineraryId);
      let token = this.$store.state.userToken;
      //console.log(token)
      let self = this;
      await apiGetItinerary(this.qitineraryId, this.qcurrentAccessId, token)
      .then((function (res) {
        console.log(res.data)
        self.itinerary = res.data.data;
        self.currentAccessId = self.qcurrentAccessId;
      }))
      .catch(function (error) {
        console.log(error);
      });
    },
    undoDateOb(s) {
      let ob = {
        year: s.getFullYear(),
        month: s.getMonth() + 1,
        day: s.getDate()
      }
      return ob;
    }
  },
  computed: {
    togo: function() {
      if(this.itinerary.togos === undefined) {
        return []
      }
      return this.itinerary.togos[this.page];
    },
    travelInfo: function() {
      if(this.itinerary.travelInfos === undefined) {
        return []
      }
      return this.itinerary.travelInfos[this.page];
    }
  },
  watch: {
    param: function(newVal) {
      this.paramProp = newVal;
    },
    paramProp: {
      handler: function(newVal, oldVal) {
        console.log(newVal);
        if(newVal.city) this.queryCounty = newVal.city;
        else this.queryCounty = null;

        if(newVal.region) this.queryRegion = newVal.region;
        else this.queryRegion = null;

        if(newVal.name) this.queryName = newVal.name;
        else this.queryName = name;

        if(Object.keys(newVal).includes('distance')) {
          this.callNearbyApi(newVal);
        }
        else {
          this.callGetSpotApi(newVal);
        }
      },
      deep: true,
    },
    // Push changes every update
    itinerary: {
      handler: function(newVal, oldVal){
        console.log(newVal)
        if(this.itinerary.memberIds.length === 0) {
          this.$socket.emit('updateItinerary', {itinerary: newVal});
        }
        else {
          this.$socket.emit('updateItinerary', {itinerary: newVal, memberId: this.$store.state.user.id});
        }
      },
      deep: true
    },
    selectedSpot: function(newVal, oldVal) {
      this.updateMap++;
    },
    qresult: function(newVal) {
      if (newVal  && !this.qadded) {
        for(var i = 0; i < newVal.length; i++){
          if (newVal[i]._id == this.qid)
            this.addSpotToTrip(newVal[i])
            this.qadded = true;
        }
      }
    },
    isAddSpotLocked: function(newVal, oldVal) {
      if(newVal) {
        setTimeout(() => {
            this.isAddSpotLocked = false
        },2000)
      }
    },
    windowWidth: function(newVal, oldVal) {
      if(newVal <= 768 && this.selected == 3) {
        this.selected = 1;
      }
      if(newVal > 768 && newVal <= 1024 && (this.selected == 1 || this.selected == 0)) {
        this.selected = 3;
      }
    },
    isLocked: function(newVal) {
      if(newVal) this.$emit('is-locked-on');
    }
  },
  created () {
    // [註冊監聽事件]
    // context
    let self = this;
    this.$bus.$on('toggle', event => {
      this.toggle(event.id);
    });
    this.$bus.$on('modifyItinerary', event => {
      self.itinerary = event.itinerary;
      self.currentAccessId = event.currentAccessId;
      self.isLocked = event.isLocked;
    });
    this.$bus.$on('createTrip', event => {
      self.itinerary = Object.assign({}, event.itinerary);
      //console.log(self.itinerary)
    });
    
    if (this.qname !== undefined){
      this.callGetSpotApi(makeParams(null, null, null, this.qname));
    } 
    if (this.qplace !== undefined) {
      this.callGetSpotApi(makeParams(this.qplace));
    }
    if (this.qspot !== undefined && this.qid !== undefined) {
      alert(this.qspot + ", " + this.qid)
      this.qresult = this.callGetSpotApi(makeParams(null, null, null, this.qspot), true);
    }
    window.addEventListener('resize', this.handleResize);
    this.handleResize();
    
  },
  beforeMount() {
    if(this.qviewId !== undefined) {
      this.getSharedTrip(this.qviewId);
      //this.qviewId = 0;
    }
    if(this.qcurrentAccessId !== undefined && this.qitineraryId !== undefined) {
      this.callGetItinerary();
    }
  },
  mounted() {
    let self = this;
    let data = {
      limit: 10,
      order: -1,
      page: 1,
      sortBy: 'ig_post_num'
    };
    //this.isLocked = true; //modetest
    // console.log(this.itinerary)
    // for (let i=0;i<this.itinerary.togos.length;i++){
    //   if(self.itinerary.travelInfos[i] !== undefined) {
    //     self.$set(self.routes, i, self.itinerary.travelInfos[i].routes);
    //   }
    // };
    // listen to update itinerary
    this.$socket.on('updateNotification', (itineraryOb) => {
      self.itinerary = Object.assign({}, itineraryOb);
      console.log('being notified...')
    })

    if (this.qname !== undefined) {
      this.callGetSpotApi(makeParams(null, null, null, this.qname));
    } else if (this.qplace !== undefined) {
      this.callGetSpotApi(makeParams(null, this.qplace, null, null));
    } else if (this.qspot !== undefined && this.qid !== undefined) {
      alert(this.qspot + ", " + this.qid)
      this.qresult = this.callGetSpotApi(makeParams(null, null, null, this.qspot), true)
    } else {
      this.paramProp = data;
    }
    let token = this.$store.state.userToken
  },
  beforeDestroy: function() {
    // [銷毀監聽事件]
    this.$bus.$off('toggle');
    this.$bus.$off('modifyItinerary');
    this.$bus.$off('createTrip');
  },
  destroy: function() {
    window.removeEventListener('resize', this.handleResize);
  }
}
</script>

<style scoped>
  .trip {
    height: 90vh;
    overflow: hidden;
    background: rgb(250,250,250);
  }
  .map-col {
    height: 90vh;
    border-width: 3px;
    border-style: solid;
    border-image: linear-gradient( to bottom, rgb(255, 255, 255), rgb(206, 206, 206), rgb(222, 222, 222), rgb(235, 235, 235)) 1 100%;
  }
  .big-image-container {
    padding-top: 40px;
    padding-bottom: 40px;
    background: #f2f2f2;
    height: 45%;
    width: 100%;
  }
  .big-image {
    width: 100%;
    height: 100%;
  }
  .preloader {
    width: 100%;
    height: 100%;
  }
  .picNotFound {
    width: 100%;
    height: auto;
  }
@media screen and (max-width: 768px) {
  .trip {
    -webkit-overflow-scrolling: touch;
    overflow-x: auto;
    padding-left: 0px;
    padding-right: 0px;
  }
  .trip-row {
    display: flex;
    flex-direction: row;
    flex-wrap: nowrap;
    margin-left: 0px;
    margin-right: 0px;
  }
}
@media screen and (min-width: 1280px) {
  .trip {
    padding-left: 50px;
    padding-right: 50px;
  }
}
@media screen and (min-width: 2560px) {
  .trip {
    padding-left: 400px;
    padding-right: 400px;
  }
}
</style>
<style>
  /* custom scroll bar */
  ::-webkit-scrollbar {
    width: 5px;
  }

  /* Track */
  ::-webkit-scrollbar-track {
    background: #fff; 
  }

  /* Handle */
  ::-webkit-scrollbar-thumb {
    background: #888; 
    border-radius: 2.5px;
    width: 10%;
  }

  /* Handle on hover */
  ::-webkit-scrollbar-thumb:hover {
    background: rgb(117, 117, 117); 
  }
</style>
