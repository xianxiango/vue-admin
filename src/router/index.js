import Vue from 'vue'
import Router from 'vue-router'
import Main from '@/views/main/Main.vue'

const _import = file => () => import('@/views/' + file + '.vue')

Vue.use(Router)

export const constantRouter = [
  {
    path: '',
    component: Main,
    redirect: 'banner',
    meta: {
      title: '轮播图',
      icon: 'dashboard'
    },
    children: [{
      path: 'banner',
      component: _import('banner/Banner'),
      name: 'banner',
      meta: {
        title: '轮播图'
      }
    }]
  },
  {
    path: '/worksExcellence',
    component: Main,
    redirect: 'worksExcellence',
    meta: {
      title: '优秀作品',
      icon: 'dashboard'
    },
    children: [{
      path: 'worksExcellence',
      component: _import('worksExcellence/WorksExcellence'),
      name: 'worksExcellence',
      meta: {
        title: '优秀作品'
      }
    }]
  },
  {
    path: '/course',
    component: Main,
    redirect: 'course',
    meta: {
      title: '课程设置',
      icon: 'dashboard'
    },
    children: [{
      path: 'course',
      component: _import('course/Course'),
      name: 'course',
      meta: {
        title: '课程设置'
      }
    }]
  },
  {
    path: '/goodStudent',
    component: Main,
    redirect: 'goodStudent',
    meta: {
      title: '优秀学生',
      icon: 'dashboard'
    },
    children: [{
      path: 'goodStudent',
      component: _import('goodStudent/GoodStudent'),
      name: 'goodStudent',
      meta: {
        title: '优秀学生'
      }
    }]
  },
  {
    path: '/student',
    component: Main,
    redirect: 'student',
    meta: {
      title: '学生作品',
      icon: 'dashboard'
    },
    children: [{
      path: 'student',
      component: _import('student/Student'),
      name: 'student',
      meta: {
        title: '学生作品'
      }
    }]
  },
  {
    path: '/teacher',
    component: Main,
    redirect: 'teacher',
    meta: {
      title: '老师作品',
      icon: 'dashboard'
    },
    children: [{
      path: 'teacher',
      component: _import('teacher/Teacher'),
      name: 'teacher',
      meta: {
        title: '老师作品'
      }
    }]
  },
  {
    path: '/practice',
    component: Main,
    redirect: 'practice',
    meta: {
      title: '实践活动',
      icon: 'dashboard'
    },
    children: [{
      path: 'practice',
      component: _import('practice/Practice'),
      name: 'practice',
      meta: {
        title: '实践活动'
      }
    }]
  },
  {
    path: '/strength',
    component: Main,
    redirect: 'strength',
    meta: {
      title: '师资实力',
      icon: 'dashboard'
    },
    children: [{
      path: 'strength',
      component: _import('strength/Strength'),
      name: 'strength',
      meta: {
        title: '师资实力'
      }
    }]
  },
  {
    path: '/text',
    component: Main,
    redirect: 'text',
    meta: {
      title: '文字编辑',
      icon: 'dashboard'
    },
    children: [{
      path: 'text',
      component: _import('text/Text'),
      name: 'text',
      meta: {
        title: '文字编辑'
      }
    }]
  },
  {
    path: '/login',
    name: 'login',
    hidden: true,
    component: _import('login/Login')
  }
]

export const asyncRouter = []
export default new Router({
  mode: 'history',
  scrollBehavior: () => ({
    y: 0
  }),
  routes: constantRouter
})
