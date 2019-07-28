import { constantRouter } from '@/router'

export default {
  // 设置可访问模块
  SET_MODULES: (state, modules) => {
    state.modules = modules
  },
  // 设置可访问路由
  SET_ROUTERS: (state, routers) => {
    state.addRouters = routers
    state.routers = constantRouter.concat(routers)
  },
  // 添加访问视图
  ADD_VISITED_VIEWS: (state, view) => {
    if (view.query.uid) {
      state.visitedViews.map(elm => {
        if (elm.path === view.path) elm.query.uid = view.query.uid
      })
    }
    if (state.visitedViews.some(v => v.path === view.path)) return
    state.visitedViews.push({
      name: view.name,
      path: view.path,
      title: view.meta.title || 'no-name',
      query: view.query
    })
  },
  // 移除访问视图
  DEL_VISITED_VIEWS: (state, view) => {
    for (let [i, v] of state.visitedViews.entries()) {
      if (v.path === view.path) {
        state.visitedViews.splice(i, 1)
        break
      }
    }
  },
  // 切换侧边栏
  TOGGLE_SIDEBAR: state => {
    state.sidebar.opened = !state.sidebar.opened
    state.sidebar.withoutAnimation = false
  },
  // 关闭侧边栏
  CLOSE_SIDEBAR: (state, withoutAnimation) => {
    state.sidebar.opened = false
    state.sidebar.withoutAnimation = withoutAnimation
  },
  // 切换设备
  TOGGLE_DEVICE: (state, device) => {
    state.device = device
  },
  // 更新搜索标签
  UPDATE_LABEL_LIST: (state, list) => {
    state.labelList = list
  },
  // 设置当前环境配置
  SET_HOST_CONFIG: (state, data) => {
    state.hostConfig = data
  }
}