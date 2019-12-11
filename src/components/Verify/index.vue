<template>
  <div>
    <img :src="base64" @click="refreshCode">
  </div>
</template>
<script>
import { getVerifyCode } from '@/api/verify'
import IpUtil from '@/utils/iputil'
export default {
  name: 'ImageVCode',
  data() {
    return {
      base64: '',
      userIp: '127.0.0.1'
    }
  },
  activated() {
  },
  created() {
    const vm = this
    IpUtil.getUserIPAsync(ip => {
      console.log(ip)
      vm.userIp = ip
      vm.refreshCode()
    })
  },
  methods: {
    refreshCode() {
      var vm = this
      getVerifyCode(vm.userIp).then(res => {
        vm.base64 = res.data.base64
        this.$store.dispatch('verify/setVerify', res.data)
      }).catch()
    }
  }
}
</script>
<style scoped>

</style>
