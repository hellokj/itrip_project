<template>
  <div id="app">
    <Header v-if="!atHome" v-model="isAuthorized" v-on:search-click="Search" :editMode="editMode" :isLockedProp="isLocked" :atTrip="atTrip"/>
    <MobileHeader v-if="!atHome && $route.name != 'member'" class="mobileHeader"/>
    <TabletHeader v-if="!atHome && $route.name != 'member'" class="tabletHeader"/>
    <div id="nav"></div>
    <transition name="router-anim" enter-active-class="animated fadeIn" >
      <router-view :param="param" :region="region" :type="type" @search-click="Search" @edit-on="editOn" @is-locked-on="isLockedOn" @is-locked-off="isLockedOff"/>
    </transition>
    <loading :active.sync="isLoading" :is-full-page="true" loader="dots" :opacity="opacity">
    </loading>
  </div>
</template>

<script>
import VueLoading from 'vue-loading-overlay'
import 'vue-loading-overlay/dist/vue-loading.css'
import Header from './components/layout/Header'
import MobileHeader from './components/layout/MobileHeader'
import TabletHeader from './components/layout/TabletHeader'

export default {
  name:'app',
  components: {
    Header,
    MobileHeader,
    TabletHeader,
    loading: VueLoading
  },
  data() {
    return {
      togos: [],
      region: '',
      type: '',
      param: {},
      atHome: true,
      atTrip: false,
      isAuthorized: this.$store.state.isAuthorized,
      editMode: false,
      isLocked: false,
      isLoading: false,
      opacity: 0.3
    }
  },
  sockets: {
    connect() {
      console.log('socket connected');
    },
    reconnect(){
      console.log("socket reconnected");
    },
    disconnect() {
      // reload 會出事
      // console.log('you have been kicked by server');
      // this.$store.dispatch('updateAuthorized', false);
      // this.$store.dispatch("updateUserToken", "");
      // this.$store.dispatch('updateUserInfo', {});
      // FB.logout(function (response) {
      //   console.log('res when logout', response);
      // });
      // // 登出後導向首頁
      // this.$router.push({path: '/'});
    }
  },
  methods: {
    Search(para) {
      this.param = para;
    },
    connectionSuccess() {
      let token;
      if(this.$store.state.userToken.length == 0) {
        token = null;
      }
      else {
        token = this.$store.state.userToken;
      }
      this.$socket.emit('QQ', { token: token});
    },
    editOn() {
      this.editMode = true;
    },
    isLockedOn() {
      console.log("App: event isLockedOn")
      this.isLocked = true;
    },
    isLockedOff() {
      console.log("App: event isLockedOff")
      this.isLocked = false;
    }
  },
  created() {
    // 重新載入頁面不登出
    let status = window.localStorage.getItem('isAuthorized');
    let userToken = window.localStorage.getItem('userToken');
    let user = JSON.parse(window.localStorage.getItem('user'));
    console.log('User store', window.localStorage.getItem('user'));
    console.log("user", user)
    if (status == "true"){
      this.$store.dispatch('updateAuthorized', true);
      this.$store.dispatch('updateUserToken', userToken);
      this.$store.dispatch('updateUserInfo', user);
      
    }else{
      this.$store.dispatch('updateAuthorized', false);
      this.$store.dispatch('updateUserToken', "");
      this.$store.dispatch('updateUserInfo', null);
    }
  },
  mounted() {
    let vm = this;
    if (!vm.$store.state.isAuthorized){
      //login
      FB.AppEvents.logPageView();
      //Get FB Login Status
      FB.getLoginStatus(response => {
        vm.statusChangeCallback(response);
      });
    };
    this.connectionSuccess();
    let self = this;
    // 註冊loading bus
    this.$bus.$on('loading', event => {
      let duration;
      if(event.duration === undefined) {
        duration = 2000;
      }
      else {
        duration = event.duration;
      }
      this.isLoading = true;
      if(this.isLoading) {
        setTimeout(() => {
          self.isLoading = false;
        }, duration);
      }
    });
    // 註冊socket on
    this.$socket.on('notifyCreateTripMessage', event => {
      let message = event.message;
      self.$notify({
          message: message,
          type: 'success'
      });
    })
  },
  watch: {
    $route (to, from){
        // console.log(to);
        if (to.name === "home") {
          this.atHome = true;
        } else {
          this.atHome = false;
        }

        if (to.name === "trip") this.atTrip = true;
        else this.atTrip = false;
    },
    isAuthorized() {
      console.log(this.isAuthorized)
    }
  }
}
</script>
<style scoped>
@import "https://cdn.jsdelivr.net/npm/animate.css@3.5.1";
@import url("https://fonts.googleapis.com/css?family=Noto+Serif+TC&display=swap");
/* @font-face {
  font-family: logoFont;
  src
} */
* {
    box-sizing: border-box;
    margin: 0;
    padding: 0;
    font-family: 'Noto Sans TC', sans-serif;;
    overflow-x: hidden;
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

