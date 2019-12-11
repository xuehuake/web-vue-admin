import createPersistedState from 'vuex-persistedstate'
import Vue from 'vue'
import Vuex from 'vuex'
import getters from './getters'
import app from './modules/app'
import settings from './modules/settings'
import user from './modules/user'
import verify from './modules/verify'
import noCaptcha from './modules/noCaptcha'

Vue.use(Vuex)

const store = new Vuex.Store({
  plugins: [createPersistedState()],
  modules: {
    app,
    settings,
    user,
    verify,
    noCaptcha
  },
  getters
})

export default store
