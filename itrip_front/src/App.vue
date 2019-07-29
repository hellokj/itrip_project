<template>
  <div id="app">
    <Header v-if="!atHome" v-model="isAuthorized" v-on:search-click="Search"/>
    <MobileHeader v-if="!atHome" class="mobileHeader"/>
    <TabletHeader v-if="!atHome" class="tabletHeader"/>
    <div id="nav"></div>
    <transition name="router-anim" enter-active-class="animated fadeIn" >
      <router-view :param="param" :region="region" :type="type" @search-click="Search"/>
    </transition>
  </div>
</template>

<script>
import Header from './components/layout/Header'
import MobileHeader from './components/layout/MobileHeader'
import TabletHeader from './components/layout/TabletHeader'

export default {
  name:'app',
  components: {
    Header,
    MobileHeader,
    TabletHeader
  },
  data() {
    return {
      togos: [],
      region: '',
      type: '',
      param: {},
      atHome: true,
      isAuthorized: this.$store.state.isAuthorized,
    }
  },
  methods: {
    Search(para) {
      this.param = para;
    },
  },
  created() {
    // 重新載入頁面不登出
    let status = window.localStorage.getItem('isAuthorized');
    let userToken = window.localStorage.getItem('userToken');
    if (status == "true"){
      this.$store.dispatch('updateAuthorized', true);
      this.$store.dispatch('updateUserToken', userToken);
    }else{
      this.$store.dispatch('updateAuthorized', false);
      this.$store.dispatch('updateUserToken', "");
    }
  },
  mounted() {
    let vm = this;
    window.fbAsyncInit = function () {
        FB.init({
          appId: "2353529008088124",
          xfbml: true,
          status: true,
          cookie: true,
          autoLogAppEvents: true,
          version: "v3.3"
        });
      };
    if (!vm.$store.state.isAuthorized){
      //login
      FB.AppEvents.logPageView();
      //Get FB Login Status
      FB.getLoginStatus(response => {
        vm.statusChangeCallback(response);
      });
    }
  },
  watch: {
    $route (to, from){
        // console.log(to);
        if (to.name === "home") {
          this.atHome = true;
        } else {
          this.atHome = false;
        }
    },
  }
}
</script>
<style scoped>
@import "https://cdn.jsdelivr.net/npm/animate.css@3.5.1";

@font-face {
  font-family: logoFont;
  src: url(/../assets/Noto_Serif_TC/NotoSerifTC-Medium.otf);
}

* {
    box-sizing: border-box;
    margin: 0;
    padding: 0;
    font-family: logoFont;
  }

  .btn {
    display: inline-block;
    border: none;
    background: #555;
    color:#fff;
    padding: 7px 20px;
    cursor: pointer;
  }

  body {
    margin: 0;
    padding: 0;
    font-family: Arial, Helvetica, sans-serif;
    line-height: 1.4;
  }

  .mobileHeader {
    display: none;
  }
  .tabletHeader {
    display: none;
  }

  .modal {
    width: 40%;
    height: auto;
    text-align: center;
  }
  @media only screen and (max-width: 767px) {
    .mobileHeader {
      display: flex;
      justify-content: center;
    }
  }
   @media only screen and (min-width: 768px) and (max-width: 1024px) {
     .tabletHeader {
      display: flex;
      justify-content: center;
    }
   }


</style>
