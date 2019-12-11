const state = {
  token: '',
  createTime: '',
  expireTime: ''
}
const mutations = {
  SET_VERIFY: (state, data) => {
    state.token = data.token
    state.createTime = data.createTime
    state.expireTime = data.expireTime
  }, RESET_VERIFY: (state) => {
    state.token = ''
    state.createTime = ''
    state.expireTime = ''
  }
}

const actions = {
  setVerify({ commit }, data) {
    commit('SET_VERIFY', data)
  },
  // remove token
  resetVerify({ commit }) {
    commit('RESET_VERIFY')
  }

}

export default {
  namespaced: true,
  state,
  mutations,
  actions
}

