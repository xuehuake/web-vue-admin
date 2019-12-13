import request from '@/utils/request'

export function login(data) {
  return request({
    url: '/user/api/user/login',
    method: 'post',
    data
  })
}
export function refresh_token(data) {
  return request({
    url: '/user/api/user/refresh_token',
    method: 'post',
    data
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
