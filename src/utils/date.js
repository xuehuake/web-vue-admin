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
export function AddDate(interval, number, date) {
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

/**
 * @param {number} time
 * @param {string} option
 * @returns {string}
 */
export function DateMoment(time, option) {
  if (('' + time).length === 10) {
    time = parseInt(time) * 1000
  } else {
    time = +time
  }
  const d = new Date(time)
  const now = Date.now()

  const diff = (now - d) / 1000

  if (diff < 30) {
    return '刚刚'
  } else if (diff < 3600) {
    // less 1 hour
    return Math.ceil(diff / 60) + '分钟前'
  } else if (diff < 3600 * 24) {
    return Math.ceil(diff / 3600) + '小时前'
  } else if (diff < 3600 * 24 * 2) {
    return '1天前'
  }
  if (option) {
    return formateDate(time, option)
  } else {
    return (
      d.getMonth() +
      1 +
      '月' +
      d.getDate() +
      '日' +
      d.getHours() +
      '时' +
      d.getMinutes() +
      '分'
    )
  }
}

export function formateDate(time, cFormat) {
  if (arguments.length === 0) {
    return null
  }
  const format = cFormat || '{y}-{M}-{d} {h}:{m}:{s}'
  let date
  if (typeof time === 'object') {
    date = time
  } else {
    if ((typeof time === 'string') && (/^[0-9]+$/.test(time))) {
      time = parseInt(time)
    }
    if ((typeof time === 'number') && (time.toString().length === 10)) {
      time = time * 1000
    }
    date = new Date(time)
  }
  const formatObj = {
    y: date.getFullYear(),
    M: date.getMonth() + 1,
    d: date.getDate(),
    H: date.getHours(),
    i: date.getMinutes(),
    s: date.getSeconds(),
    a: date.getDay()
  }
  const time_str = format.replace(/{([yMdhmsa])+}/g, (result, key) => {
    const value = formatObj[key]
    // Note: getDay() returns 0 on Sunday
    if (key === 'a') { return ['日', '一', '二', '三', '四', '五', '六'][value ] }
    return value.toString().padStart(2, '0')
  })
  return time_str
}
