import request from '@/utils/request'

class StockHqModel {
  constructor(originalString, stockCode, channel) { // constructor是一个构造方法，用来接收参数
    this.OriginalString = originalString// this代表的是实例对象
    this.Channel = channel
    this.StockCode = stockCode
    var fullStockCode = /^6/.test(stockCode) ? `sh${stockCode}` : `sz${stockCode}`
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
          this.GeneralString = reg.exec(this.OriginalString)[1]
        }
        break
      default:
        this.GeneralString = this.OriginalString
        break
    }

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
  }
}
/**
 * 单支票行情信息
 * @param {6位数字} stockCode
 * @param {Sina,QQ,ZN,EastMoney} channel
 */
export async function getSingleHqInfo(stockCode, channel) {
  if (!/^\d{6}$/.test(stockCode)) {
    Promise.reject('股票代码不正确')
    return
  }
  var fullStockCode = /^6/.test(stockCode) ? `sh${stockCode}` : `sz${stockCode}`
  var res = await request({
    url: `/hq/${channel}/${fullStockCode}`,
    method: 'get',
    noCheck: true
  })
  return new StockHqModel(res, stockCode, channel)
}

