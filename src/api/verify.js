import request from '@/utils/request'
import iputil from '@/utils/iputil'
import md5 from 'js-md5'

async function getIp() {
  try {
    if (sessionStorage.clientIp) {
      return sessionStorage.clientIp
    }
    const ip = await iputil.getIPAsync()
    sessionStorage.clientIp = ip
    return ip
  } catch (error) {
    return '127.0.0.111'
  }
}

export async function getVerifyCode() {
  var obj = {
    url: '/user/api/verify/ImgCaptcha',
    method: 'get',
    hideLoading: true,
    noauth: true,
    headers: {}
  }
  const ua = navigator.userAgent
  const ip = await getIp()
  const timestamp = Date.parse(new Date())
  const signStr = ip + '|' + ua + '|' + timestamp
  const sign = md5(signStr)
  obj.headers['verify-ip'] = ip
  obj.headers['verify-time'] = timestamp
  obj.headers['verify-sign'] = sign

  var res = await request(obj)
  sessionStorage['verify-createTime'] = res.data.createTime
  sessionStorage['verify-expireTime'] = res.data.expireTime
  sessionStorage['verify-token'] = res.data.token
  return res
}

export async function getNoCaptcha() {
  var obj = {
    url: '/user/api/verify/NoCaptcha',
    method: 'get',
    hideLoading: true,
    noauth: true,
    headers: {}
  }
  const ua = navigator.userAgent
  const ip = await getIp()
  const timestamp = Date.parse(new Date())
  const signStr = ip + '|' + ua + '|' + timestamp
  const sign = md5(signStr)
  obj.headers['verify-ip'] = ip
  obj.headers['verify-time'] = timestamp
  obj.headers['verify-sign'] = sign
  var res = await request(obj)
  sessionStorage['noCaptcha-token'] = res.data.token
  sessionStorage['noCaptcha-pass'] = false
  return res
}
