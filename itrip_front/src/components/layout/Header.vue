<template>
    <header class="header">
        <div class="logo">
            <img src="./Logo.svg" alt="iTripLogo">
        </div>
        <div class="btns">
            <div>
                <input  
                class="input_name"
                type="text"
                placeholder="景點名稱"
                v-model="input_name" />
            </div>
            <!-- Select Type -->
            <div>
                <treeselect
                class="input_type"
                :multiple="false"
                :options="types"
                :flat="true"
                :sort-value-by="sortValueBy"
                :default-expand-level="0"
                placeholder="種類"
                v-model="selected_type"
                />
            </div>
            <div>
                <treeselect
                class="input_region"
                :multiple="false"
                :options="regions"
                :flat="true"
                :sort-value-by="sortValueBy"
                :default-expand-level="0"
                placeholder="地區"
                v-model="selected_region"
                @select="setCity"
                />
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
            <ProfileButton v-model="$store.state.isAuthorized" v-on:button-click="checkState"></ProfileButton>
        </div>
      
    </header>
</template>

<script>
import Vue from 'vue'
import ProfileButton from '../ProfileButton'
import {getAreas, getTypes, makeParams} from '../../../utils/area.js'
// import InputTag from 'vue-input-tag'
import Treeselect from '@riophae/vue-treeselect'
import '@riophae/vue-treeselect/dist/vue-treeselect.css'


Vue.component('ProfileButton', ProfileButton);

export default {
    name: "Header",
    components: {
        ProfileButton
    },
    data() {
      return {
        input_name: '',
        selected_type: undefined,
        selected_region: undefined,
        selected_city: undefined,
        regions: getAreas(),
        types: getTypes(),
        params: {},
        hover: true,
        tags: [],
        options: getAreas(),
        sortValueBy: 'ORDER_SELECTED',
        val: ''
      }
    },
    components: {
    //   InputTag,
      Treeselect
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
            this.params = makeParams(this.selected_city, this.selected_region, this.selected_type, this.input_name);
            this.$emit('search-click', this.params);
        },
        checkState(){
            if (this.$store.state.isAuthorized){
                this.$emit('logOut-click');
            }else {
                this.$emit('logIn-click');
            }
        },
        
        setCity(node) {
            this.selected_city = node.parentId;
        },
    },
    computed: {
        
    },
  }
</script>

<style scoped>


@font-face {
  font-family: logoFont;
  src: url(../../assets/Noto_Serif_TC/NotoSerifTC-Medium.otf);
}
    .header {
        margin: 0px;
        background: rgb(255,208,129);
        background: linear-gradient(90deg, rgba(255,208,129,1) 0%, rgba(246,165,144,1) 60%, rgba(231,126,125,1) 100%);
        height: 80px;
        display: flex;
        font-family: logoFont;
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
    .input_name {
        width: 266px;
        height: 36px;
        border-radius: 18px 1px 1px 18px;
        border: none;
        font-size: 20px;
        text-align: left;
        padding-left: 20px;
        margin-right: -20px;
        margin-bottom: 4px;
        outline: none;
        border: 1px solid rgb(224, 224, 224);
    }
    .input_type {
        width: 150px;
        height: 40px;
        border-radius: 20px 0 0 20px;
        border: none;
        font-size: 20px;
        text-align: left;
        padding-left: 20px;
        margin-right: 0px;
        outline: none;

    }

    .input_region {

        width: 266px;
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
    .div_logIn{
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
                font-family: logoFont;
    }


    ::-ms-b-form-input-placeholder { /* Microsoft Edge */
        color: red;
    }
    
    .active {
        transform: translate(0px, -5px);

    }


</style>