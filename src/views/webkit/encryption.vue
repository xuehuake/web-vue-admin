<template>
  <div class="mixin-components-container">

    <el-row :gutter="20" style="margin-top:50px;">
      <!-- AES -->
      <el-col :span="6">
        <el-card class="box-card">
          <div slot="header" class="clearfix">
            <span>AES 加密/解密</span>
          </div>
          <div>
            <el-form ref="aesForm" :rules="encryptRules" :model="aesForm">
              <el-form-item prop="text">
                <md-input v-model="aesForm.text" icon="el-icon-search" name="text" placeholder="输入原文/密文">原文/密文</md-input>
              </el-form-item>
              <el-form-item prop="key">
                <md-input v-model="aesForm.key" icon="el-icon-search" name="key" placeholder="输入密钥">密钥</md-input>
              </el-form-item>
              <el-form-item v-show="aesForm.result" prop="result">
                <label for="result">结果</label>
                <aside name="result" v-text="aesForm.result" />
              </el-form-item>

              <el-button v-waves :loading="loading" type="primary" style="width:100%;margin-bottom:20px;" @click.native.prevent="AesEncrypt">加&nbsp;密</el-button>
              <el-button v-waves :loading="loading" type="primary" style="width:100%;margin:0;" @click.native.prevent="AesDecrypt">解&nbsp;密</el-button>

            </el-form>
          </div>
        </el-card>
      </el-col>
      <!-- DES -->
      <el-col :span="6">
        <el-card class="box-card">
          <div slot="header" class="clearfix">
            <span>DES 加密/解密</span>
          </div>
          <div>
            <el-form ref="desForm" :rules="encryptRules" :model="desForm">
              <el-form-item prop="text">
                <md-input v-model="desForm.text" icon="el-icon-search" name="text" placeholder="输入原文/密文">原文/密文</md-input>
              </el-form-item>
              <el-form-item prop="key">
                <md-input v-model="desForm.key" icon="el-icon-search" name="key" placeholder="输入密钥">密钥</md-input>
              </el-form-item>
              <el-form-item v-show="desForm.result" prop="result">
                <label for="result">结果</label>
                <aside name="result" v-text="desForm.result" />
              </el-form-item>

              <el-button v-waves :loading="loading" type="primary" style="width:100%;margin-bottom:20px;" @click.native.prevent="DesEncrypt">加&nbsp;密</el-button>
              <el-button v-waves :loading="loading" type="primary" style="width:100%;margin:0;" @click.native.prevent="DesDecrypt">解&nbsp;密</el-button>

            </el-form>
          </div>
        </el-card>
      </el-col>

    </el-row>

    <el-row :gutter="20" style="margin-top:50px;">
      <!-- RSA 签名/验签-->
      <el-col :span="12">
        <el-card class="box-card">
          <div slot="header" class="clearfix">
            <span>RSA 签名/验签</span>
          </div>
          <div>
            <el-form ref="rsaForm" :rules="encryptRules" :model="rsaForm">
              <el-form-item prop="text">
                <md-input v-model="rsaForm.text" icon="el-icon-search" name="text" placeholder="输入原文/密文">原文/密文</md-input>
              </el-form-item>
              <el-form-item prop="key">
                <md-input v-model="rsaForm.key" icon="el-icon-search" name="key" placeholder="输入密钥">密钥</md-input>
              </el-form-item>
              <el-form-item v-show="rsaForm.result" prop="result">
                <label for="result">结果</label>
                <aside name="result">
                  <p v-text="rsaForm.result" />
                </aside></el-form-item>
              <el-button v-waves :loading="loading" type="primary" style="width:100%;margin:10px 0;" @click.native.prevent="Sign">签&nbsp;名</el-button>
              <el-button v-waves :loading="loading" type="primary" style="width:100%;margin:10px 0;" @click.native.prevent="Verify">验&nbsp;签</el-button>
              <el-button v-waves :loading="loading" type="primary" style="width:100%;margin:10px 0;" @click.native.prevent="SignWithMd5">签&nbsp;名(withMD5)</el-button>
              <el-button v-waves :loading="loading" type="primary" style="width:100%;margin:10px 0;" @click.native.prevent="VerifyWithMd5">验&nbsp;签(withMD5)</el-button>
              <el-button v-waves :loading="loading" type="primary" style="width:100%;margin:10px 0;" @click.native.prevent="SignWithSHA1">签&nbsp;名(withSHA1)</el-button>
              <el-button v-waves :loading="loading" type="primary" style="width:100%;margin:10px 0;" @click.native.prevent="VerifyWithSHA1">验&nbsp;签(withSHA1)</el-button>
            </el-form>
          </div>
        </el-card>
      </el-col>

      <!-- RSA密钥获取 -->
      <el-col :span="12">
        <el-card class="box-card">
          <div slot="header" class="clearfix">
            <span>RSA 获取密钥</span>
          </div>
          <div>
            <el-form ref="rsaKeyForm" :model="rsaKeyForm">
              <el-form-item prop="file">
                <label style="color:#2196F3;font-size:16px">证书文件</label>
                <CertUpload v-model="rsaKeyForm.file" />
              </el-form-item>
              <el-form-item prop="password">
                <md-input v-model="rsaKeyForm.password" icon="el-icon-search" name="password" placeholder="输入密码">证书密码</md-input>
              </el-form-item>
              <el-form-item prop="result">
                <div v-if="rsaKeyForm.result&&rsaKeyForm.result.publicKey">
                  <label for="pubkey">公钥</label>
                  <aside name="pubkey" v-text="rsaKeyForm.result.publicKey" />
                </div>
                <div v-if="rsaKeyForm.result&&rsaKeyForm.result.privateKey">
                  <label for="prikey">私钥</label>
                  <aside name="prikey" v-text="rsaKeyForm.result.privateKey" />
                </div>
              </el-form-item>
              <el-button v-waves :loading="loading" type="primary" style="width:100%;margin:10px 0;" @click.native.prevent="getRSAKeys">生成密钥对</el-button>
              <el-button v-waves :loading="loading" type="primary" style="width:100%;margin:10px 0;" @click.native.prevent="getPrivateKeyByPfx">获取密钥（pfx）</el-button>
              <el-button v-waves :loading="loading" type="primary" style="width:100%;margin:10px 0;" @click.native.prevent="getPublicKeyByCert">获取公钥（cert）</el-button>
            </el-form>
          </div>
        </el-card>
      </el-col>
    </el-row>
  </div>
</template>
<script>
import MdInput from '@/components/MDinput'
import waves from '@/directive/waves/index.js' // 水波纹指令
import { AesEncrypt, AesDecrypt, DesEncrypt, DesDecrypt, Sign, Verify, SignWithMd5, VerifyWithMd5, SignWithSHA1, VerifyWithSHA1, GetRSAKeys, GetPublicKeyByCert, GetPrivateKeyByPfx } from '@/api/secret'
import CertUpload from '@/components/UploadCert'

export default {
  components: {
    MdInput,
    CertUpload
  },
  directives: {
    waves
  },
  data() {
    const validateText = (rule, value, callback) => {
      if (!value) {
        callback(new Error('请输入原文或密文'))
      } else {
        callback()
      }
    }
    const validateKey = (rule, value, callback) => {
      if (!value) {
        callback(new Error('请输入密钥'))
      } else {
        callback()
      }
    }
    return {
      loading: false,
      aesForm: {
        text: null,
        key: 'ziniu.joeychou.m',
        result: null
      },
      desForm: {
        text: null,
        key: 'sjk',
        result: null
      },
      rsaForm: {
        text: null,
        key: null,
        result: null
      },
      rsaKeyForm: {
        file: null,
        password: '123',
        result: null
      },
      encryptRules: {
        text: [{ required: true, trigger: 'blur', validator: validateText }],
        key: [{ required: true, trigger: 'blur', validator: validateKey }]
      }
    }
  },
  activated() {
  },
  methods: {
    AesEncrypt() {
      const vm = this
      vm.$refs.aesForm.validate(valid => {
        if (valid) {
          AesEncrypt({
            content: vm.aesForm.text.trim(),
            key: vm.aesForm.key.trim(),
            aesType: 'NetCore'
          }).then(res => {
            console.log(res)
            vm.aesForm.result = res.Data
          }).catch()
        }
      })
    },
    AesDecrypt() {
      const vm = this
      vm.$refs.aesForm.validate(valid => {
        if (valid) {
          AesDecrypt({
            content: vm.aesForm.text.trim(),
            key: vm.aesForm.key.trim(),
            aesType: 'NetCore'
          }).then(res => {
            console.log(res)
            vm.aesForm.result = res.Data
          }).catch()
        }
      })
    },
    DesEncrypt() {
      const vm = this
      vm.$refs.desForm.validate(valid => {
        if (valid) {
          DesEncrypt({
            content: vm.desForm.text.trim(),
            key: vm.desForm.key.trim(),
            desType: 'WebForm'
          }).then(res => {
            console.log(res)
            vm.desForm.result = res.Data
          }).catch()
        }
      })
    },
    DesDecrypt() {
      const vm = this
      vm.$refs.desForm.validate(valid => {
        if (valid) {
          DesDecrypt({
            content: vm.desForm.text.trim(),
            key: vm.desForm.key.trim(),
            desType: 'WebForm'
          }).then(res => {
            console.log(res)
            vm.desForm.result = res.Data
          }).catch()
        }
      })
    },
    getRSAKeys() {
      const vm = this
      GetRSAKeys().then(res => {
        vm.rsaKeyForm.result = res.Data
      }).catch()
    },
    getPrivateKeyByPfx() {
      const vm = this
      console.log(vm.rsaKeyForm.file)
      GetPrivateKeyByPfx({
        file: vm.rsaKeyForm.file,
        key: vm.rsaKeyForm.password.trim()
      }).then(res => {
        vm.rsaKeyForm.result = res.Data
      }).catch()
    },
    getPublicKeyByCert() {
      const vm = this
      GetPublicKeyByCert({
        file: vm.rsaKeyForm.file,
        key: vm.rsaKeyForm.password.trim()
      }).then(res => {
        vm.rsaKeyForm.result = res.Data
      }).catch()
    },
    Sign() {
      const vm = this
      vm.$refs.rsaForm.validate(valid => {
        if (valid) {
          Sign({
            content: vm.rsaForm.text.trim(),
            key: vm.rsaForm.key.trim()
          }).then(res => {
            console.log(res)
            vm.rsaForm.result = res.Data
          }).catch()
        }
      })
    },
    Verify() {
      const vm = this
      vm.$refs.rsaForm.validate(valid => {
        if (valid) {
          Verify({
            content: vm.rsaForm.text.trim(),
            key: vm.rsaForm.key.trim()
          }).then(res => {
            console.log(res)
            vm.rsaForm.result = res.Data
          }).catch()
        }
      })
    },
    SignWithMd5() {
      const vm = this
      vm.$refs.rsaForm.validate(valid => {
        if (valid) {
          SignWithMd5({
            content: vm.rsaForm.text.trim(),
            key: vm.rsaForm.key.trim()
          }).then(res => {
            console.log(res)
            vm.rsaForm.result = res.Data
          }).catch()
        }
      })
    },
    VerifyWithMd5() {
      const vm = this
      vm.$refs.rsaForm.validate(valid => {
        if (valid) {
          VerifyWithMd5({
            content: vm.rsaForm.text.trim(),
            key: vm.rsaForm.key.trim()
          }).then(res => {
            console.log(res)
            vm.rsaForm.result = res.Data
          }).catch()
        }
      })
    },
    SignWithSHA1() {
      const vm = this
      vm.$refs.rsaForm.validate(valid => {
        if (valid) {
          SignWithSHA1({
            content: vm.rsaForm.text.trim(),
            key: vm.rsaForm.key.trim()
          }).then(res => {
            console.log(res)
            vm.rsaForm.result = res.Data
          }).catch()
        }
      })
    },
    VerifyWithSHA1() {
      const vm = this
      vm.$refs.rsaForm.validate(valid => {
        if (valid) {
          VerifyWithSHA1({
            content: vm.rsaForm.text.trim(),
            key: vm.rsaForm.key.trim()
          }).then(res => {
            console.log(res)
            vm.rsaForm.result = res.Data
          }).catch()
        }
      })
    }
  }
}
</script>
<style rel="stylesheet/scss" lang="scss">
 @import '@/styles/mixin.scss';
.mixin-components-container {
  background-color: #f0f2f5;
  padding: 30px;
  min-height: calc(100vh - 84px);
}
.component-item{
  min-height: 100px;
}
aside {
    background: #eef1f6;
    padding: 8px 24px;
    margin-bottom: 20px;
    border-radius: 2px;
    display: block;
    line-height: 32px;
    font-size: 16px;
    font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Oxygen, Ubuntu, Cantarell, "Fira Sans", "Droid Sans", "Helvetica Neue", sans-serif;
    color: #2c3e50;
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
    word-wrap:break-word
}
</style>
