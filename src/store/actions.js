import { fetchData } from '@/api'
import { asyncRouter } from '@/router'
import Cookies from 'js-cookie'

function hasPermission(roles, route) {
  if (route.meta && route.meta.roles) {
    return roles.some(role => route.meta.roles === role)
  } else {
    return true
  }
}

function filterAsyncRouter(asyncRouterMap, roles) {
  const accessedRouters = asyncRouterMap.filter(route => {
    if (hasPermission(roles, route)) {
      if (route.children && route.children.length) {
        route.children = filterAsyncRouter(route.children, roles)
      }
      return true
    }
    return false
  })
  return accessedRouters
}

export default {
  // 获取可用模块
  fetchAvailable({ commit, state }) {
    return new Promise((resolve, reject) => {

      const available = ['userDetail', 'mineDetail','userAccount']
      commit('SET_MODULES', available)
      resolve(available)

      // const available = ['userDetail', 'mineDetail','userAccount']
      // fetchData('adminModules').then(data => {
      //   if (data) {
      //     for (let key in data) {
      //       if (key) available.push(key)
      //       if (data[key]) {
      //         for (let child in data[key]) {
      //           if (child) available.push(child)
      //         }
      //       }
      //     }
      //   }
      //   commit('SET_MODULES', available)
      //   resolve(available)
      // })

    })
  },
  // 创建可访问路由
  createdRoutes({ commit, state }, data) {
    return new Promise(resolve => {
      let accessedRouters = filterAsyncRouter(asyncRouter, data)
      commit('SET_ROUTERS', accessedRouters)
      resolve()
    })
  },
  // 添加访问视图
  addVisitedViews({ commit }, view) {
    commit('ADD_VISITED_VIEWS', view)
  },
  // 移除访问视图
  delVisitedViews({ commit, state }, view) {
    return new Promise((resolve) => {
      commit('DEL_VISITED_VIEWS', view)
      resolve([...state.visitedViews])
    })
  },
  // 切换侧边栏
  toggleSideBar({ commit }) {
    commit('TOGGLE_SIDEBAR')
  },
  // 关闭侧边栏
  closeSideBar({ commit }, { withoutAnimation }) {
    commit('CLOSE_SIDEBAR', withoutAnimation)
  },
  // 切换设备
  toggleDevice({ commit }, device) {
    commit('TOGGLE_DEVICE', device)
  },
  // 设置当前环境配置
  setHostConfig({ commit }, data) {
    if (data) {
      commit('SET_HOST_CONFIG', data)
    }
  }
}