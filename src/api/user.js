import request from '@/utils/request'
import Qs from 'qs'

export function login(data) {
  const obj = {
    url: '/user/api/user/login',
    method: 'post',
    loadingText: '登录中...',
    data,
    headers: {}
  }
  obj.headers['verify-token'] = sessionStorage['verify-token'] || ''
  obj.headers['noCaptcha-scene'] = sessionStorage['noCaptcha-scene'] || ''
  obj.headers['noCaptcha-sessionId'] = sessionStorage['noCaptcha-sessionId'] || ''
  obj.headers['noCaptcha-sig'] = sessionStorage['noCaptcha-sig'] || ''
  obj.headers['noCaptcha-token'] = sessionStorage['noCaptcha-token'] || ''
  return request(obj)
}
export function refresh_token(data) {
  return request({
    url: '/user/api/user/refresh_token',
    method: 'put',
    data: Qs.stringify(data)
  })
}
export function getInfo(token) {
  return request({
    url: '/user/api/user/current',
    method: 'get',
    params: { token }
  })
}

export function logout() {
  return request({
    url: '/user/api/user/logout',
    method: 'delete',
    loadingText: '退出登录',
    notTip: true
  })
}
