<template>
  <div>
    <img :src="base64" @click="refreshCode">
  </div>
</template>
<script>
import { getVerifyCode } from '@/api/verify'
export default {
  name: 'ImageVCode',
  data() {
    return {
      base64: ''
    }
  },
  activated() {
  },
  created() {
    const vm = this
    vm.refreshCode()
  },
  methods: {
    refreshCode() {
      var vm = this
      getVerifyCode().then(res => {
        vm.base64 = res.data.base64
        sessionStorage['verify-createTime'] = res.data.createTime
        sessionStorage['verify-expireTime'] = res.data.expireTime
        sessionStorage['verify-token'] = res.data.token
      }).catch()
    }
  }
}
</script>
<style scoped>

</style>
