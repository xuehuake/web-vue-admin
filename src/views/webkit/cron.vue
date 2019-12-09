<template>
  <div class="mixin-components-container">

    <el-row :gutter="20" style="margin-top:50px;">
      <el-col :span="6.5">
        <el-card class="box-card">
          <div slot="header" class="clearfix">
            <span>Cron表达式执行时间</span>
          </div>
          <div>
            <el-form ref="cronForm" :model="cronForm">
              <el-form-item label="cron" label-width="50px">
                <el-popover v-model="cronPopover" placement="bottom" trigger="click">
                  <vue-cron v-model="cronForm.cronExpression" placement="bottom" trigger="click" i18n="cn" @change="(val)=>cronForm.cronExpression=val" @close="cronPopover=false" />
                  <el-input slot="reference" v-model="cronForm.cronExpression" placeholder="cron表达式" class="" />
                </el-popover>
              </el-form-item>
              <el-form-item label="次数" label-width="50px">
                <el-input v-model="cronForm.count" placeholder="请输入次数" />
              </el-form-item>
              <el-form-item label="时间" label-width="50px">
                <el-date-picker
                  v-model="cronForm.timeRange"
                  type="datetimerange"
                  :picker-options="pickerOptions"
                  range-separator="至"
                  start-placeholder="开始"
                  end-placeholder="结束"
                  value-format="yyyy-MM-dd HH:mm:ss"
                  align="left"
                />
              </el-form-item>

              <el-button v-waves :loading="loading" type="primary" style="width:100%;margin:10px 0;" @click.native.prevent="getExcuteTime">执行</el-button>

              <el-form-item v-show="cronForm.result" prop="result">
                <label for="result">结果</label>
                <aside>
                  <div v-for="data in cronForm.result" :key="data"><span v-text="data" /> </div>
                </aside>
              </el-form-item>
            </el-form>
          </div>
        </el-card>

      </el-col>

    </el-row>

  </div>
</template>
<script>
import { cron } from 'vue-cron'
import waves from '@/directive/waves/index.js'
import { GetExecuteTimes } from '@/api/cron'
export default {
  name: 'Cron',
  components: { vueCron: cron },
  directives: { waves },
  data() {
    return {
      loading: false,
      cronPopover: false,
      cronExpression: null,
      cronForm: {
        timeRange: ['', ''],
        count: 10,
        cronExpression: null,
        result: null
      },
      pickerOptions: {
        shortcuts: [{
          text: '未来8小时',
          onClick(picker) {
            const end = new Date()
            const start = new Date()
            end.setTime(start.getTime() + 3600 * 1000 * 8)
            picker.$emit('pick', [start, end])
          }
        }, {
          text: '未来一天',
          onClick(picker) {
            const end = new Date()
            const start = new Date()
            end.setTime(start.getTime() + 3600 * 1000 * 24)
            picker.$emit('pick', [start, end])
          }
        }]
      }
    }
  },
  activated() {
  },
  methods: {
    getExcuteTime() {
      const vm = this
      GetExecuteTimes({
        cronExpression: vm.cronForm.cronExpression,
        dStart: vm.cronForm.timeRange[0],
        dEnd: vm.cronForm.timeRange[1],
        limitCount: vm.cronForm.count
      }).then(res => {
        console.log(res)
        vm.cronForm.result = res.Data
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
