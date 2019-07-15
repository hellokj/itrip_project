import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex);

const localStoragePlugin = store => {
  store.subscribe((mutation, store) => {
    if (mutation.type === "AUTHORIZE") {
      window.localStorage.setItem("isAuthorized", JSON.stringify(store.isAuthorized));
    }
    if (mutation.type === "TOKEN") {
      window.localStorage.setItem("userToken", String(store.userToken));
    }
  });
};

export default new Vuex.Store({
  state: {
    isAuthorized: false,
    user: {
      id: "",
      name: "",
      email: "",
      url: ""
    },
    userToken: ""
  },
  plugins: [localStoragePlugin],
  actions: {
    updateAuthorized(context, status) {
      context.commit('AUTHORIZE', status);
    },
    updateUserInfo(context, user){
      context.commit('LOGIN', user);
    },
    updateUserToken(context, userToken){
      context.commit('TOKEN', userToken);
    }
  },
  mutations: {
    AUTHORIZE(state, status) {
      state.isAuthorized = status;
    },
    LOGIN(state, user){
      state.user = user;
    },
    TOKEN(state, userToken){
      state.userToken = userToken;
    }
  }
});