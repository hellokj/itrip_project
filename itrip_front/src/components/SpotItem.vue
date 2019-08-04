<template>
    <div class="spot-item-container" @mouseover="$emit('mouseOver')">
        <el-card class="el-card" :body-style="{ width: '100%', padding: '10px'}">
            <div class="card-container">
                        
                <div class="picture-container" style="position:relative;">
                    <vue-load-image>
                        <img ref="image" class="spot-picture" slot="image" :src="srcFunc">
                        <img class="px-2 py-2 preloader" slot="preloader" src="../assets/image-loader.gif"/>
                        <div slot="error"><img class="px-2 py-2 picNotFound" src="../assets/picNotFound.jpg"></div>
                    </vue-load-image>
                    <i :class="markClass" class="add-marker" @click="clickAdd(spot)" style="position:absolute;z-index:1;padding:3px;"></i> 
                </div>
                <div class="info-col">
                    <div class="spot-header">
                        <a-tag class="main-tag" style="text-align:center;">{{category}}</a-tag>
                    </div>
                    <div class="name-container">   
                        <p class="p-name">{{spotIndex}}.<b>{{spot.name}}</b></p>
                    </div>
                    <p class="address">{{ getAddress() }}</p>
                    <div class="tags-row" v-if="sortBy === 'ig_post_num'">
                        <i class="fab fa-instagram"></i>
                        <div class="my-0 tags">
                            <el-tag
                                class="mx-1 el-tag"
                                v-for="(t, index) in spot.ig_tag"
                                :key="index" effect="plain" size="mini" @click="link('ig', t)">
                                #{{t}}
                            </el-tag> 
                        </div>
                        <!-- <i class="pt-1 fas fa-ellipsis-h" style="color:#db4e35"></i> -->
                    </div>
                    <a-tag v-if="sortBy === 'ig_post_num'" class="mt-2 ig-post-num-tag" color="#f50"><i class="fas fa-fire-alt"></i><b>   {{spot.ig_post_num}}</b> 次<b>TAG</b></a-tag>
                    <a-tag v-if="sortBy === 'checkins'" class="mt-2 fb-checkins-tag" color="#3b5998"><i class="fas fa-map-marker"></i><b>   {{spot.checkins}}</b> 次<b>打卡</b></a-tag>
                </div>
                <div class="edit-dropdown">
                    <a-dropdown :trigger="['click']">
                        <a class="ant-dropdown-link">
                            <i class="fas fa-info-circle"></i>
                        </a>
                        <a-menu slot="overlay">
                            <a-menu-item @click="link('pixnet')">
                                <i class="fab fa-blogger" style="color: #3b5998;"></i>  痞客幫
                            </a-menu-item>
                            <a-menu-item @click="link('wiki')">
                                <i class="fab fa-wikipedia-w"></i> Wiki頁面
                            </a-menu-item>
                            <a-menu-item @click="edit(spot)">
                                <i class="fas fa-cog"></i> 編輯景點資料
                            </a-menu-item>
                        </a-menu>
                    </a-dropdown> 
                </div>
            </div>
        </el-card>
    </div>
</template>

<script>

import {getAddress} from '../../utils/checker.js'
import VueLoadImage from 'vue-load-image'
export default {
    name: "SpotItem",
    components: {
        'vue-load-image': VueLoadImage
    },
    props: {
        spot: Object,
        index: Number,
        perPage: Number,
        currentPage: Number,
        sortBy: String,
        isInTogos: Boolean,
    },
    methods: {
        clickAdd: function(spot) {
            this.$emit('add-spot', spot);
        },
        getAddress: function(){
            return getAddress(this.spot.address)
        },
        link: function(type, tag) {
            let Url = '';
            let arr = {
                'ig': "https://ingram.life/tag/",
                'pixnet': 'https://www.pixnet.net/tags/',
                'wiki': 'https://zh.wikipedia.org/wiki/',
                'fb': ['https://www.facebook.com/search/top/?q=', '&epa=SEARCH_BOX']
            }
            let url = arr[type];
            if (typeof url === "string") {
                Url = url.concat(this.spot.name);
                
            } else if (typeof url === "object") {
                Url = url[0].concat(this.spot.name, url[1]);
            }

            if (type === 'ig' && this.spot.ig_tag[0] !== undefined){
                let ig_tag = this.spot.ig_tag;
                Url = url.concat(tag)
            }

            if (type === 'wiki' && this.spot.wiki_name !== null){
                Url = url.concat(this.spot.wiki_name);
            }

            if (type === 'wiki' && this.spot.wiki !== undefined){
                Url = this.spot.wiki;
            }
            this.$emit('show-link', Url);
        },
        edit(spot) {
            this.$emit('edit-form', this.spot);
        }
    },
    computed: {
        spotIndex: function() {
            return (this.index + 1) + (this.perPage * (this.currentPage - 1));
        },
        srcFunc: function() {
            let src;
            if(!Object.keys(this.spot).includes('images') || this.spot.images.length == 0) {
                src = this.notFound
            }
            else {
                src = this.spot.images[0]
            }
            return src  
        },
        category: function() {
            switch(this.spot.category) {
                case 'gourmet': return '美食'
                case 'scenic spot': return '景點'
                case 'transportation': return '交通'
                case 'shopping': return '購物'
                case 'lodging': return '住宿'
                case 'entertainment': return '娛樂'
            }
        },
        markClass: function() {
            if(this.isInTogos) return 'fas fa-bookmark';
        else {
            return 'far fa-bookmark';
        }
        }
    },
}
</script>

<style scoped>
    .spot-item-container {
        display: flex;
        flex-direction: row;
        color: #000000;
        height: 180px;
        margin-bottom: 10px;
        margin-left: 10px;
        margin-right: 10px;
    }
    .picture-container {
        width: 160px;
        height: 160px;
        display: flex;
        flex-direction: column;
    }
    .card-container {
        display: flex;
        flex-direction: row;
        width: 100%;
        height: auto;
    }
    .el-card {
        height: 100%;
        display: flex;
        width: 100%;
        
    }
    .el-card:hover {
        box-shadow: 0 0 12px #6e6868;
    }
    .spot-header {
        display: flex;
        flex-direction: row;
    }
    .spot-picture{
        width: 160px;
        height: 150px;
    }
    .preloader {
        width: 160px;
        height: 150px;
    }
    .picNotFound {
        width: 160px;
        height: 150px;
    }
    .tags-row {
        width: 100%;
        display: flex;
        flex-direction: row;
        justify-content: flex-start;
        overflow: hidden;
    }
    .tags {
        display: flex;
        flex-direction: row;
        justify-content: flex-start;
        overflow: hidden;
    }
    .main-tag {
        width: 50px;
    }
    .p-name {
        font-size:18px;
    }
    .name-container {
        width: 100%;
        display: flex;
        flex-wrap: nowrap;
        flex-direction: row;
        justify-content: space-between;
        align-self: flex-start;
    }
    .info-col {
        width: 65%;
        height: 100%;
        margin-left: 10px;
        overflow: hidden;
        display:flex;
        flex-direction: column;
    }
    .fa-plus-square {
        font-size: 25px;
        color:darkgray;
        cursor: pointer;
    }
    .fa-plus-square:hover {
        color:dimgray;
    }
    .fa-facebook-square {
        font-size: 30px;
        color:#3b5998;
        cursor: pointer;
    }
    .instagram {
        width:30px;
        height:30px;
        cursor: pointer;
    }
    .fa-bookmark {
        font-size: 25px;
        cursor: pointer;
        padding-right: 5px;
        color: #ffaa00;
        text-shadow: 0 0 3px white;
    }
    .fa-bookmark:hover {
        color:#eb8c34;
        transform: translateY(-3px);
    }

    .icons {
        width: 50%;
        display: flex;
        flex-direction: row;
        justify-content: space-between;
        padding-top: 3px;
        margin-top: 5px;
    }
    p {
        width: 100%;
        white-space:nowrap;
        overflow: hidden;
        text-overflow:ellipsis;
        height:1.5em;
    }
    p:hover {
        overflow:visible;
    }
    
    .address {
        font-size:12px;
    }
    .spot-tag {
        width: 50px;
    }
    .el-tag {
        font-size: 15px;
        height:auto;
        width: auto;
        background-color: #FFF;
        color: tomato;
        border: 1px solid tomato;
        transition: all 0.5s ease;
    }
    .el-tag:hover {
        cursor: pointer;
        background-color: tomato;
        color: #FFF;
    }
    .fa-info-circle {
        font-size: 20px;
        color:darkgrey;
    }
    .edit-dropdown {
        height: auto;
    }
    .ig-post-num-tag {
        width: 140px;
        font-size: 15px;
    }
    .fa-instagram {
        color: #db4e35;
        font-size: 22px;
    }
    .fb-checkins-tag {
        width: 140px;
        font-size: 15px;
    }
    .fa-ellipsis-h {
        display: none;
    }
  @media only screen and (max-width: 768px){
    .card-container {
        width: 100%;
        height: 100%;
    }
    .spot-item-container {
        height: 130px;
    }
    .info-col {
        width: 100%;
    }
    .name-container {
        width: 95%;
    }
    .p-name {
        font-size: 15px;
        margin-bottom: 0px;
    }
    .address {
        font-size:10px;
        margin: 0px;
    }
    .spot-picture {
        width: 100px;
        height: 90px;
    }
    .preloader {
        width: 100px;
        height: 90px;
    }
    .picNotFound {
        width: 100px;
        height: 90px;
    }
    span {
        width: 85%;
    }
    .icons {
        width: 100%;
        display: flex;
        flex-direction: row;
        justify-content: space-around;
        padding: 0px;
        align-self:flex-end;
    }
    .main-tag {
        width: 40px;
        font-size: 10px;
    }
    .fa-bookmark {
        font-size: 15px;
    }
    
    .fa-facebook-square {
        font-size: 20px;
        color:#3b5998;
        cursor: pointer;
    }
    .instagram {
        width:20px;
        height:20px;
        cursor: pointer;
    }
    .picture-container {
        height: 100px;
    }
    .fa-instagram {
        font-size: 15px;
    }
    .ig-post-num-tag {
        font-size: 10px;
    }
    .fb-checkins-tag {
        font-size: 10px;
    }
    .el-tag {
        font-size: 10px;
    }
    .add-marker {
        transition: all 0.4s ease;
    }
    .add-marker:hover {
        transform: translateY(-6px);
    }
}
@media only screen and (max-width: 767px){
    .tags {
        width: 100%;
    }
    .tags-row {
        margin-top:5px;
    }
    .fa-ellipsis-h {
        display: block;
    }
    .tags-row {
        display: none;
    }
}
</style>
