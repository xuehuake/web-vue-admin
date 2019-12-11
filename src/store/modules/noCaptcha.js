const state = {
  token: '',
  sessionId: '',
  sig: '',
  scene: ''
}
const mutations = {
  SET_DATA: (state, data) => {
    state.token = data.token || ''
    state.sessionId = data.csessionid || ''
    state.sig = data.sig || ''
    state.scene = data.scene || ''
  }
}

const actions = {
  setData({ commit }, data) {
    commit('SET_DATA', data)
  },
  // remove
  removeData({ commit }) {
    return new Promise(resolve => {
      commit('SET_DATA', {})
      resolve()
    })
  }

}

export default {
  namespaced: true,
  state,
  mutations,
  actions
}

