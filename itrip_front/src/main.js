import Vue from 'vue'
import Vuex from 'vuex'
import App from './App.vue'
import router from './router'
import { Icon }  from 'leaflet'

import ElementUI from 'element-ui';
import 'element-ui/lib/theme-chalk/index.css';
import lang from 'element-ui/lib/locale/lang/en'
import locale from 'element-ui/lib/locale'

import BootstrapVue from 'bootstrap-vue'
import 'bootstrap/dist/css/bootstrap.css'
import 'bootstrap-vue/dist/bootstrap-vue.css'
import 'leaflet/dist/leaflet.css'
import 'leaflet.awesome-markers/dist/leaflet.awesome-markers.css'
import 'leaflet.awesome-markers/dist/leaflet.awesome-markers.js'
import '@fortawesome/fontawesome-free/css/all.css'
import VModal from 'vue-js-modal'
import Vuetify from 'vuetify'
import store from './store'

Vue.use(Vuetify);
Vue.use(ElementUI);
// configure language
locale.use(lang)
Vue.use(Vuex);

Vue.use(VModal);
Vue.use(VModal, { dynamic: true, dynamicDefaults: { clickToClose: false } });
Vue.use(VModal, { dynamic: true, injectModalsContainer: true });

delete Icon.Default.prototype._getIconUrl;

(function (d, s, id) {
  var js,
  fjs = d.getElementsByTagName(s)[0];
  if (d.getElementById(id)) return;
  js = d.createElement(s);
  js.id = id;
  js.src = "https://connect.facebook.net/zh_TW/sdk.js#xfbml=1&version=v3.3";
  fjs.parentNode.insertBefore(js, fjs);
  })(document, "script", "facebook-jssdk");


Icon.Default.mergeOptions({
  iconRetinaUrl: require('leaflet/dist/images/marker-icon-2x.png'),
  iconUrl: require('leaflet/dist/images/marker-icon.png'),
  shadowUrl: require('leaflet/dist/images/marker-shadow.png')
});


Vue.config.productionTip = false
Vue.use(BootstrapVue)
new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')
