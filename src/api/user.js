import request from '@/utils/request'
import Qs from 'qs'
import JsEncrypt from 'jsencrypt/bin/jsencrypt'
import md5 from 'js-md5'
// import Base64 from 'js-base64'
import rsaData from '@/utils/secret/rsa'
import iputil from '@/utils/iputil'

export async function login(data) {
  const jse = new JsEncrypt()
  jse.setPublicKey(rsaData.pubKey) // 加入rsa public key
  const password = jse.encrypt(data.password)
  const userName = jse.encrypt(data.userName)
  const obj = {
    url: '/user/api/user/login',
    method: 'post',
    loadingText: '登录中...',
    noauth: true,
    data: {
      userName,
      password,
      vCode: data.vCode,
      sign: sign
    },
    headers: {}
  }
  obj.headers['verify-token'] = sessionStorage['verify-token'] || ''
  obj.headers['noCaptcha-scene'] = sessionStorage['noCaptcha-scene'] || ''
  obj.headers['noCaptcha-sessionId'] = sessionStorage['noCaptcha-sessionId'] || ''
  obj.headers['noCaptcha-sig'] = sessionStorage['noCaptcha-sig'] || ''
  obj.headers['noCaptcha-token'] = sessionStorage['noCaptcha-token'] || ''

  const ua = navigator.userAgent
  const ip = await iputil.getIp()
  const timestamp = Date.parse(new Date())
  // const IpAddr = await iputil.getRemoteIp()// window.returnCitySN.cip
  // const signStr = IpAddr + ',' + ip + '|' + ua + '|' + timestamp + '|' + data.userName + '|' + data.password
  const signStr = `${ua}|${timestamp}|${data.userName}|${data.password}|${data.vCode}`
  const sign = md5(signStr)

  obj.headers['login-ip'] = ip
  obj.headers['login-time'] = timestamp
  obj.headers['login-sign'] = sign

  return request(obj)
}
export function refresh_token(data) {
  return request({
    url: '/user/api/user/refresh_token',
    method: 'put',
    noauth: true,
    data: Qs.stringify(data)
  })
}
export function getInfo(token) {
  return request({
    url: '/user/api/user/current',
    method: 'get',
    params: { token },
    noCheck: true
  })
}

export async function logout() {
  try {
    var res = await request({
      url: '/user/api/user/logout',
      method: 'delete',
      loadingText: '退出登录...',
      noCheck: true,
      notTip: true
    })
    return res
  } catch (error) {
    return null
  }
}
