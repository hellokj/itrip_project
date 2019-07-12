import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex);

export default new Vuex.Store({
  state: {
    isAuthorized: false,
    userId: ""
  },
  actions: {
    updateAuthorized(context, status) {
      context.commit('AUTHORIZE', status);
    },
    updateUserInfo(context, userId){
      context.commit('LOGIN', userId);
    }
  },
  mutations: {
    AUTHORIZE(state, status) {
      state.isAuthorized = status;
    },
    LOGIN(state, userId){
      state.userId = userId;
    }

  }
});