<template>
    <header class="header">
        <div class="logo">
            <img src="./Logo.svg" alt="iTripLogo">
            <div class="dropdown">
                <i @click="myFunction()" class="fas fa-bars"></i>
                <div id="myDropdown" class="dropdown-content">
                    <a href="#">旅遊</a>
                    <a href="#">首頁</a>
                    <a href="#">登入</a>
                </div>
            </div>
        </div>
        <div class="searchbar">
            <input  
            class="input_name"
            type="text"
            placeholder="景點名稱"
            v-model="input_name" />
            <!-- Select Type -->
            <treeselect
            class="input_type"
            :multiple="false"
            :options="types"
            :flat="true"
            :sort-value-by="sortValueBy"
            :default-expand-level="0"
            placeholder="種類"
            v-model="selected_type"/>
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
            <img @mouseover="hover = true" @mouseleave="hover = false" :class={active:hover} 
            class="icon_search" src="../icons/search.svg" 
            @click="searchClicked">
        </div>
        <div class="btns">
            <div class="div_trip">
                <router-link to="/trip">旅遊</router-link>
            </div>
            <div class="div_home">
                <router-link to="/">首頁</router-link> 
            </div>
            <ProfileButton class="profileButton" v-model="$store.state.isAuthorized" v-on:button-click="checkState"></ProfileButton>
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
        ProfileButton,
        Treeselect,
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
    created: function() {
        window.addEventListener('click',this.clickOutSide);
    },
    destroyed: function() {
        window.removeEventListener('click', this.clickOutSide);
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
        myFunction() {
            document.getElementById("myDropdown").classList.toggle("show");
        },
        clickOutSide(event) {
            if (!event.target.matches('.fa-bars')) {
                var dropdowns = document.getElementsByClassName("dropdown-content");
                var i;
                for (i = 0; i < dropdowns.length; i++) {
                    var openDropdown = dropdowns[i];
                    if (openDropdown.classList.contains('show')) {
                        openDropdown.classList.remove('show');
                    }
                }
            }
        },
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
        justify-content: space-between;
        flex-grow: 3;
    }

    .btns {
        /* flex-grow: 3; */
        display: flex;
        flex-wrap:wrap;
        align-items: center;
        justify-content: flex-end;
        flex: 1 0 auto;

    }
    .searchbar {
        width: 600px;
        display: flex;
        flex-wrap:wrap;
        align-items: center;
        flex: 1 0 auto;
    }

    .header a {
        color: #fff;
        padding-right: 5px;
        text-decoration: none   ;
    }
    .input_name {
        width: 220px;
        flex: 1 1 auto;
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
        width: 110px;
        flex: 1 1 auto;
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
        width: 110px;
        flex: 1 1 auto;
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

    .spotName {
        position: relative;
    }

    .spotName:before {
        position: absolute;
        left: 180px;
        top: 50%;
        transform: translateY(-50%);
        font-family: "Font Awesome 5 Free"; font-weight: 900; content: "\f002";
        color:darkgray
    }

    .input_region {
        position: relative;
    }

    .input_region:before {
        position: absolute;
        left: 110px;
        top: 45%;
        transform: translateY(-50%);
        font-family: "Font Awesome 5 Free"; font-weight: 900; content: "\f3c5";
        color:darkgray
    }
  
    /* The container <div> - needed to position the dropdown content */
    .dropdown {
        display: none;
    }

    /* Dropdown Content (Hidden by Default) */
    .dropdown-content {
        display: none;
        position: absolute;
        background-color: #f1f1f1;
        min-width: 160px;
        box-shadow: 0px 8px 16px 0px rgba(0,0,0,0.2);
        z-index: 1;
    }

    /* Links inside the dropdown */
    .dropdown-content a {
        color: black;
        padding: 12px 16px;
        text-decoration: none;
        display: block;
    }

    /* Change color of dropdown links on hover */
    .dropdown-content a:hover {background-color: #ddd}

    /* Show the dropdown menu (use JS to add this class to the .dropdown-content container when the user clicks on the dropdown button) */
    .show {display:block;}

    .fa-bars{
        font-size: 30px;
        color: white;
        padding: 16px;
        border: none;
        cursor: pointer;
        padding-bottom: 10px;
    }

    @media only screen and (max-width: 780px) {
    .header {
        flex-direction: column;
    }
    .icon_search {
        width: 25px;
        height: 25px;
    }
    .logo img {
        margin: 0px;
        width: 45px;
        height: 40px;
    }
    .logo {
        margin-left: 10px;
        height: 40px;
        flex-direction: row;
        display: flex;
        justify-content: space-between;
    }

    .div_trip {
        display: none;
    }
    .div_home {
        display: none;
    }
    .profileButton {
        display: none;
    }
    .input_name {
        height: 28px;
        width: 200px;
        border-radius: 18px 18px 18px 18px;
        margin-right: 5px;
        font-size: 15px;
        
    }
    .searchbar {
        width: 100%;
        height: 30px;
        flex: 1 1 auto;
        flex-direction: row;
        align-self: flex-end;
        justify-self: flex-start;
    }
    .input_region {
        display: none;
    }
    .input_type {
        display: none;
    }
    .dropdown {
        display: inline-block;
        position: relative;
        align-self: center;
    }
    .btns {
        display: none;
    }
  }

</style>