import jsonp from 'common/js/jsonp'
import {commonParams, options} from './config'
import axios from 'axios'
import moment from 'moment'

export function getTopList() {
  const url = 'https://c.y.qq.com/v8/fcg-bin/fcg_myqq_toplist.fcg'

  const data = Object.assign({}, commonParams, {
    platform: 'h5',
    needNewCode: 1
  })

  return jsonp(url, data, options)
}
export function getMusicList(topid) {
  const url = '/api/topList'
  const data = Object.assign({}, commonParams, {
    topid,
    tpl: 3,
    page: 'detail',
    date: moment().format('YYYY-MM-DD'),
    // date: '2018_31',
    type: 'top',
    song_begin: 0,
    song_num: 30,
    loginUin: 0,
    hostUin: 0,
    platform: 'yqq',
    needNewCode: 0,
    notice: 0,
    format: 'json'
  })
  return axios.get(url, {
    params: data
  }).then((res) => {
    return Promise.resolve(res.data)
  })
}
