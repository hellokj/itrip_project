<template>
    <div class="px-2 py-2 togo-item">
        <el-card :body-style="{ padding: '0px' }" shadow="hover"> 
            <div class="card-container">
                <div class="picture-container">
                    <vue-load-image>
                        <img ref="image" class="spot-picture" slot="image" :src="srcFunc">
                        <img class="px-2 py-2 preloader" slot="preloader" src="../assets/image-loader.gif"/>
                        <div slot="error"><img class="px-2 py-2 picNotFound" src="../assets/picNotFound.jpg"></div>
                    </vue-load-image>
                </div>
                <div class="info-col">
                    <div class="name-container">
                        <p class="mb-0 p-name" style="text-align:left;"><b>{{togo.name}}</b></p>
                        <i class="fas fa-times" @click="$emit('deleteTogo', togo.index)"></i>
                    </div>
                    <p class="address" style="text-align:left;">{{getAddress()}}</p>
                    <p class="mx-0 my-0 px-1 stopTime" style="text-align:left;">停留時間</p>
                    <div class="iNumber-container">
                        <a-time-picker class="time-picker" @change="onChange" :defaultValue="moment('01:00', 'HH:mm')" format="HH:mm" />
                        <a-dropdown :trigger="['click']">
                        <a class="ant-dropdown-link">
                            <i class="fas fa-ellipsis-h"></i>
                        </a>
                        <a-menu slot="overlay">
                            <a-menu-item @click="$emit('getNearby', togo)">
                                <i class="fas fa-map-marked-alt"></i>  附近景點
                            </a-menu-item>
                        </a-menu>
                    </a-dropdown> 
                    </div>
                </div>
            </div>
        </el-card> 
    </div>
</template>

<script>
import Vue from 'vue'
import {getAddress} from '../../utils/checker.js'
import VNumberSmarty from 'vue-number-smarty'
import moment from 'moment'
import VueLoadImage from 'vue-load-image'

export default {
    name: "TogoItem",
    components: {
       VNumberSmarty,
       'vue-load-image': VueLoadImage
    },
    props: {
        togo: Object,
    },
    data() {
        return {
            hrs: this.togo.stopTime.hrs,
            mins: this.togo.stopTime.mins,
            editMode: true,
            stopTime:''
        }
    },
    methods: {
        getAddress() {
            return getAddress(this.togo.address);
        },
        onChange(time, timeString){
            this.hrs = parseInt(timeString.split(':')[0]);
            this.mins = parseInt(timeString.split(':')[1]);
            this.togo.stopTime.hrs = this.hrs;
            this.togo.stopTime.mins = this.mins;
        },
        moment,
    },
    computed: {
        srcFunc: function() {
            let src;
            if(!Object.keys(this.togo).includes('images') || this.togo.images.length == 0) {
                src = this.notFound
            }
            else {
                src = this.togo.images[0]
            }
            return src  
        },
    }
}
</script>

<style scoped>
    .togo-item {
        width: 90%;
        padding-top: 2px;
        color: #000000;
        display: flex;
        flex-direction: row;
    }
    .el-card:hover {
        border: 2px solid #ebb134;
        box-shadow: 0 0 5px #ebb134;
    }
    .card-container {
        height: 130px;
        width: 100%;
        display: flex;
        flex-direction: row;
    }
    .picture-container {
        height: 100%;
        width: 130px;
        display: flex;
        flex-direction: column;
        justify-content: center;
    }
    .info-col {
        width: 68%;
        display: flex;
        flex-direction: column;
        justify-content: space-evenly;
        padding-left: 5px;
        overflow: hidden;
    }
    .name-container {
        width: 95%;
        display: flex;
        flex-direction: row;
        justify-content: space-between;
    }
    .iNumber-container {
        display: flex;
        flex-direction: row;
        width: 100%;
        padding-top: 5px;
        justify-content: space-between;

    }
    p {
        width:80%;
        overflow:hidden;
        white-space:nowrap;
        text-overflow:ellipsis;
        height:1.5em;
    }
    p:hover {
        overflow:visible;
    }
    .time-picker {
        width: 50%;
        margin-bottom: 5px;
    }
    .fa-times {
        color:darkgray;
        border: none;
        padding: 5px 9px;
        border-radius: 50%;
        cursor: pointer;
    }
    .fa-times:hover {
        color:dimgray;
    }
    .spot-picture {
        width: 120px;
        height: 120px;
        padding: 8px;
        margin-top: 4px;
        margin-left: 4px;
    }
    .p-name {
        font-size: 15px;
    }
    .address {
        margin:0px;
        font-size: 12px;
        margin-left: 3px;
    }
    .stopTime {
        font-size: 12px;
    }
    .fa-ellipsis-h {
        padding-right: 20px;
        margin-top: 20px;
        font-size: 12px;
        cursor: pointer;
    }
    @media only screen and (max-width: 780px) {
    .spot-picture{
        width: 100px;
        height: 90px;
    }
    p {
        width: 75%;
    }
    .p-name {
        font-size: 15px;
    }
    .fa-times {
        padding: 0px;
        padding-right: 5px;
    }
    .address {
        font-size:10px;
    }
    .stopTime {
        font-size: 10px;
    }
  }
</style>
