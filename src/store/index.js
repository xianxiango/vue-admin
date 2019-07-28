import Vue from 'vue'
import Vuex from 'vuex'
import actions from './actions'
import mutations from './mutations'
import { constantRouter } from '@/router'

const state = {
  sidebar: {
    opened: true,
    withoutAnimation: false
  },
  device: 'desktop',
  modules: [],  // 可用模块
  addRouters: [],  // 动态添加的路由
  visitedViews: [],  // 访问视图
  noCachedViews: ['user-detail'],  // 不需要缓存的视图
  routers: constantRouter, // 路由对象
  labelList: [],   // 搜索列表
  hostConfig: null
}

Vue.use(Vuex)

const store = new Vuex.Store({
  state,
  actions,
  mutations
})

export default store
