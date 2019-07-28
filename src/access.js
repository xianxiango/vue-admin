import store from './store'
import router from './router'
import Cookies from 'js-cookie'
import NProgress from 'nprogress'
import 'nprogress/nprogress.css'
import configure from '../static/config'
NProgress.configure({ showSpinner: false })

const isLogin = Cookies.get('auth')

const currentHost = window.location.host.split('.')
const hostConfig = currentHost[1] ? configure[currentHost[1]] : configure['168']
store.commit('SET_HOST_CONFIG', hostConfig)

router.beforeEach((to, from, next) => {
  NProgress.start()
  if (!document.title && hostConfig) {
    document.title = hostConfig.title
  }
  if (!isLogin && to.path !== '/login') {
    next('/login')
    return false
  }
  if (!isLogin && to.path === '/login') {
    next()
    return false
  }
  if (isLogin && to.path === '/login') {
    next('/')
    return false
  }
  if (isLogin && store.state.modules.length === 0) {
    store.dispatch('fetchAvailable').then(list => {
      store.dispatch('createdRoutes', list).then(() => {
        router.addRoutes(store.state.addRouters)
        next({ ...to, replace: true })
      })
    })
  } else {
    next()
  }
})

router.afterEach(() => {
  NProgress.done()
})
