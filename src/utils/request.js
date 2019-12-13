import axios from 'axios'
import { Message } from 'element-ui'
import { showFullScreenLoading, tryHideFullScreenLoading } from '@/utils/axiosLoading'
import store from '@/store'

// create an axios instance
const service = axios.create({
  baseURL: process.env.VUE_APP_BASE_API, // url = base url + request url
  // withCredentials: true, // send cookies when cross-domain requests
  timeout: 5000 // request timeout
})

// request interceptor
service.interceptors.request.use(
  config => {
    if (!config.noauth) {
      store.dispatch('user/getAccessToken')
      if (store.getters.token) {
        config.headers['Authorization'] = store.getters.token
      }
    }
    if (store.getters.noCaptcha.token) { // 滑块验证码
      config.headers['noCaptcha-scene'] = store.getters.noCaptcha.scene
      config.headers['noCaptcha-sessionId'] = store.getters.noCaptcha.sessionId
      config.headers['noCaptcha-sig'] = store.getters.noCaptcha.sig
      config.headers['noCaptcha-token'] = store.getters.noCaptcha.token
    }
    if (store.getters.verify.token) { // 图形验证码
      if (store.getters.verify.expireTime && new Date(store.getters.verify.expireTime) > new Date()) {
        config.headers['verify-token'] = store.getters.verify.token
      }
    }
    if (config.loadingText) {
      showFullScreenLoading(config.loadingText)
    } else if (!config.hideLoading) {
      let loadingText = ''
      switch (config.method) {
        case 'get':
        case 'post':
          loadingText = '正在请求……'
          break
        case 'put':
          loadingText = '数据提交中……'
          break
        case 'delete':
          loadingText = '数据删除中……'
          break
      }
      showFullScreenLoading(loadingText)
    }

    return config
  },
  error => {
    console.log(error) // for debug
    tryHideFullScreenLoading()
    return Promise.reject(error)
  }
)

// response interceptor
service.interceptors.response.use(
  response => {
    tryHideFullScreenLoading()
    const res = response.data
    // if the custom code is not 20000, it is judged as an error.
    if (res.code !== 200) {
      Message({
        message: res.message || 'Error',
        type: 'error',
        duration: 5 * 1000
      })
      return Promise.reject(new Error(res.message || 'Error'))
    } else {
      return res
    }
  },
  error => {
    tryHideFullScreenLoading()
    console.log('err' + error) // for debug
    if (!error.config || !error.config.notTip) {
      Message({
        message: error.message,
        type: 'error',
        duration: 5 * 1000
      })
    }
    return Promise.reject(error)
  }
)

export default service
