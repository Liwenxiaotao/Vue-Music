import {commonParams} from './config'
import axios from 'axios'
export function getMusic(mid) {
  const url = '/api/music'

  const data = Object.assign({}, commonParams, {
    platform: 'yqq',
    loginUin: 0,
    hostUin: 0,
    needNewCode: 0,
    cid: 205361747,
    guid: 6929274840,
    uin: 0,
    songmid: mid,
    filename: `C400${mid}.m4a`
  })
  return axios.get(url, {
    params: data
  }).then((res) => {
    return Promise.resolve(res.data)
  })
}
