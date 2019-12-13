import { resetRouter } from '@/router'
import { logout, refresh_token } from '@/api/user'
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
    jti: '',
    Authorization: ''
  },
  userInfo: {
    name: '',
    avatar: ''
  }
}

const mutations = {
  SET_USERTOKEN: (state, data) => {
    const { access_token, expires_in, refresh_token, scope, token_type, jti, Authorization } = data
    var createDateTime = new Date()
    var expiresTime = dateUtil.DateAdd('s', expires_in - 60, createDateTime)
    state.userToken = { access_token, expires_in, refresh_token, scope, token_type, jti, createDateTime, expiresTime, Authorization }
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
  },
  getAccessToken({ commit, state }) {
    var token = ''
    if (state.userToken && state.userToken.expiresTime && state.userToken.access_token) {
      var now = new Date()
      if (now > new Date(state.userToken.expiresTime)) {
        commit('SET_USERTOKEN', {})
        if (state.userToken.refresh_token) {
          refresh_token({
            refresh_token: state.userToken.refresh_token
          }).then(res => {

          }).catch(err => {
            console.log(err)
            commit('SET_USERTOKEN', {})
          })
        }
      } else {
        token = state.userToken.token_type + ' ' + state.userToken.access_token
        state.userToken.Authorization = token
        commit('SET_USERTOKEN', state.userToken)
      }
    }
    return token
  }
}

export default {
  namespaced: true,
  state,
  mutations,
  actions
}

