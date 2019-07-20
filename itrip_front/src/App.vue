<template>
  <div id="app">
    <Header v-if="!atHome" v-model="isAuthorized" v-on:search-click="Search"/>
    <MobileHeader v-if="!atHome" class="mobileHeader"/>
    <div id="nav"></div>
    <router-view :param="param" :region="region" :type="type"/>
  </div>
</template>

<script>
import Header from './components/layout/Header'
import MobileHeader from './components/layout/MobileHeader'

export default {
  name:'app',
  components: {
    Header,
    MobileHeader,
  },
  data() {
    return {
      togos: [],
      region: '',
      type: '',
      param: {},
      mobileMode: false,
      windowWidth: 0,
      atHome: true
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
    windowWidth: function(newVal) {
      if(newVal <= 780) {
        this.mobileMode = true;
      }
      else {
        this.mobileMode = false;
      }
    },
    $route (to, from){
        console.log(to);
        if (to.name === "home") {
          this.atHome = true;
        } else {
          this.atHome = false;
        }
    }
  }
}
</script>
<style scoped>
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
    font-family: Arial, Helvetica, sans-serif;
    line-height: 1.4;
  }

  .mobileHeader {
      display: none;
    }

  @media only screen and (max-width: 768px) {
    .mobileHeader {
      display: flex;
      justify-content: center;
      }
    }
  .modal {
    width: 40%;
    height: auto;
    text-align: center;
  }
</style>
