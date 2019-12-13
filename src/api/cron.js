import request from '@/utils/request'
import Qs from 'qs'

export function GetExecuteTimes(data) {
  return request({
    url: '/user/api/cron/parser',
    method: 'post',
    data: Qs.stringify(data)
  })
}
