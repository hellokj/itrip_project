import App from './App.vue'
import router from './router'
import { Icon }  from 'leaflet'
import lang from 'element-ui/lib/locale/lang/en'
import locale from 'element-ui/lib/locale'
import BootstrapVue from 'bootstrap-vue'
import 'bootstrap/dist/css/bootstrap.css'
import 'bootstrap-vue/dist/bootstrap-vue.css'
import 'leaflet.awesome-markers/dist/leaflet.awesome-markers.css'
import 'leaflet.awesome-markers/dist/leaflet.awesome-markers.js'
import 'leaflet-fullscreen/dist/leaflet.fullscreen.css';
import 'leaflet-fullscreen/dist/Leaflet.fullscreen';
import VModal from 'vue-js-modal'
import store from './store'
import eventBus from '../utils/eventBus.js'
import {MediaQueries} from 'vue-media-queries'
import SocialSharing from 'vue-social-sharing'
import VueSocketio from 'vue-socket.io-extended';
import io from 'socket.io-client';
import Antd from 'ant-design-vue';
import 'ant-design-vue/dist/antd.css'


Vue.use(VueSocketio, io('https://35.194.247.229:4000'));

//Vue.use(VueSocketio, socketio('ws://'));
//import emailjs from 'emailjs-com';

const mediaQueries = new MediaQueries();
Vue.use(mediaQueries);
Vue.use(Antd);
Vue.use(SocialSharing);
//Vue.use(emailjs);
// configure language
locale.use(lang)
Vue.use(VModal);
Vue.use(VModal, { dynamic: true, dynamicDefaults: { clickToClose: false } });
Vue.use(VModal, { dynamic: true, injectModalsContainer: false });

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
  data() {
    return {
      bus: eventBus
    }
  },
  router,
  store,
  mediaQueries: mediaQueries,
  render: h => h(App)
}).$mount('#app')
Vue.use(VModal, { dynamic: true, dynamicDefaults: { clickToClose: false } })