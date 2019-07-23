<template>
    <header class="header">
        <div class="logo">
            <img src="./itripLogo.svg" alt="iTripLogo" @click="toHome">
            <div class="dropdown">
                <i @click="myFunction()" class="fas fa-bars"></i>
                <div id="myDropdown" class="dropdown-content">
                    <router-link to="/trip">旅遊</router-link>
                    <router-link to="/">首頁</router-link> 
                    <a href="#">登入</a>
                </div>
            </div>
        </div>
        <div class="searchbar">
            <div class="inner-addon right-addon">
                <i class="fas fa-search"></i>
                <input  
                class="input_name"
                type="text"
                placeholder="想去哪?"
                v-model="input_name"
                style="text-align:center;" />
            </div>
            <div class="trees">
                <!-- Select Type -->
                <treeselect
                class="input_type"
                :multiple="false"
                :options="types"
                :flat="false"
                :sort-value-by="sortValueBy"
                :default-expand-level="0"
                placeholder="種類"
                v-model="selected_type"
                style="text-align:center;" />
                
                <treeselect
                class="input_region"
                :multiple="false"
                :options="regions"
                :flat="false"
                :sort-value-by="sortValueBy"
                :default-expand-level="0"
                placeholder="地區"
                v-model="selected_region"
                style="text-align:center;" 
                @select="setCity"
                />  
            </div>
           
            <img @mouseover="hover = true" @mouseleave="hover = false" :class={active:hover} 
            class="icon_search" src="../icons/search.svg" 
            @click="searchClicked">
        </div>
        <div class="btns">
            <div class="div_trip">
                <router-link  to="/trip">旅遊</router-link>
            </div>
            <div class="div_home">
                <router-link to="/">首頁</router-link>
            </div>
            <ProfileButton class="profileButton" v-model="$store.state.isAuthorized"></ProfileButton>
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

            if(window.innerWidth <= 768) {
                this.$bus.$emit('toggle', {id: 'Spots'});
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
                let dropdowns = document.getElementsByClassName("dropdown-content");
                let i;
                for (i = 0; i < dropdowns.length; i++) {
                    let openDropdown = dropdowns[i];
                    if (openDropdown.classList.contains('show')) {
                        openDropdown.classList.remove('show');
                    }
                }
            }
        },
        toHome: function(){
            this.$router.push({path: '/'});
        }
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
        height: 10vh;
        display: flex;
        font-family: logoFont;
        justify-content: space-between;
        flex-grow: 3;
        width: 100%;
    }

    .btns {
        /* flex-grow: 3; */
        display: flex;
        align-items: center;
        justify-content: flex-end;
        flex: 0 1 auto;
        padding-right: 20px;

    }
    .searchbar {
        width: 650px;
        display: flex;
        flex-wrap:wrap;
        flex-direction: row;
        align-items: center;
        justify-content: center;
        flex:0 0 auto;
    }

    .header a {
        color: #fff;
        padding-right: 5px;
        text-decoration: none;
    }
    .input_name {
        width: 300px;
        flex:0 1 auto;
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
    .trees {
        display: flex;
        flex-direction: row;
    }
    .input_type {
        width: 130px;
        flex: 0 0 auto;
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
        width: 150px;
        flex: 0 0 auto;
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
        width: 40px;
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

    
    .active {
        transform: translate(0px, -5px);

    }

        /* enable absolute positioning */
    .inner-addon { 
        position: relative; 
    }

    /* style icon */
    .inner-addon .fa-search {
        position: absolute;
        top: 50%;
        left: 95%;
        transform: translateY(-50%);
        pointer-events: none;
    }

    /* align icon */
    .right-addon .fa-search { right: 0px;}

    /* add padding  */
    .right-addon input { padding-right: 30px; }

    .input_region {
        position: relative;
    }

    .input_region:before {
        position: absolute;
        top: 50%;
        left: 70%;
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
        height: 120px;
    }
    .icon_search {
        width: 30px;
        height: 30px;
    }
    .logo img {
        margin: 0px;
        width: 55px;
        height: 55px;
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
        width: 220px;
        height: 35px;
        border-radius: 18px 18px 18px 18px;
        font-size: 15px;
        flex: 0 1 auto;
    }
    .searchbar {
        width: 100%;
        height: 80px;
        flex: 0 1 auto;
        flex-direction: row;
        align-self: flex-end;
        justify-content: center;
        margin-left: 25px;
        padding: 0px;
    }
    .dropdown {
        display: inline-block;
        position: relative;
        align-self: center;
    }
    .btns {
        display: none;
    }
    .fa-search {
        display: none;
    }
  }

</style>