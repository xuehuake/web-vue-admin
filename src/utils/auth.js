import store from '@/store'
import { refresh_token } from '@/api/user'

var refreshing = false
export async function getToken() {
  var token = ''
  var userToken = store.getters.userToken
  if (userToken && userToken.expiresTime && userToken.access_token) {
    var now = new Date()
    if (now > new Date(userToken.expiresTime)) {
      // 如果token过期
      if (userToken.refresh_token) {
        await refreshToken()
        userToken = store.getters.userToken
        token = userToken.token_type + ' ' + userToken.access_token
      }
    } else {
      token = userToken.token_type + ' ' + userToken.access_token
    }
  }
  return token
}

export async function refreshToken() {
  if (!refreshing) {
    var userToken = store.getters.userToken
    var now = new Date()
    if (userToken && userToken.access_token && userToken.expiresTime && now < new Date(userToken.expiresTime)) {
      // 已经刷新token无需再刷新
      return true
    }
    refreshing = true
    setTimeout(function() {
      refreshing = false
    }, 1000)
    try {
      var res = await refresh_token({
        refresh_token: userToken.refresh_token
      })
      await store.dispatch('user/refreshUsertoken', res.data)
      return true
    } catch (error) {
      store.dispatch('user/refreshUsertoken', null)
    }
  }
  return false
}
