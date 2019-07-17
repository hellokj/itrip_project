<template>
    <div class="togo-item">
        <img class="spot-picture" :src="togo.images[0]" alt="Picture">
        <div class="infoCol">
            <div class="nameRow">
                <p class="p-name"><b>{{togo.name}}</b></p>
                <i class="fas fa-times" @click="$emit('deleteTogo', togo.index)"></i>
            </div>
            <div class="addressRow">
                <p>{{ getAddress() }}</p>
            </div>
            <p class="stopTime">停留時間</p>
            <div class="stopTimeRow">
                <el-input-number class="hrInput" v-model="hrs" :step="1" size="mini"></el-input-number>
                <p>小時</p>
                <el-input-number class="minInput" v-model="mins" :step="1" size="mini"></el-input-number>
                <p>分</p>
            </div>
        </div>
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
    p {
        margin: 0px;
    }
    .togo-item {
        display: flex;
        flex-direction: row;
        margin-left: 4px;
        margin-top: 5px;
        width: 100%;
        height: 120px;
        padding-top: 2px;
        background: #ffffff;
        border-bottom: 1p #ccc dotted;
        color: #000000;
    }
    .infoCol {
        display: flex;
        flex-direction: column;
        padding-left: 5px;
        justify-content: space-evenly;
        
    }
    .nameRow {
        display: flex;
        flex-direction: row;
        justify-content: space-between;
    }
    .spot-picture{
        width: 113px;
        height: 100%;
    }
    .fa-times {
        color:darkgray;
        border: none;
        padding: 5px 9px;
        border-radius: 50%;
        cursor: pointer;
    }

    .address {
        font-size: 15px;
    }

    .stopTimeRow {
        display: flex;
        flex-direction: row;
    }

    .stopTime {
        font-size: 15px;
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

    @media only screen and (max-width: 780px) {
    .togo-item {
        
    }
    .spot-picture{
        width: 113px;
        height: 100%;
    }
  }
</style>
