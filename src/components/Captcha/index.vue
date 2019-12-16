<template>
  <div>
    <!--No-Captcha渲染的位置，其中 class 中必须包含 nc-container-->
    <div id="captcha" class="nc-container" />
    <remote-js src="http://aeis.alicdn.com/sd/ncpc/nc.js?t=2015052012" />
  </div>
</template>
<script>
import { getNoCaptcha } from '@/api/verify'
export default {
  name: 'Captcha',
  components: {
    'remote-js': {
      render(createElement) {
        return createElement('script', { attrs: { type: 'text/javascript', src: this.src }})
      },
      props: {
        src: { type: String, required: true }
      }
    }
  },
  props: {
    width: {
      type: Number,
      default: 400
    }
  },
  data() {
    return {
      data: null
    }
  },
  created() {
    const vm = this
    vm.removeSession()
    var count = 0
    var interver = setInterval(() => {
      // eslint-disable-next-line
      if (count>=10|| typeof noCaptcha !== 'undefined') {
        clearInterval(interver)
        vm.init()
        return
      }
      count++
    }, 500)
  },
  activated() {

  },
  methods: {
    removeSession() {
      sessionStorage['noCaptcha-scene'] = ''
      sessionStorage['noCaptcha-sessionId'] = ''
      sessionStorage['noCaptcha-sig'] = ''
      sessionStorage['noCaptcha-token'] = ''
    },
    setData(data) {
      var { csessionid, scene, sig, token } = data
      sessionStorage['noCaptcha-scene'] = scene
      sessionStorage['noCaptcha-sessionId'] = csessionid
      sessionStorage['noCaptcha-sig'] = sig
      sessionStorage['noCaptcha-token'] = token
    },
    refresh() {
      const vm = this
      // eslint-disable-next-line
      __nc.reset()
      vm.removeSession()
    },
    init() {
      const vm = this
      getNoCaptcha().then(res => {
        vm.data = res.data
        var nc_token = vm.data.token
        var NC_Opt = {
          renderTo: '#captcha',
          appkey: vm.data.appKey,
          scene: vm.data.scene,
          token: nc_token,
          customWidth: vm.width,
          trans: { 'key1': 'code0' },
          elementID: ['usernameID'],
          is_Opt: 0,
          language: 'cn',
          isEnabled: true,
          timeout: 3000,
          times: 5,
          apimap: {

          },
          callback: function(data) {
            data.token = nc_token
            data.scene = vm.data.scene
            window.console && console.log(data)
            vm.setData(data)
          }
        }
        // eslint-disable-next-line
      var nc = new noCaptcha(NC_Opt)
        nc.upLang('cn', {
          _startTEXT: '请按住滑块，拖动到最右边',
          _yesTEXT: '验证通过',
          _error300: '哎呀，出错了，点击<a href="javascript:__nc.reset()">刷新</a>再来一次',
          _errorNetwork: '网络不给力，请<a href="javascript:__nc.reset()">点击刷新</a>'
        })
      }).catch()
    }
  }
}
</script>
<style scoped>

</style>
