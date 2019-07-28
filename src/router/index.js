import Vue from 'vue'
import Router from 'vue-router'
import Main from '@/views/main/Main.vue'

const _import = file => () => import('@/views/' + file + '.vue')

Vue.use(Router)

export const constantRouter = [
  {
    path: '',
    component: Main,
    redirect: 'home',
    meta: {
      title: '首页',
      icon: 'dashboard'
    },
    children: [{
      path: 'home',
      component: _import('home/Home'),
      name: 'home',
      meta: {
        title: '首页',
      }
    }]
  },
  {
    path: '',
    component: Main,
    redirect: 'synopsis',
    meta: {
      title: '学院简介',
      icon: 'dashboard'
    },
    children: [{
      path: 'synopsis',
      component: _import('synopsis/Synopsis'),
      name: 'synopsis',
      meta: {
        title: '学院简介',
        // icon: 'dashboard'
      }
    }]
  },
  {
    path: '',
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
        title: '实践活动',
        // icon: 'dashboard'
      }
    }]
  }, {
    path: '',
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
        title: '课程设置',
        // icon: 'dashboard'
      }
    }]
  }, {
    path: '',
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
        title: '师资实力',
        // icon: 'dashboard'
      }
    }]
  }, {
    path: '',
    component: Main,
    redirect: 'teacher',
    meta: {
      title: '老师作品',
      icon: 'dashboard',
    },
    children: [{
      path: 'teacher',
      component: _import('teacher/Teacher'),
      name: 'teacher',
      meta: {
        title: '老师作品',
        // icon: 'dashboard'
      }
    }]
  }, {
    path: '',
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
        title: '学生作品',
        // icon: 'dashboard'
      }
    }]
  },
  // {
  //   path: '',
  //   component: Main,
  //   redirect: 'business',
  //   meta: {
  //     title: '业务范围',
  //     icon: 'dashboard'
  //   },
  //   children: [{
  //     path: 'business',
  //     component: _import('business/Business'),
  //     name: 'business',
  //     meta: {
  //       title: '业务范围',
  //     }
  //   }]
  // },
]

export const asyncRouter = [




  // 404 页面一定要最后加载、否则后面的所有页面都会被拦截到404
  {
    path: '*',
    name: 'error',
    component: _import('error/Error'),
    hidden: true,
    meta: {
      roles: 'default'
    }
  },

]

export default new Router({
  mode: 'history',
  scrollBehavior: () => ({
    y: 0
  }),
  routes: constantRouter
})
