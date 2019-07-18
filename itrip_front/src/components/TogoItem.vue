<template>
    <div class="px-2 py-2 togo-item">
        <img class="spot-picture" :src="togo.images[0]" alt="Picture">
        <div class="info-col">
            <div class="name-container">
                <p class="mb-0 ml-2 p-name" style="text-align:left;"><b>{{togo.name}}</b></p>
                <i class="fas fa-times" @click="$emit('deleteTogo', togo.index)"></i>
            </div>
            <p class="mx-0 my-1 ml-2 address" style="text-align:left;">{{getAddress()}}</p>
            <p class="mx-0 my-0 px-1 stopTime" style="text-align:left;">停留時間</p>
            <div class="iNumber-container">
                <v-number-smarty
                v-model="hrs"
                number-type="integer"
                unsigned
                font-size="1rem"
                :step="1"
                :max-value="24"
                style="width:50px;"
                />
                <p class="pt-1" style="width:50px;font-size:15px;">小時</p>
                <v-number-smarty
                v-model="mins"
                number-type="integer"
                unsigned
                font-size="1rem"
                :step="1"
                :max-value="60"
                style="width:50px;"
                />
                <p class="pt-1" style="font-size:15px;width:50px;">分</p>
                <i class="fas fa-ellipsis-h"></i>
            </div>
        </div>
    </div>
</template>

<script>
import Vue from 'vue'
import {getAddress} from '../../utils/checker.js'
import VNumberSmarty from 'vue-number-smarty';

export default {
    name: "TogoItem",
    components: {
       VNumberSmarty,
    },
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
            this.togo.stopTime.hrs = parseInt(this.hrs);
        },
        mins: function() {
            this.togo.stopTime.mins =  parseInt(this.mins);
        }
    }
}
</script>

<style scoped>
    .togo-item {
        width: 85%;
        margin-left: 4px;
        padding-top: 2px;
        margin-right: 5px;
        background: #ffffff;
        color: #000000;
        display: flex;
        flex-direction: row;
    }
    .info-col {
        width: 68%;
        display: flex;
        flex-direction: column;
        justify-content: space-evenly;
        padding-left: 5px;
    }
    .name-container {
        width: 100%;
        display: flex;
        flex-direction: row;
        justify-content: space-between;
    }
    .iNumber-container {
        display: flex;
        flex-direction: row;
        width: 270px;
        padding-top: 5px;

    }
    p {
        width:85%;
        overflow:hidden;
        white-space:nowrap;
        text-overflow:ellipsis;
        height:1.5em;
    }
    p:hover {
        overflow:visible;
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
        width: 140px;
        height: 117px;
    }
    .p-name {
        font-size: 20px;
    }
    .address {
        font-size: 15px;
    }
    .stopTime {
        font-size: 15px;
    }
    .fa-ellipsis-h {
        padding-right: 10px;
        margin-top: 20px;
        font-size: 15px;
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
    .iNumber-container {
        width: 150px;
    }
    .address {
        font-size:10px;
    }
    .stopTime {
        font-size: 10px;
    }
  }
</style>
