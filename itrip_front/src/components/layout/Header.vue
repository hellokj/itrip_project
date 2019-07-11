<template>
    <header class="header">
        <div class="logo">
            <img src="./Logo.svg" alt="iTripLogo">
        </div>
        <div class="btns">
            <!-- Select Type -->
            <div>
                <b-form-input ref="type" @click="selectTypeText()" v-model="selected_type" 
                @keyup.enter="searchClicked" 
                class="input_type" placeholder="雙心石滬" list="my-list-id1"></b-form-input>
                    <datalist id="my-list-id1">
                        <!-- Change types -->
                        <option v-bind:key="type" v-for="type in types">{{ type }}</option>
                    </datalist>
            </div>
            <div>
                <b-form-input ref="region" @click="selectRegionText()" 
                @keyup.enter="searchClicked" 
                v-model="selected_region" class="input_region" placeholder="臺北市" 
                list="my-list-id2"></b-form-input>
                    <datalist id="my-list-id2">
                        <datalist v-bind:key="region" v-for="(suburbs, region) in regions" id="my-list-id3">
                            <option v-bind:key="suburb" v-for="suburb in suburbs">{{ suburb }}</option>
                        </datalist>
                        <!-- <option v-bind:key="region" v-for="region in regions">{{ region }}</option> -->
                    </datalist>
            <!-- Select Region -->
            <!-- <input-tag v-model="tags"></input-tag> -->
            
            </div>

            <img @mouseover="hover = true" @mouseleave="hover = false" :class={active:hover} 
            class="icon_search" src="../icons/search.svg" 
            @click="searchClicked">

            <div class="div_trip">
                <router-link to="/trip">旅遊</router-link>
            </div>
            <div class="div_home">
                <router-link to="/">首頁</router-link> 
            </div>
            <button class="div_login" @click="$emit('login-click')"> 登入
            </button>
        </div>
      
    </header>
</template>

<script>
import {getAreas, getTypes, makeParams} from '../../../utils/area.js'
import InputTag from 'vue-input-tag'

export default {
    name: "Header",
    data() {
      return {
        selected_type: '',
        selected_region: '',
        regions: getAreas(),
        types: Object.keys(getTypes()),
        params: {},
        hover: true,
        tags: []
      }
    },
    components: {
      InputTag
    },
    methods: {
        setRegion(e, val){  
            this.region = val;
        },
        selectRegionText() {
            this.$refs['region'].select();
        },
        selectTypeText() {
            this.$refs['type'].select();
        },
        searchClicked() {
            this.params = makeParams(this.selected_region, null, this.selected_type);
            this.$emit("search-click", this.params);
        }
    },
  }
</script>

<style scoped>
    .header {
        margin: 0px;
        background: rgb(255,208,129);
        background: linear-gradient(90deg, rgba(255,208,129,1) 0%, rgba(246,165,144,1) 60%, rgba(231,126,125,1) 100%);
        height: 80px;
        display: flex;

        justify-content: flex-start;
        flex-grow: 3;
    }

    .btns {
        flex-grow: 5;
        display: flex;
        flex-wrap:wrap;
        align-items: center;
        justify-content: flex-end;

    }

    .header a {
        color: #fff;
        padding-right: 5px;
        text-decoration: none   ;

    }

    .input_type {
        width: 266px;
        height: 40px;
        border-radius: 20px 0 0 20px;
        border: none;
        font-size: 20px;
        text-align: left;
        padding-left: 20px;
        margin-right: 2px;
        outline: none;

    }

    .input_region {
        width: 133px;
        height: 40px;
        border-radius: 0 20px 20px 0;
        border: none;
        font-size: 20px;
        text-align: left;
        margin-right: 0px;
        outline: none;

    }

    .icon_search {
        position: relative;
        margin-left: 5px;
        cursor: pointer;
    }

    p {
        color: #ffffff;
    }
    .div_login {
        width: 125px;
        height: 40px;
        border: 2px solid #ffffff;
        border-radius: 20px;
        display: flex;
        align-items: center;
        justify-content: center;
        margin-right: 50px;

    }
    .div_home {
        margin-right: 25px;
    }

    .div_trip {
        padding: 0px;
        margin-right: 25px;
        margin-left: 30px;

    }

    .logo img {
        width: 100px;
        margin-top:10px;
        margin-left: 50px;
    }


    ::-ms-b-form-input-placeholder { /* Microsoft Edge */
        color: red;
    }
    
    .active {
        transform: translate(0px, -5px);

    }

</style>