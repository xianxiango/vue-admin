import store from './store'
import router from './router'
import Cookies from 'js-cookie'
import NProgress from 'nprogress'
import 'nprogress/nprogress.css'
// import configure from '../static/config'
NProgress.configure({ showSpinner: false })

// const isLogin = Cookies.get('auth')

const currentHost = window.location.host.split('.')
const hostConfig = "GMS"
store.commit('SET_HOST_CONFIG', hostConfig)

router.beforeEach((to, from, next) => {
  NProgress.start()
  if (!document.title && hostConfig) {
    document.title = hostConfig
  }
  
  next()
})

router.afterEach(() => {
  NProgress.done()
})
