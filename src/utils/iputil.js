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

export default {
  getUserIPAsync
}
