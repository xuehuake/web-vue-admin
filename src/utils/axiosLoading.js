import { Loading } from 'element-ui'
import lodash from 'lodash'

let needLoadingRequestCount = 0
let loading

function startLoading(text) {
  text = text || '加载中……'
  console.log(text)
  loading = Loading.service({
    lock: true,
    text: text,
    background: 'rgba(0, 0, 0, 0.7)'
  })
}

function endLoading() {
  loading.close()
}

const tryCloseLoading = () => {
  if (needLoadingRequestCount === 0) {
    endLoading()
  }
}

export function showFullScreenLoading(text) {
  if (needLoadingRequestCount === 0) {
    startLoading(text)
  }
  needLoadingRequestCount++
}

export function tryHideFullScreenLoading() {
  if (needLoadingRequestCount <= 0) return
  needLoadingRequestCount--
  if (needLoadingRequestCount === 0) {
    lodash.debounce(tryCloseLoading, 300)()
  }
}
