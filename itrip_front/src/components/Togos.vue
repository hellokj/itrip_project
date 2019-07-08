<template>
  <div class="MyTrip">
    <div class="tripData  mx-0 my-0 px-0 py-0">
      <div class="tripName">
        <p class="pTripName  mx-0 my-0 px-0 py-0">旅行名稱</p>
        <input class="inputTripName" type="text" placeholder="我的旅行">
      </div>
      <div class="tripDate">
        <p class="pTripDate  mx-0 my-0 px-0 py-0">開始日期</p>
        <input class="inputTripDate" type="date">
      </div>
      
    </div>
    <div>
        <button class="btn-save" @click="saveTrip">儲存</button>
    </div>
    <div>
      <b-tabs content-class="mt-3" @input="changePage()" v-model="page">
        <b-tab class="my-0 mx-0" title="第一天" active>
          <div class="togoContainer" :key="togo.id" v-for="togo in togos[page]" overflow:auto>
            <!-- TogoItem -->
            <TogoItem class="mx-0 my-0" :togo="togo" v-on:del-togo="$emit('del-togo', togo._id)"/>
            <!-- Travel time -->
            <TravelTimeItem class="mx-0 my-0" :togo="togo" v-if="isTravelTimeShown(togo.index)"/>
          
          </div>
        </b-tab>

        <!-- other days -->
        <b-tab class="my-0 mx-0" title="第二天">
          <div class="togoContainer" v-bind:key="togo.id" v-for="togo in togos[1]" overflow:auto>
            <!-- TogoItem -->
            <TogoItem class="mx-0 my-0" v-bind:togo="togo" v-on:del-togo="$emit('del-togo', togo._id)"/>
          </div>
        </b-tab>
        <b-tab title="新增" disabled>
          <p>I'm a disabled tab!</p>
        </b-tab>
      </b-tabs>
    </div>
  </div>
</template>

<script>
import TogoItem from './TogoItem';
import TravelTimeItem from './TravelTimeItem';

export default {
    name: "Togos",
    data() {
      return {
        trips: [],
        tabtitle: '',
        page: 0,
      }
    },
    components: {
        TogoItem,
        TravelTimeItem
    },
    props: ["togos"],
    methods: {
      saveTrip() {
        for (var i = 0; i < this.togos.length; i++){
          alert(i);
        }
          
      },
      changePage(){
        alert(this.page);
        this.$emit('change-page', this.page);
      },
      isTravelTimeShown(index) {
        if(index < this.togos[this.page].length-1) {
          return true;
        }
        return false;
      }
    }
}
</script>

<style scoped>

  .MyTrip {
    margin: 0px;
    padding: 0px;
    width: 365px;
    border: none;
    /* background: #F1F0F0; */
    background: #F1F0F0;
    color: #515151;
    display: flex;
    flex-direction: column;
    justify-content: flex-start;
    align-items: flex-start;
  }

  .tripData {
    background: #F1F0F0;
  }

  .tripName, .tripDate {
    margin-left: 11px;
    margin-top: 4px;
    display: flex;
    flex-direction: row;
    font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
    font-size: 16px;
    
  }
  .inputTripName, .inputTripDate {
    margin: 0;
    width: 200px;
    height: 20px;
    border: none;
    border-bottom: 1px solid #707070;

    text-align: center;
    outline: none;
    background: #F1F0F0;
    
  }


  b-tabs {
    color: #707070;
    font-size: 20px;
    border: none;
    background: #333555;
  }

  .btn-save {
    border: none;
    background: #515151;
    color: white;
  }
</style>