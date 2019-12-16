import { resetRouter } from '@/router'
import { logout } from '@/api/user'
import dateUtil from '@/utils/date'
const state = {
  userToken: {
    access_token: '',
    expires_in: 0,
    createDateTime: null,
    expiresTime: null,
    refresh_token: '',
    scope: '',
    token_type: '',
    jti: ''
  },
  userInfo: {
    name: '',
    avatar: ''
  }
}

const mutations = {
  SET_USERTOKEN: (state, data) => {
    const { access_token, expires_in, refresh_token, scope, token_type, jti } = data
    var createDateTime = new Date()
    var expiresTime = dateUtil.DateAdd('s', expires_in - 60, createDateTime)
    state.userToken = { access_token, expires_in, refresh_token, scope, token_type, jti, createDateTime, expiresTime }
  },
  SET_USERINFO: (state, data) => {
    const { name, avatar } = data
    state.userInfo = { name, avatar }
  },
  CLEARINFO: (state) => {
    state.userToken = {}
    state.userInfo = {}
  }
}

const actions = {
  setUsertoken({ commit }, data) {
    commit('SET_USERTOKEN', data)
  },
  setUserInfo({ commit }, data) {
    commit('SET_USERINFO', data)
  },
  // user login
  login({ commit }, data) {
    data.avatar = 'https://wpimg.wallstcn.com/f778738c-e4f8-4870-b634-56703b4acafe.gif'
    commit('SET_USERTOKEN', data)
    commit('SET_USERINFO', data)
  },
  // user logout
  logout({ commit, state }) {
    commit('CLEARINFO')
    return new Promise((resolve, reject) => {
      logout(state.token).then(() => {
        resetRouter()
        resolve()
      }).catch(error => {
        // reject(error)
        console.log(error)
        resolve()
      })
    })
  }
}

export default {
  namespaced: true,
  state,
  mutations,
  actions
}

