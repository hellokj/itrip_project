<template>
    <b-container class="togo-item">
        <b-row fluid>
            <b-col class="px-0" cols="2" sm="3" md="3" lg="3" xl="4">
                <img class="spot-picture" :src="togo.images[0]" alt="Picture" style="width:100%;height:100%;max-width:110px;max-height:110px;">
            </b-col>
            <b-col md="8" lg="8" xl="7" offset-cols="2" class="px-0">
                <b-row align-h="between">
                    <p class="mb-0 ml-4 p-name" style="font-size:18px;text-align:left;"><b>{{togo.name}}</b></p>
                    <i class="fas fa-times" @click="$emit('deleteTogo', togo.index)"></i>
                </b-row>
                <p class="mx-0 my-0 ml-2" style="font-size:12px;text-align:left;">{{getAddress()}}</p>
                <p class="mx-0 my-0 px-1 stopTime" style="text-align:left;font-size:15px;">停留時間</p>
                <b-row class="px-0 mx-0" fluid>
                    <b-col cols="6">
                        <b-row>
                            <v-number-smarty
                                v-model="hrs"
                                number-type="integer"
                                unsigned
                                font-size="1rem"
                                :step="1"
                                :max-value="24"
                                style="width:50px;"
                                />
                                <p style="font-size:15px;width:50px;text-align:left;">小時</p>
                        </b-row>
                    </b-col>
                    <b-col cols="6">
                        <b-row>
                            <v-number-smarty
                            v-model="mins"
                            number-type="integer"
                            unsigned
                            font-size="1rem"
                            :step="1"
                            :max-value="60"
                            style="width:50px;"
                            />
                            <p style="font-size:15px;width:50px;text-align:left;">分</p>
                        </b-row> 
                    </b-col>
                </b-row>
            </b-col>
        </b-row>
    </b-container>
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
            this.togo.stopTime.hrs = this.hrs;
        },
        mins: function() {
            this.togo.stopTime.mins = this.mins;
        }
    }
}
</script>

<style scoped>
    .togo-item {
        margin-left: 4px;
        margin-top: 5px;
        padding-top: 2px;
        background: #ffffff;
        border-bottom: 1p #ccc dotted;
        color: #000000;
    }
    p {
        width:200px;
        overflow:hidden;
        white-space:nowrap;
        text-overflow:ellipsis;
        height:1.5em;
    }
    p:hover {
        overflow:visible;
    }
    /* p {
        margin: 0px;
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
  } */
</style>
