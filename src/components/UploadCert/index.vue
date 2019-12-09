<template>
  <div>
    <input ref="cert-upload-input" class="cert-upload-input" type="file" accept=".cert, .pfx" @change="handleClick">
    <div class="drop" @drop="handleDrop" @dragover="handleDragover" @dragenter="handleDragover">
      <label v-text="name" />
      <el-button :loading="loading" style="margin-left:16px;" size="mini" type="primary" @click="handleUpload">
        浏览
      </el-button>
    </div>
  </div>
</template>
<script>
export default {
  props: {
    beforeUpload: Function, // eslint-disable-line
    onSuccess: Function// eslint-disable-line
  },
  data() {
    return {
      loading: false,
      name: '拖拽文件至此或'
    }
  },
  activated() {
  },
  methods: {
    upload(rawFile) {
      this.$refs['cert-upload-input'].value = null // fix can't select the same file
      if (!this.beforeUpload) {
        this.readerData(rawFile)
        return
      }
      const before = this.beforeUpload(rawFile)
      if (before) {
        this.readerData(rawFile)
      }
    },
    readerData(rawFile) {
      const vm = this
      this.loading = true
      vm.name = rawFile.name
      vm.$emit('input', rawFile)
      vm.$emit('on-change', rawFile)
      vm.$emit('change', rawFile)
      this.loading = false
      return
    },
    handleClick(e) {
      const files = e.target.files
      const rawFile = files[0] // only use files[0]
      if (!rawFile) return
      this.upload(rawFile)
    }, handleDragover(e) {
      e.stopPropagation()
      e.preventDefault()
      e.dataTransfer.dropEffect = 'copy'
    }, handleUpload() {
      this.$refs['cert-upload-input'].click()
    },
    handleDrop(e) {
      e.stopPropagation()
      e.preventDefault()
      if (this.loading) return
      const files = e.dataTransfer.files
      if (files.length !== 1) {
        this.$message.error('Only support uploading one file!')
        return
      }
      const rawFile = files[0] // only use files[0]
      if (!this.isCert(rawFile)) {
        this.$message.error('只支持 .cer, .pfx 文件')
        return false
      }
      this.upload(rawFile)
      e.stopPropagation()
      e.preventDefault()
    },
    isCert(file) {
      return /\.(cer|pfx)$/.test(file.name)
    }
  }
}
</script>
<style scoped>
.cert-upload-input{
  display: none;
  z-index: -9999;
}
.drop{
  border: 2px dashed #bbb;
  width: 600px;
  height: 160px;
  line-height: 160px;
  margin: 0 auto;
  font-size: 24px;
  border-radius: 5px;
  text-align: center;
  color: #bbb;
  position: relative;
}
</style>
