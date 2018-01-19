import Vuex from 'vuex'
import Vue from 'vue'
import invoice from './modules/invoice'
Vue.use(Vuex)
const store = new Vuex.Store({
  state: {
    userInfo: sessionStorage.userInfo && JSON.parse(sessionStorage.userInfo) || {}
  },
  mutations: {
    updateUserInfo(state) {
      state.userInfo = sessionStorage.userInfo && JSON.parse(sessionStorage.userInfo) || {}
      state.isShowLogin = false
    }
  },
  modules: {
    invoice
  }
})

export default store
