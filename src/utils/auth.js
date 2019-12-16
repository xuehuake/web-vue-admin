import store from '@/store'
import { refresh_token } from '@/api/user'

var refreshing = false
export function getToken() {
  var token = ''
  var userToken = store.getters.userToken
  if (userToken && userToken.expiresTime && userToken.access_token) {
    var now = new Date()
    if (now > new Date(userToken.expiresTime)) {
      // 如果token过期
      if (userToken.refresh_token) {
        refreshToken()
      }
    } else {
      token = userToken.token_type + ' ' + userToken.access_token
    }
  }
  return token
}

export function refreshToken(config) {
  return new Promise((resolve, reject) => {
    var userToken = store.getters.userToken
    if (!refreshing) {
      refreshing = true
      refresh_token({
        refresh_token: userToken.refresh_token
      }).then(res => {
        debugger
        store.dispatch('user/setUsertoken', res.data)
        resolve(res.data)
      }).catch(err => {
        debugger
        store.dispatch('user/setUsertoken', {})
        reject(err)
      })
      setTimeout(function() {
        refreshing = false
      }, 1000)
    }
  })
}
