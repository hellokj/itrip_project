<template>
    <div class="togo-item px-0 py-0">
        <b-container>
            <b-row>
                <b-col class="mr-2 mt-1 pl-0 py-0" cols="3">
                    <img class="ml-0 my-0 px-0 py-0 spot-picture" :src="togo.images[0]" alt="Picture">
                </b-col>
                <b-col class="ml-0 my-0 px-0 py-0">
                    <b-row class="ml-3 my-0 px-0 py-0" align-h="start">
                        <b-col cols="9" class="ml-0 my-0 px-0 py-0">
                            <p class="mx-0 my-0 px-0 py-0 p-name"><b>{{togo.name}}</b></p>
                        </b-col>
                        <b-col cols="1" class="ml-4 my-2 pt-0 mb-3 mr-0 pl-0 pr-0">
                            <i class="fas fa-times" @click="$emit('deleteTogo', togo.index)"></i>
                        </b-col>
                    </b-row>
                    <b-row class="ml-3 my-0 px-0 py-0" align-h="start">
                        <p class="mx-0 my-0 px-0 py-0 address">{{getAddress()}}</p>
                    </b-row>
                    <b-row class="ml-0 mb-0 px-0 pt-3" align-h="start">
                       <b-col><p class="mx-0 my-0 px-0 py-0 stopTime">停留時間</p></b-col>
                    </b-row>
                    <b-row v-if="editMode" class="ml-0 my-0 px-0 pt-0">
                        <b-row class="ml-0 my-0 px-0 pt-0"> 
                            <b-col cols="2" class="ml-3 my-0 px-0 py-0">
                                <el-input-number class="hrInput" v-model="hrs" :step="1" size="mini"></el-input-number>
                            </b-col>
                            <b-col cols="2" class="ml-4 my-0 pl-2 py-0 mr-0 pr-0">
                                <p>小時</p>
                            </b-col>
                            <b-col cols="2" class="ml-0 my-0 px-0 py-0">
                                <el-input-number class="minInput" v-model="mins" :step="1" size="mini"></el-input-number>
                            </b-col>
                            <b-col cols="1" class="ml-3 my-0 pl-3 py-0">
                                <p>分</p>
                            </b-col>
                        </b-row>
                    </b-row>
                    <b-row v-if="!editMode" class="ml-0 my-0 px-0 pt-0">
                        <b-col cols="2" class="ml-4 my-0 pl-2 py-0 mr-0 pr-0">
                            {{hrs}}小時
                        </b-col>
                        <b-col cols="2" class="ml-0 my-0 pr-0 py-0">
                            {{mins}}分
                        </b-col>
                    </b-row>
                </b-col>
            </b-row>
        </b-container>
    </div>
</template>

<script>
import {getAddress} from '../../utils/checker.js'
export default {
    name: "TogoItem",
    props: {
        togo: Object,
    },
    data() {
        return {
            hrs: this.togo.stopTime.hrs,
            mins: this.togo.stopTime.mins,
            editMode: true
        }
    },
    methods: {
        deleteTogo() {
            this.$emit('deleteTogo');
        },
        getAddress() {
            return getAddress(this.togo.address);
        }
    },
    watch: {
        hrs: function() {
            this.togo.stopTime.hrs = this.hrs;
        },
        mins: function() {
            this.togo.stopTime.mins = this.mins;
        }
    }
}
</script>

<style scoped>
  .fa-times {
    color:darkgray;
    border: none;
    padding: 5px 9px;
    border-radius: 50%;
    cursor: pointer;
    float: right;
    padding-top: 10px;
    margin: 0;
    position: absolute;
    top: 50%;
    left: 50%;
    margin-right: -50%;
    transform: translate(-50%, -50%);
    font-size: 20px;
  }

  .address {
      font-size: 15px;
  }

  .stopTime {
      font-size: 15px;
  }

    .togo-item {

  
        width: 330px;
        height: 120px;
        background: #ffffff;
        padding: 10px;
        border-bottom: 1p #ccc dotted;
        color: #000000;
    }

    .spot-picture{
        width: 113px;
        height: 113px;
    }

    .p-name {
        font-size: 20px;
        overflow:hidden;
        white-space:nowrap;
        -ms-text-overflow:ellipsis;
        text-overflow:ellipsis;
        width:220px;
        height:1.4em;
    }
    .p-name:hover {
        overflow:visible;
    }

    .btn-add {
        width: 20px;
    }

    .hrInput {
        width: 80px;
    }

    .minInput {
        width: 80px;
    }
</style>
