import request from '@/utils/request'
import Qs from 'qs'

export function AesEncrypt(data) {
  return request({
    url: '/aes/encrypt',
    method: 'post',
    data: Qs.stringify(data)
  })
}

export function AesDecrypt(data) {
  return request({
    url: '/aes/decrypt',
    method: 'post',
    data: Qs.stringify(data)
  })
}

export function DesEncrypt(data) {
  return request({
    url: '/des/encrypt',
    method: 'post',
    data: Qs.stringify(data)
  })
}

export function DesDecrypt(data) {
  return request({
    url: '/des/decrypt',
    method: 'post',
    data: Qs.stringify(data)
  })
}

export function GetPrivateKeyByPfx(data) {
  const fd = new FormData()
  fd.append('key', data.key)
  fd.append('file', data.file)
  return request({
    url: '/rsa/getPrivateKeyByPfx',
    method: 'post',
    data: fd
  })
}

export function GetPublicKeyByCert(data) {
  const fd = new FormData()
  fd.append('key', data.key)
  fd.append('file', data.file)
  return request({
    url: '/rsa/getPublicKeyByCert',
    method: 'post',
    data: fd
  })
}

export function GetRSAKeys() {
  return request({
    url: '/rsa/getRSAKeys',
    method: 'get'
  })
}

export function Sign(data) {
  return request({
    url: '/rsa/sign',
    method: 'post',
    data: Qs.stringify(data)
  })
}

export function Verify(data) {
  return request({
    url: '/rsa/verify',
    method: 'post',
    data: Qs.stringify(data)
  })
}

export function SignWithMd5(data) {
  return request({
    url: '/rsa/signWithMD5',
    method: 'post',
    data: Qs.stringify(data)
  })
}

export function VerifyWithMd5(data) {
  return request({
    url: '/rsa/verifyWithMD5',
    method: 'post',
    data: Qs.stringify(data)
  })
}

export function SignWithSHA1(data) {
  return request({
    url: '/rsa/signWithSHA1',
    method: 'post',
    data: Qs.stringify(data)
  })
}

export function VerifyWithSHA1(data) {
  return request({
    url: '/rsa/verifyWithSHA1',
    method: 'post',
    data: Qs.stringify(data)
  })
}
