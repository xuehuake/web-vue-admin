import request from '@/utils/request'

export function getVerifyCode(ip) {
  var obj = {
    url: '/user/api/verify/ImgCaptcha',
    method: 'get',
    hideLoading: true,
    headers: {}
  }
  obj.headers['verify-ip'] = ip
  return request(obj)
}

export function getNoCaptcha(ip) {
  var obj = {
    url: '/user/api/verify/NoCaptcha',
    method: 'get',
    hideLoading: true,
    headers: {}
  }
  obj.headers['verify-ip'] = ip
  return request(obj)
}
