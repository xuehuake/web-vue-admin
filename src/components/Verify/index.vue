<template>
  <div>
    <img :src="base64" @click="refreshCode">
  </div>
</template>
<script>
import { getVerifyCode } from '@/api/verify'
import { Message } from 'element-ui'
export default {
  name: 'ImageVCode',
  data() {
    return {
      base64: '',
      refreshTimeout: null
    }
  },
  activated() {

  },
  created() {
    const vm = this
    vm.refreshCode()
  },
  destroyed() {
    var vm = this
    clearTimeout(vm.refreshTimeout)
  },
  methods: {
    refreshCode() {
      var vm = this
      clearTimeout(vm.refreshTimeout)
      getVerifyCode().then(res => {
        vm.base64 = res.data.base64
        var now = Date.parse(new Date())
        var expireTime = Date.parse(new Date(res.data.expireTime))
        vm.refreshTimeout = setTimeout(() => {
          // 验证码过期
          Message({
            message: '滑动验证码过期,已为您刷新验证码',
            type: 'info',
            duration: 5 * 1000
          })
          vm.refreshCode()
        }, expireTime - now - 5000)
        console.log(`Image${vm.refreshTimeout}`)
      }).catch()
    }
  }
}
</script>
<style scoped>

</style>
