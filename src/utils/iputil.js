import request from '@/utils/request'
/**
 * 获取内网ip
 */
function getUserIPAsync(callBack) {
  var RTCPeerConnection = window.RTCPeerConnection || window.webkitRTCPeerConnection || window.mozRTCPeerConnection
  if (RTCPeerConnection) {
    (() => {
      var rtc = new RTCPeerConnection()
      rtc.createDataChannel('') // 创建一个可以发送任意数据的数据通道
      rtc.createOffer(offerDesc => { // 创建并存储一个sdp数据
        rtc.setLocalDescription(offerDesc)
      }, e => { console.log(e) })
      rtc.onicecandidate = (evt) => { // 监听candidate事件
        if (evt.candidate) {
          var ip_addr = evt.candidate.address
          callBack(ip_addr)
        }
      }
    })()
  } else {
    console.log('暂不支持此浏览器')
    callBack('127.0.0.1')
  }
}
function getIPAsync() {
  return new Promise((resolve, reject) => {
    const MyPeerConnection = window.RTCPeerConnection || window.mozRTCPeerConnection || window.webkitRTCPeerConnection
    const pc = new MyPeerConnection({
      iceServers: []
    })
    const noop = () => {
    }
    const localIPs = {}
    const ipRegex = /([0-9]{1,3}(\.[0-9]{1,3}){3}|[a-f0-9]{1,4}(:[a-f0-9]{1,4}){7})/g
    const iterateIP = (ip) => {
      if (!localIPs[ip]) resolve(ip)
      localIPs[ip] = true
    }
    pc.createDataChannel('')
    pc.createOffer().then((sdp) => {
      sdp.sdp.split('\n').forEach(function(line) {
        if (line.indexOf('candidate') < 0) return
        line.match(ipRegex).forEach(iterateIP)
      })
      pc.setLocalDescription(sdp, noop, noop)
    }).catch((reason) => {
      reject(reason)
    })
    pc.onicecandidate = (ice) => {
      if (!ice || !ice.candidate || !ice.candidate.candidate || !ice.candidate.candidate.match(ipRegex)) return
      ice.candidate.candidate.match(ipRegex).forEach(iterateIP)
    }
  })
}

async function getIp() {
  try {
    if (sessionStorage.clientIp) {
      return sessionStorage.clientIp
    }
    const ip = await getIPAsync()
    sessionStorage.clientIp = ip
    return ip
  } catch (error) {
    return '127.0.0.111'
  }
}

async function getRemoteIp() {
  try {
    var res = await request({
      url: '/getIp',
      method: 'get',
      dataType: 'json'
    })
    return res.remote_addr
  } catch (error) {
    return '127.0.0.111'
  }
}

export default {
  getUserIPAsync,
  getIPAsync,
  getIp,
  getRemoteIp
}
