import Vue from 'vue'
import axios from 'axios'
import Cookies from 'js-cookie'
const api = axios.create({
  timeout: 60000,
  withCredentials: true,
  baseURL: process.env.NODE_ENV === 'production' ? '/' : '/api',
  headers: {
    'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8'
  }
})

//添加自定义实例请求拦截器
api.interceptors.request.use(
  config => config,
  error => console.log(error) // Vue.$Notification.error('请求发送失败')
)
//添加自定义实例响应拦截器
api.interceptors.response.use(
  response => {
    if (response.data.code) {
      if (response.data.code === 2) {
        Cookies.remove('auth')
        window.location.href = `${window.location.origin}/login`
        return false
      }
      Vue.$Notification.error(response.data.message)
      return false
    }
    return response.data.data ? response.data.data : response.data
  },
  error => {
    console.log(error)
    // Vue.$Notification.error('请求响应失败')
    return false
  }
)

export default api
