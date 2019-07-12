import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex);

export default new Vuex.Store({
  state: {
    isAuthorized: false,
    
  },
  actions: {
    updateAuthorized(context, status) {
      context.commit('AUTHORIZE', status);
    }
  },
  mutations: {
    AUTHORIZE(state, status) {
      state.isAuthorized = status;
    }
  }
});