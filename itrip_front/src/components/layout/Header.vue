<template>
    <header class="header">
        <div class="logo">
            <img src="./logo.png" alt="iTripLogo">
        </div>
        <div class="btns">
            <!-- Select Type -->
            <div>
                <b-form-input ref="type" @click="selectTypeText()" v-model="selected_type" @keyup.enter="$emit('search-click', selected_type, selected_region)" class="input_type" placeholder="雙心石滬" list="my-list-id1"></b-form-input>
                <datalist id="my-list-id1">
                    <!-- Change types -->
                    <option v-bind:key="type" v-for="type in types">{{ type }}</option>
                </datalist>
            </div>
            <div>
                <b-form-input ref="region" @click="selectRegionText()"  @keyup.enter="$emit('search-click', selected_type, selected_region)" v-model="selected_region" class="input_region" placeholder="台北市" list="my-list-id2"></b-form-input>
                <datalist id="my-list-id2">
                    <option v-bind:key="region" v-for="region in regions">{{ region }}</option>
                </datalist>
            <!-- Select Region -->
            </div>
            <img class="icon_search" src="../icons/search.svg" @click="$emit('search-click',selected_type, selected_region)">

            <div class="div_trip">
                <router-link to="/trip">旅遊</router-link>
            </div>
            <div class="div_home">
                <router-link to="/">首頁</router-link> 
            </div>
            <div class="div_login">
                <router-link to="/about">登入</router-link>
            </div>
        </div>
      
    </header>
</template>

<script>
export default {
    name: "Header",
    data() {
      return {
        selected_type: '',
        selected_region: '',
        regions: ['臺北市', '新北市', '基隆市', '宜蘭縣', '花蓮縣', '臺東縣', '桃園市', '新竹縣' ,'苗栗縣', '臺中市', '彰化縣', '南投縣', '雲林縣', '嘉義縣', '臺南市', '高雄市', '屏東縣', '澎湖縣', '金門縣'],
        types: ['美食', '購物', '景點', '交通', '住宿', '娛樂']
      }
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
        margin-left: -30px;
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

    .logo {
        margin-top:10px;
        margin-left: 50px;
    }


    ::-ms-b-form-input-placeholder { /* Microsoft Edge */
        color: red;
    }
    

</style>