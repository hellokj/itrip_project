<template>
    <header class="header" :class="{headerBackgroundEdit : editMode, headerBackgroundLocked: isLocked}">
        <!-- {{isLocked}}
        {{editMode}} -->
        <!-- {{editMode}} -->

        <!-- Edit mode modal -->
        <b-modal ref="edit-tutorial" size="md" hide-footer hide-backdrop hide-header>
            <div class="edit-tutorial" style="width: 100%; height:auto; text-align:center;">
                <h3 style="margin-top: 100px; width: 100%; font-size: 25px; color:#FFF;">點擊以下圖示以退出編輯模式</h3>
                <div style="margin-bottom: 150px; display: block; width: 100%; font-size: 100px;">
                    <i class="fas fa-edit"></i>
                </div>
                <div class="edit-tutorial-cursor">
                    <i class="far fa-hand-pointer"></i>
                </div>
                <button class="edit-tutorial-ok" @click="hideEditTutorial">我知道了</button>
            </div>
        </b-modal>

        <!-- Lock mode modal -->
        <b-modal ref="locked-tutorial" size="md" hide-footer hide-backdrop hide-header>
            <div class="locked-tutorial" style="text-align:center;">
                <h3 style="margin-top: 100px; width: 100%; font-size: 25px; color:#FFF;">此行程已鎖定</h3>
                <h3 style="margin-top: 10px; width: 100%; font-size: 25px; color:#FFF;">可即時查看行程變更</h3>
                <div style="display: block; width: 100%; height: 250px; text-align: center;">
                    <img src="../../assets/itinerary.png" alt="" style="width: 50%">
                </div>                
                <div class="locked-tutorial-cursor">
                    <i class="far fa-hand-pointer"></i>
                </div>
                <button class="locked-tutorial-ok" @click="hideLockedTutorial">我知道了</button>
            </div>
        </b-modal>

        <div v-if="editMode" style="background-color: transparent; position:absolute; left: 60%; top: 5px; text-align: center;"><b-button id="show-btn" @click="showEditTutorial">Open Modal</b-button></div>
        <div v-if="isLocked" style="background-color: transparent; position:absolute; left: 60%; top: 0px; text-align: center;"><b-button id="show-btn" @click="showLockedTutorial">Open Modal</b-button></div>
        <div class="logo">
            <img :src="require('./'+logo)" alt="iTripLogo" @click="toHome">
            <div class="dropdown">
                <i @click="myFunction()" class="fas fa-bars"></i>
                <div id="myDropdown" class="dropdown-content">
                    <router-link to="/trip">開始規劃</router-link>
                    <router-link to="/">首頁</router-link> 
                    <a href="#">登入</a>
                </div>
            </div>
        </div>
        <div class="searchbar" >
            <HeaderSearch @header-search-btn-clicked="searchClicked"></HeaderSearch>
            <!-- <div class="inner-addon right-addon">
                <i class="fas fa-search"></i>
                <input  
                class="input_name"
                type="text"
                placeholder="想去哪?"
                v-model="input_name"
                style="text-align:center;" />
            </div>
            <div class="trees">
     
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
            @click="searchClicked"> -->
        </div>
        <div class="btns">
            <div class="div_trip">
                <router-link  to="/trip">開始規劃</router-link>
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
import HeaderSearch from '../HeaderSearch'
import ProfileButton from '../ProfileButton'
import {getAreas, getTypes, makeParams} from '../../../utils/area.js'
import Treeselect from '@riophae/vue-treeselect'
import '@riophae/vue-treeselect/dist/vue-treeselect.css'

Vue.component('ProfileButton', ProfileButton);

export default {
    name: "Header",
    components: {
        ProfileButton,
        Treeselect,
        HeaderSearch
    },
    props: {editMode: Boolean, isLockedProp: Boolean},
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
            val: '',
            isLocked: false,
        }
    },
    created: function() {
        window.addEventListener('click',this.clickOutSide);
    },
    mounted() {
        if(this.editMode) this.showEditTutorial();
        if(this.isLocked) console.log(`isLocked become true`)
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
        searchClicked(city, region, type, name) {
            this.params = makeParams(city, region, type, name);
            this.$emit('search-click', this.params);

            if(window.innerWidth <= 768) {
                this.$bus.$emit('toggle', {id: 'Spots'});
            }
            this.input_name = '';
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
        },
        showEditTutorial: function() {
            this.$refs['edit-tutorial'].show();
        },
        hideEditTutorial: function() {
            this.$refs['edit-tutorial'].hide();
        },
        showLockedTutorial: function() {
            this.$refs['locked-tutorial'].show();
        },
        hideLockedTutorial: function() {
            this.$refs['locked-tutorial'].hide();
        },
    },
    computed: {
        logo:  function(){
            if( this.editMode ) return "itripLogoWhite.svg"
            if( this.isLocked ) return "itripLogoWhite.svg"
            else return "itripLogo.svg"
        },
        
    },
    watch: {
        isLockedProp: function(newVal){
            if(newVal) {
                this.isLocked = true;
                this.showLockedTutorial();
                console.log("isLockedProp Change")
            }
            else this.isLocked = false;
        }
    }
}
</script>

<style scoped>


@font-face {
    font-family: logoFont;
    src: url(../../assets/Noto_Serif_TC/NotoSerifTC-Medium.otf);
}

    .header {
        position: sticky;
        top: 0;
        background-image: linear-gradient(90deg, rgba(255,208,129,1) 0%, rgba(246,165,144,1) 60%, rgba(231,126,125,1) 100%); 
        height: 10vh;
        display: flex;
        font-family: logoFont;
        justify-content: space-between;
        flex-grow: 3;
        width: 100vw;
        z-index: 20;
    }

    .headerBackgroundEdit {
        background-image: linear-gradient(120deg, #84fab0 0%, #8fd3f4 100%);
        box-shadow: 0px 3px 6px rgb(55, 55, 55, 0.75);
    }
    .headerBackgroundLocked {
        background-image: linear-gradient(90deg, rgba(92, 82, 64, 0.26) 0%, rgba(119, 102, 97, 0.322) 50%, rgba(78, 62, 62, 0.432) 100%);
    }

    .btns {
        /* flex-grow: 3; */
        width: 30%;
        display: flex;
        align-items: center;
        justify-content: flex-end;
        flex: 0 1 auto;
        padding-right: 20px;
        white-space: nowrap; 
        overflow: hidden;
    }
    .searchbar {
        width: 40%;
        display: flex;
        flex-wrap:wrap;
        flex-direction: row;
        align-items: flex-start;
        justify-content: center;
        padding-top: 3vh;
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
        cursor: pointer;
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

    .edit-tutorial {
        position: absolute; 
        left: 0px; 
        top: -5px; 
        width:100%; 
        height: 600px;
        border-radius: 5px;
        background-color: #FFF;
        background-image: linear-gradient(to top, #a8edea 0%, #fed6e3 100%);
        box-shadow: 0px 3px 6px rgba(55, 55, 55, 0.85);
    }
    .edit-tutorial-ok {
        position: absolute;
        outline: none;
        left: calc(50% - 75px);
        width: 150px;
        height: 50px;
        border-radius: 25px;
        border: 2px solid #FFF;
        color: #FFF;
        background: transparent;
        bottom: 15px;
    }
    .edit-tutorial-ok:hover {
        background: #FFF;
        color: #5a8381;
    }
    .edit-tutorial-cursor {
        display: block; 
        position: absolute; 
        left: 50%; 
        bottom: 80px; 
        font-size: 30px;
    }
    .edit-tutorial-cursor {
        display: block; 
        position: absolute; 
        left: 50%; 
        font-size: 30px;
        animation: lds-facebook 1.5s cubic-bezier(0, 0.5, 0.5, 1) infinite;
    }
    .locked-tutorial {
        position: absolute; 
        left: 0px; 
        top: -5px; 
        width: 100%; 
        height: auto;
        border-radius: 5px;
        background-color: #FFF;
        background-image: linear-gradient(to top, #a8edea 0%, #fed6e3 100%);
        box-shadow: 0px 3px 6px rgba(55, 55, 55, 0.85);
        overflow: hidden;
    }
    .locked-tutorial-ok {
        position: absolute;
        outline: none;
        left: calc(50% - 75px);
        width: 150px;
        height: 50px;
        border-radius: 25px;
        border: 2px solid #FFF;
        color: #FFF;
        background: transparent;
        bottom: 15px;
    }
    .locked-tutorial-ok:hover {
        background: #FFF;
        color: #5a8381;
    }
    .locked-tutorial-cursor {
        display: block; 
        position: absolute; 
        left: 50%; 
        bottom: 80px; 
        font-size: 30px;
    }
    .locked-tutorial-cursor {
        display: block; 
        position: absolute; 
        left: 50%; 
        font-size: 30px;
        animation: lds-facebook 1.5s cubic-bezier(0, 0.5, 0.5, 1) infinite;
    }
    @keyframes lds-facebook {
        0% {
            bottom: 50px;
        }
        50%, 100% {
            bottom: 130px;
        }
    }

    @media only screen and (max-width: 780px) { 
    .header {
        flex-direction: column;
        height: 120px;
        padding: 0px;
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
        /* justify-content: center; */
        margin-left: 30px;
        margin-top: 5px;
        padding: 0px;
    }
    .dropdown {
        display: inline-block;
        position: relative;
        align-self: center;
    }
    .btns {
        display: none;
        padding: 0px;
    }
    .fa-search {
        display: none;
    }
}

</style>