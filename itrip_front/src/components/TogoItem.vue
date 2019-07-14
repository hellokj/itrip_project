<template>
    <div class="togo-item px-0 py-0">
        <b-container>
            <b-row>
                <b-col class="ml-0 my-0 pl-0 py-0" cols="3">
                    <img class="ml-0 my-0 px-0 py-0 spot-picture" :src="togo.images[0]" alt="Picture">
                </b-col>
                <b-col class="ml-0 my-0 px-0 py-0">
                    <b-row class="ml-3 my-0 px-0 py-0" align-h="start">
                        <b-col cols="9" class="ml-0 my-0 px-0 py-0">
                            <p class="mx-0 my-0 px-0 py-0 p-name"><b>{{togo.name}}</b></p>
                        </b-col>
                        <b-col cols="1" class="ml-4 my-0 px-0 py-0">
                            <i class="fas fa-trash-alt" @click="$emit('deleteTogo', togo.index)"></i>
                        </b-col>
                    </b-row>
                    <b-row class="ml-3 my-0 px-0 py-0" align-h="start">
                        <p class="mx-0 my-0 px-0 py-0 address">{{getAddress()}}</p>
                    </b-row>
                    <b-row class="ml-0 my-0 px-0 py-0">
                        <!-- <b-col><p class="mx-0 my-3 px-0 py-0 stopTime">停留時間</p></b-col> -->
                        <b-col cols="3" class="ml-3 my-3 px-0 py-0">
                            <el-input-number class="hrInput" v-model="hrs" :step="1" size="mini"></el-input-number>
                        </b-col>
                        <b-col cols="2" class="ml-2 my-3 px-0 py-0">
                            <p>小時</p>
                        </b-col>
                        <b-col cols="3" class="ml-0 my-3 px-0 py-0">
                            <el-input-number class="hrInput" v-model="hrs" :step="1" size="mini"></el-input-number>
                        </b-col>
                        <b-col cols="2" class="ml-2 my-3 px-0 py-0">
                            <p>分</p>
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
            hrs: 1,
            mins: 0,
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
}
</script>

<style scoped>
  .fa-trash-alt {
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
    transform: translate(-50%, -50%)
  }

  .address {
      font-size: 15px;
  }

  .stopTime {
      font-size: 15px;
  }

    .togo-item {
        margin-left: 4px;
        margin-top: 5px;
        width: 377px;
        height: 100px;
        background: #ffffff;
        padding: 10px;
        border-bottom: 1p #ccc dotted;
        color: #000000;
    }

    .spot-picture{
        width: 100px;
        height: 100px; 
    }

    .p-name {
        font-size: 20px;
        overflow:hidden;
        white-space:nowrap;
        -ms-text-overflow:ellipsis;
        text-overflow:ellipsis;
        width:270px;
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
</style>
