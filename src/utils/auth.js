import store from '@/store'
import { refresh_token } from '@/api/user'
import { sleep } from '@/utils/index'

var refreshing = false // 刷新token锁
export async function getToken() {
  var token = ''
  var userToken = store.getters.userToken
  if (userToken && userToken.expiresTime && userToken.access_token) { // token信息存在
    var now = new Date()
    if (now > new Date(userToken.expiresTime)) { // 如果token过期
      if (userToken.refresh_token) {
        const refreshSucc = await refreshToken()
        if (refreshSucc) { // 刷新token成功
          userToken = store.getters.userToken
          token = userToken.token_type + ' ' + userToken.access_token
        }
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
    if (!userToken || !userToken.refresh_token) { // 若无refresh_token
      console.log('refresh_token不存在')
      return false
    }
    var now = new Date()
    if (userToken && userToken.access_token && userToken.expiresTime && now < new Date(userToken.expiresTime)) {
      // 已经刷新token无需再刷新
      return true
    }
    refreshing = true
    setTimeout(function() {
      refreshing = false// 防止锁死
    }, 15000)
    try {
      var res = await refresh_token({
        refresh_token: userToken.refresh_token
      })
      refreshing = false
      await store.dispatch('user/refreshUsertoken', res.data)
      return true
    } catch (error) {
      refreshing = false
      store.dispatch('user/refreshUsertoken', null)// 清空token信息
      return false
    }
  } else {
    await sleep(800)// 等待800毫秒再试
    return await refreshToken()
  }
}
