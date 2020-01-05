import request from '@/utils/request'
import Moment from 'moment'
class StockHqModel {
  constructor(originalString, stockCode, fullStockCode, channel) { // constructor是一个构造方法，用来接收参数
    if (!originalString) throw new Error('股票信息不存在')
    this.OriginalString = originalString// this代表的是实例对象
    this.Channel = channel
    this.StockCode = stockCode
    this.FullStockCode = fullStockCode
    this._SetInfoByGeneralString()
  }

  _ToInt64(strData) {
    if (isNaN(strData)) return strData
    return parseInt(strData)
  }
  _ToDecimal(strData) {
    if (isNaN(strData)) return strData
    return parseFloat(strData)
  }
  _ConvertTencentToSina(stockInfo) {
    if (!stockInfo) return
    var info = stockInfo.split('~')
    if (info) {
      var stock_info = ''
      stock_info += (info[1] + ',')// 名字
      stock_info += (info[5] + ',')// 今日开盘价
      stock_info += (info[4] + ',')// 昨日收盘价
      stock_info += (info[3] + ',')// 当前价格
      stock_info += (info[33] + ',')// 今日最高价
      stock_info += (info[34] + ',')// 今日最低价
      stock_info += (info[9] + ',')// 竞买价，即“买一”报价
      stock_info += (info[19] + ',')// 竞卖价，即“卖一”报价
      stock_info += (info[36] + ',')// 成交的股票数
      stock_info += (info[37] + ',')// 成交金额
      stock_info += (info[10] + '00,')// “买一”申请4695股，即47手；
      stock_info += (info[9] + ',')// “买一”报价；
      stock_info += (info[12] + '00,')// “买二”
      stock_info += (info[11] + ',')// “买二”
      stock_info += (info[14] + '00,')// “买3”
      stock_info += (info[13] + ',')// “买3”
      stock_info += (info[16] + '00,')// “买4”
      stock_info += (info[15] + ',')// “买4”
      stock_info += (info[18] + '00,')// “买5”
      stock_info += (info[17] + ',')// “买5”
      stock_info += (info[20] + '00,')// “卖一”申报3100股，即31手；
      stock_info += (info[19] + ',')// “卖一”报价
      stock_info += (info[22] + '00,')// “卖2”
      stock_info += (info[21] + ',')// “卖2”
      stock_info += (info[24] + '00,')// “卖3”
      stock_info += (info[23] + ',')// “卖3”
      stock_info += (info[26] + '00,')// “卖4”
      stock_info += (info[25] + ',')// “卖4”
      stock_info += (info[28] + '00,')// “卖5”
      stock_info += (info[27] + ',')// “卖5”
      stock_info += (Moment(info[30].toDateTime()).format('YYYY-MM-DD') + ',')// 日期
      stock_info += (Moment(info[30].toDateTime()).format('HH:mm:ss') + ',')// 时间
      stock_info += ('00')// 股票代码
      return stock_info
    } else {
      return ''
    }
  }
  _SetInfoByGeneralString() {
    if (!this.OriginalString) return
    switch (this.Channel) {
      case 'Sina':
        var reg = new RegExp(`var hq_str_${this.FullStockCode}="(.+)";`)
        if (reg.test(this.OriginalString)) {
          this.GeneralString = reg.exec(this.OriginalString)[1]
        }
        break
      case 'QQ':
        reg = new RegExp(`v_${this.FullStockCode}="(.+)";`)
        if (reg.test(this.OriginalString)) {
          this.GeneralString = this._ConvertTencentToSina(reg.exec(this.OriginalString)[1])
        }
        break
      default:
        this.GeneralString = this.OriginalString
        break
    }
    if (!this.GeneralString) throw new Error('股票信息不存在')
    var hqInfo = this.GeneralString.trim()
    var stock_info = hqInfo.split(',')
    this.StockName = stock_info[0]
    this.OpenPrice = parseFloat(stock_info[1])
    this.YesterdayPrice = parseFloat(stock_info[2])
    this.NowPrice = parseFloat(stock_info[3])
    this.TodayMaxPrice = parseFloat(stock_info[4])
    this.TodayMiniPrice = parseFloat(stock_info[5])
    this.CompeteBuyPrice = parseFloat(stock_info[6])
    this.CompeteSalePrice = parseFloat(stock_info[7])
    this.DealNum = this._ToInt64(stock_info[8])
    this.DealMoney = this._ToDecimal(stock_info[9])

    this.Date = stock_info[30]
    this.Time = stock_info[31]
    if (/^\d{8}$/.test(this.Date)) {
      this.Date = this.Date.replace(/(\d{4})(\d{2})(\d{2})/, '$1/$2/$3')
    }
    if (/^\d{6}$/.test(this.Time)) {
      this.Time = this.Time.replace(/(\d{2})(\d{2})(\d{2})/, '$1:$2:$3')
    }
    this.FiveTierMarkets = []
    // 买5
    for (let index = 0; index < 5; index++) {
      const hq = {
        HqType: 'Buy',
        Index: index + 1,
        ApplyNum: this._ToInt64(stock_info[10 + index * 2]),
        Price: parseFloat(stock_info[10 + index * 2 + 1])
      }
      this.FiveTierMarkets.push(hq)
    }
    // 卖5
    for (let index = 0; index < 5; index++) {
      const hq = {
        HqType: 'Sale',
        Index: index + 1,
        ApplyNum: this._ToInt64(stock_info[20 + index * 2]),
        Price: parseFloat(stock_info[20 + index * 2 + 1])
      }
      this.FiveTierMarkets.push(hq)
    }

    // 涨跌
    if (this.NowPrice > 0 && this.YesterdayPrice > 0) {
      this.PriceChange = this.NowPrice.sub(this.YesterdayPrice)
      this.PriceChangeRate = (this.PriceChange / this.YesterdayPrice * 100).round(2)
    } else {
      this.PriceChange = 0
      this.PriceChangeRate = 0
    }
  }
}
/**
 * 单支票行情信息
 * @param {} stockCode
 * @param {Sina,QQ,ZN,EastMoney} channel
 */
export async function getSingleHqInfo(stockCode, channel) {
  if (!/^(sh|sz)?\d{6}$/.test(stockCode)) {
    throw new Error('股票代码不正确')
  }
  var fullStockCode = stockCode
  if (/^\d{6}$/.test(stockCode)) {
    fullStockCode = /^6/.test(stockCode) ? `sh${stockCode}` : `sz${stockCode}`
  } else if (/^(sh|sz)\d{6}$/.test(stockCode)) {
    stockCode = /(sh|sz)(\d{6})/.exec(stockCode)[2]
  }

  var res = await request({
    url: `/hq/${channel}/${fullStockCode}`,
    method: 'get',
    noCheck: true,
    noauth: true
  })
  return new StockHqModel(res, stockCode, fullStockCode, channel)
}

export async function getStockByKey(key, channel) {
  var datas = []
  if (!key) return datas
  var res = await request({
    url: `/hq/stockSearch/${channel}/${key}`,
    method: 'get',
    noCheck: true,
    noauth: true
  })
  switch (channel) {
    case 'Sina':
      // var datas="贵州茅台,11,600519,sh600519,贵州茅台,,贵州茅台,99";
      var reg = new RegExp(`var datas="(.+)";`)
      if (reg.test(res)) {
        var str = reg.exec(res)[1]
        datas = str.split(';').map(info => {
          var infos = info.split(',')
          return {
            stockName: infos[0],
            stockCode: infos[2],
            fullStockCode: infos[3]
          }
        })
      }
      break
    default:
      break
  }
  return datas
}
