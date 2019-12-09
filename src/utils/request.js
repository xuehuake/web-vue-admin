import axios from 'axios'
import { MessageBox, Message } from 'element-ui'
import { showFullScreenLoading, tryHideFullScreenLoading } from '@/utils/axiosLoading'
import store from '@/store'
import { getToken } from '@/utils/auth'

// create an axios instance
const service = axios.create({
  baseURL: process.env.VUE_APP_BASE_API, // url = base url + request url
  // withCredentials: true, // send cookies when cross-domain requests
  timeout: 5000 // request timeout
})

// request interceptor
service.interceptors.request.use(
  config => {
    if (store.getters.token) {
      config.headers['X-Token'] = getToken()
    }

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
    return config
  },
  error => {
    console.log(error) // for debug
    return Promise.reject(error)
  }
)

// response interceptor
service.interceptors.response.use(
  response => {
    tryHideFullScreenLoading()
    const res = response.data
    // if the custom code is not 20000, it is judged as an error.
    if (res.code !== 20000 && res.Result !== 0) {
      Message({
        message: res.Message || 'Error',
        type: 'error',
        duration: 5 * 1000
      })

      // 50008: Illegal token; 50012: Other clients logged in; 50014: Token expired;
      if (res.code === 50008 || res.code === 50012 || res.code === 50014) {
        // to re-login
        MessageBox.confirm('You have been logged out, you can cancel to stay on this page, or log in again', 'Confirm logout', {
          confirmButtonText: 'Re-Login',
          cancelButtonText: 'Cancel',
          type: 'warning'
        }).then(() => {
          store.dispatch('user/resetToken').then(() => {
            location.reload()
          })
        })
      }
      return Promise.reject(new Error(res.message || 'Error'))
    } else {
      return res
    }
  },
  error => {
    tryHideFullScreenLoading()
    console.log('err' + error) // for debug
    Message({
      message: error.message,
      type: 'error',
      duration: 5 * 1000
    })
    return Promise.reject(error)
  }
)

export default service
