import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex);

const localStoragePlugin = store => {
  store.subscribe((mutation, store) => {
    if (mutation.type === "AUTHORIZE") {
      window.localStorage.setItem("isAuthorized", JSON.stringify(store.isAuthorized));
    }
  });
};

export default new Vuex.Store({
  state: {
    isAuthorized: false,
    userId: ""
  },
  plugins: [localStoragePlugin],
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
    },
  }
});