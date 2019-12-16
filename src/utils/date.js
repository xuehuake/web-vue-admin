/*
 *   功能:实现VBScript的DateAdd功能.
 *   参数:interval,字符串表达式，表示要添加的时间间隔.
 *   参数:number,数值表达式，表示要添加的时间间隔的个数.
 *   参数:date,时间对象.
 *   返回:新的时间对象.
 *   var now = new Date();
 *   var newDate = DateAdd( "d", 5, now);
 *---------------   DateAdd(interval,number,date)   -----------------
 */
function DateAdd(interval, number, date) {
  var timeStamp = Date.parse(date)
  var tmpDate = date
  switch (interval) {
    case 'y': {
      tmpDate.setFullYear(date.getFullYear() + number)
      return tmpDate
    }
    case 'q': {
      tmpDate.setMonth(date.getMonth() + number * 3)
      return tmpDate
    }
    case 'M': {
      tmpDate.setMonth(date.getMonth() + number)
      return tmpDate
    }
    case 'w': {
      timeStamp = timeStamp + number * 60 * 60 * 24 * 7 * 1000
      break
    }
    case 'd': {
      timeStamp = timeStamp + number * 60 * 60 * 24 * 1000
      break
    }
    case 'h': {
      timeStamp = timeStamp + number * 60 * 60 * 1000
      break
    }
    case 'm': {
      timeStamp = timeStamp + number * 60 * 1000
      break
    }
    case 's': {
      timeStamp = timeStamp + number * 1000
      break
    }
    default: {
      date.setDate(date.getDate() + number)
      return date
    }
  }
  return new Date(timeStamp)
}
export default {
  DateAdd
}
