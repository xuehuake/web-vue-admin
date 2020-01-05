import '@/utils/log' // log
import Moment from 'moment'
function accAdd(arg1, arg2) {
  var r1, r2, m
  try { r1 = arg1.toString().split('.')[1].length } catch (e) { r1 = 0 }
  try { r2 = arg2.toString().split('.')[1].length } catch (e) { r2 = 0 }
  m = Math.pow(10, Math.max(r1, r2))
  return (arg1 * m + arg2 * m) / m
}
function accSub(arg1, arg2) {
  var r1, r2, m, n
  try { r1 = arg1.toString().split('.')[1].length } catch (e) { r1 = 0 }
  try { r2 = arg2.toString().split('.')[1].length } catch (e) { r2 = 0 }
  m = Math.pow(10, Math.max(r1, r2))
  n = (r1 >= r2) ? r1 : r2
  return ((arg1 * m - arg2 * m) / m).toFixed(n)
}

window.Number.prototype.add = function(arg) {
  return accAdd(arg, this)
}
window.Number.prototype.sub = function(arg) {
  return accSub(this, arg)
}
window.Number.prototype.round = function(v2) {
  const val = this
  if (isNaN(val) || val === undefined || val == null) { return null }
  return Math.round(val * v2) / v2
}
window.Date.prototype.Format = function(fmt) {
  var date = this
  return Moment(date).format(fmt)
}

window.String.prototype.toDateTime = function() {
  var str = this
  if (str) {
    str = str.replace(/(\d{4})(\d{2})(\d{2})(\d{2})(\d{2})(\d{2})/, '$1/$2/$3 $4:$5:$6')
    return new Date(str)
  } else {
    return null
  }
}
