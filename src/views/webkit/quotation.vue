<template>
  <div class="mixin-components-container">
    <el-row :gutter="20" style="margin-top:50px;">
      <el-col :span="12">
        <el-card class="box-card">
          <div slot="header" class="clearfix">
            <span>股票行情</span>
          </div>
          <div>
            <el-form ref="cronForm" :model="hqForm">
              <el-form-item label="股票代码" label-width="100px">
                <el-input v-model="hqForm.stockCode" placeholder="请输股票代码" />
              </el-form-item>
              <el-form-item label="接口通道" label-width="100px">
                <el-select v-model="hqForm.channel" class="filter-item" placeholder="Please select">
                  <el-option v-for="item in Channels" :key="item.key" :label="item.name" :value="item.key" />
                </el-select>
              </el-form-item>
              <el-button v-waves :loading="loading" type="primary" style="width:100%;margin:10px 0;" @click.native.prevent="getHq">获取行情</el-button>
              <el-form-item v-if="hqInfo" prop="hqInfo">
                <label for="hqInfo">结果</label>
                <aside name="hqInfo">
                  <el-row>
                    <el-col :span="8">
                      <ul class="clearfix">
                        <li><strong>股票代码 : </strong><span v-text="hqInfo.StockCode" /></li>
                        <li><strong>股票名称 : </strong><span v-text="hqInfo.StockName" /></li>
                        <li><strong>开 盘 价 : </strong><span v-text="hqInfo.OpenPrice" /></li>
                        <li><strong>昨 收 价 : </strong><span v-text="hqInfo.YesterdayPrice" /></li>
                        <li><strong>当 前 价 : </strong><span v-text="hqInfo.NowPrice" /></li>
                        <li><strong>今日最高 : </strong><span v-text="hqInfo.TodayMaxPrice" /></li>
                        <li><strong>今日最低 : </strong><span v-text="hqInfo.TodayMiniPrice" /></li>
                        <li><strong>竞 买 价 : </strong><span v-text="hqInfo.CompeteBuyPrice" /></li>
                        <li><strong>竞 卖 价 : </strong><span v-text="hqInfo.CompeteSalePrice" /></li>
                        <li><strong>成交数量 : </strong><span v-text="hqInfo.DealNum" /></li>
                        <li><strong>成交金额 : </strong><span v-text="hqInfo.DealMoney" /></li>
                        <li><strong>更新日期 : </strong><span v-text="hqInfo.Date" /></li>
                        <li><strong>更新时间: </strong><span v-text="hqInfo.Time" /></li>
                      </ul>
                    </el-col>
                    <el-col :span="8">
                      <!-- 五档行情 -->
                      <ul v-for="(data,index) in hqInfo.FiveTierMarkets" :key="index" class="shop-shelves clearfix">
                        <li>
                          <span v-text="data.HqType=='Buy'?'买':'卖'" /><span class="number" v-text="data.Index" />
                        </li>
                        <li v-text="data.Price" />
                        <li v-text="data.ApplyNum" />
                      </ul>
                    </el-col>
                  </el-row>

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
import waves from '@/directive/waves/index.js'
import { getSingleHqInfo } from '@/api/quotation'
import Channels from '@/constants/QuotationChannel'
export default {
  directives: { waves },
  data() {
    return {
      Channels: Channels,
      loading: false,
      hqForm: {
        stockCode: '000001',
        channel: 'Sina'
      },
      hqInfo: null
    }
  },
  created() {
    const vm = this
    vm.getHq()
  },
  methods: {
    getHq() {
      const vm = this
      getSingleHqInfo(vm.hqForm.stockCode, vm.hqForm.channel).then(res => {
        vm.hqInfo = res
        console.log(JSON.stringify(res))
      }).catch(e => console.log(e))
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
.shop-shelves li{
  float: left;
  list-style-type:none;
  margin-right: 20px;
}
.number{
  border-radius: 50%;
  border: 1px dashed;
  vertical-align: top;
  display: inline-block;
  color: #000000;
  height: 20px;
  width: 20px;
  line-height: 20px;
  text-align: center
}
</style>

