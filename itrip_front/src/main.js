import Vue from 'vue'
import Vuex from 'vuex'
import App from './App.vue'
import router from './router'
import { Icon }  from 'leaflet'
import VueLodash from 'vue-lodash'
import loadash from 'lodash'
import BootstrapVue from 'bootstrap-vue'
import 'bootstrap/dist/css/bootstrap.css'
import 'bootstrap-vue/dist/bootstrap-vue.css'
import 'leaflet/dist/leaflet.css'
import VModal from 'vue-js-modal'
import Vuetify from 'vuetify'
import store from './store'

Vue.use(Vuetify);
Vue.use(VueLodash ,loadash);

Vue.use(Vuex);

Vue.use(VModal);
Vue.use(VModal, { dynamic: true, dynamicDefaults: { clickToClose: false } });
Vue.use(VModal, { dynamic: true, injectModalsContainer: true });

delete Icon.Default.prototype._getIconUrl;

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
