import qs from 'qs'
import url from './url'
import api from './config'

// 请求接口
export const fetchData = (name, params) => {
  return api.post(url[name], qs.stringify(params)).then(data => data)
}
