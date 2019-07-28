import Vue from 'vue'
import Router from 'vue-router'
import Main from '@/views/main/Main.vue'

const _import = file => () => import('@/views/' + file + '.vue')

Vue.use(Router)

export const constantRouter = [{
  path: '',
  component: Main,
  redirect: 'home',
  meta: {
    title: '仪表盘',
    icon: 'dashboard'
  },
  children: [{
    path: 'home',
    component: _import('home/Home'),
    name: 'home',
    meta: {
      title: '仪表盘'
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

export const asyncRouter = [{
  path: '/manager', // 后台管理
  name: 'manager',
  component: Main,
  // redirect: '/manager/admin',
  meta: {
    title: '后台管理',
    icon: 'lock',
    roles: 'admin'
  },
  children: [{
    path: 'admin',
    name: 'managerAdmin',
    component: _import('manager/Admin'),
    meta: {
      title: '管理账号',
      roles: 'adminAccount'
    }
  },
  {
    path: 'access',
    name: 'managerAccess',
    component: _import('manager/Access'),
    meta: {
      title: '权限设置',
      roles: 'adminAccess'
    }
  },
  {
    path: 'logs',
    name: 'managerLogs',
    component: _import('manager/Logs'),
    meta: {
      title: '管理日志',
      roles: 'adminLog'
    }
  }
  ]
},
{
  path: '/member', // 用户管理
  name: 'member',
  component: Main,
  // redirect: '/member/user',
  meta: {
    title: '用户管理',
    icon: 'peoples',
    roles: 'user'
  },
  children: [{
    path: 'user',
    name: 'memberUser',
    component: _import('member/User'),
    meta: {
      title: '用户列表',
      roles: 'userList'
    }
  },
  {
    path: 'online',
    name: 'memberOnline',
    component: _import('member/Online'),
    meta: {
      title: '在线用户',
      roles: 'userOnline'
    }
  },
  {
    path: 'nexus',
    name: 'statisNexus',
    component: _import('member/Nexus'),
    meta: {
      title: '用户关系',
      roles: 'userNexus'
    }
  },
  {
    path: 'otcident',
    name: 'userOTCIdent',
    component: _import('member/OTCIdent'),
    meta: {
      title: '实名验证 ',
      roles: 'userOTCIdent'
    }
  },
  {
    path: 'logs',
    name: 'memberLogs',
    component: _import('member/Logs'),
    meta: {
      title: '用户日志',
      roles: 'userLogs'
    }
  },
  {
    hidden: true,
    path: 'detail',
    name: 'memberDetail',
    component: _import('member/Detail'),
    meta: {
      title: '用户详情',
      roles: 'userDetail'
    }
  },
    // {
    //   hidden: true,
    //   path: 'account',
    //   name: 'memberAccount',
    //   component: _import('member/Account'),
    //   meta: { title: '对账', roles: 'userAccount' }
    // }
  ]
},
{
  path: '/futures', // 永续交易
  name: 'futures',
  component: Main,
  // redirect: '/futures/position',
  meta: {
    title: '永续交易',
    icon: 'example',
    roles: 'futures'
  },
  children: [{
    path: 'position',
    name: 'futuresPosition',
    component: _import('futures/Position'),
    meta: {
      title: '持仓记录',
      roles: 'futuresPosition'
    }
  },
  {
    path: 'order',
    name: 'futuresOrder',
    component: _import('futures/Order'),
    meta: {
      title: '委托记录',
      roles: 'futuresOrder'
    }
  },
  {
    path: 'history',
    name: 'futuresHistory',
    component: _import('futures/History'),
    meta: {
      title: '历史记录',
      roles: 'futuresHistory'
    }
  },
  {
    path: 'burst',
    name: 'historyPosition',
    component: _import('futures/BurstList'),
    meta: {
      title: '爆仓列表',
      roles: 'historyPosition'
    }
  },
    // {
    //   path: 'Walletlogs',
    //   name: 'walletLog',
    //   component: _import('futures/Walletlogs'),
    //   meta: {
    //     title: '钱包列表',
    //     roles: 'walletLog'
    //   }
    // }
  ]
},
{
  path: '/cfd', // 差价交易
  name: 'cfd',
  component: Main,
  // redirect: '/cfd/position',
  meta: {
    title: '差价交易',
    icon: 'example',
    roles: 'cfd'
  },
  children: [{
    path: 'position',
    name: 'cfdPosition',
    component: _import('cfd/Position'),
    meta: {
      title: '仓位',
      roles: 'cfdPosition'
    }
  },
  {
    path: 'historyPosition',
    name: 'cfdHistoryPosition',
    component: _import('cfd/HistoryPosition'),
    meta: {
      title: '仓位历史',
      roles: 'cfdHistoryPosition'
    }
  },
  {
    path: 'order',
    name: 'cfdOrder',
    component: _import('cfd/Order'),
    meta: {
      title: '委托',
      roles: 'cfdOrder'
    }
  },
  {
    path: 'history',
    name: 'cfdHistory',
    component: _import('cfd/History'),
    meta: {
      title: '委托历史',
      roles: 'cfdHistory'
    }
  },
  ]
},
{
  path: '/spot', // 币币交易
  name: 'spot',
  component: Main,
  // redirect: '/spots/position',
  meta: {
    title: '币币交易',
    icon: 'example',
    roles: 'spot'
  },
  children: [{
    path: 'order',
    name: 'spotOrder',
    component: _import('spot/Order'),
    meta: {
      title: '当前委托',
      roles: 'spotOrders'
    }
  },
  {
    path: 'history',
    name: 'spotHistory',
    component: _import('spot/History'),
    meta: {
      title: '委托历史',
      roles: 'spotHistory'
    }
  },
  {
    path: 'details',
    name: 'spotDetails',
    component: _import('spot/Details'),
    meta: {
      title: '成交历史',
      roles: 'spotDetails'
    }
  }
  ]
},
{
  path: '/stock', // 现货交易
  name: 'stock',
  component: Main,
  // redirect: '/stock/buy',
  meta: {
    title: '现货交易',
    icon: 'international',
    roles: 'stock'
  },
  children: [{
    path: 'buy',
    name: 'stockBuy',
    component: _import('stock/Buy'),
    meta: {
      title: '买单',
      roles: 'stockBuy'
    }
  },
  {
    path: 'sell',
    name: 'stockSell',
    component: _import('stock/Sell'),
    meta: {
      title: '卖单',
      roles: 'stockSell'
    }
  }
  ]
},
{
  path: '/capitalRecord', // 资金记录
  name: 'capitalRecord',
  component: Main,
  meta: {
    title: '资金记录',
    icon: 'international',
    roles: 'capitalRecord'
  },
  children: [{
    path: 'reverse',
    name: 'capitalRecordReverse',
    component: _import('capitalRecord/reverse'),
    meta: {
      title: '合约记录',
      roles: 'crReverse'
    }
  },
  {
    path: 'spot',
    name: 'capitalRecordSpot',
    component: _import('capitalRecord/spot'),
    meta: {
      title: '币币详情',
      roles: 'crSpot'
    }
  },
  {
    path: 'cfd',
    name: 'capitalRecordCfd',
    component: _import('capitalRecord/cfd'),
    meta: {
      title: '差价详情',
      roles: 'crCfd'
    }
  },

  {
    path: 'coinapply',
    name: 'capitalRecordCoinapply',
    component: _import('capitalRecord/coinApply'),
    meta: {
      title: '申购记录',
      roles: 'coinApply'
    }
  }
  ]
},
{
  path: '/counts', // 统计报表
  name: 'counts',
  component: Main,
  // redirect: '/counts/index',
  meta: {
    title: '统计报表',
    icon: 'chart',
    roles: 'counts'
  },
  children: [{
    path: 'active',
    name: 'countsActive',
    component: _import('counts/Active'),
    meta: {
      title: '活跃统计',
      roles: 'countsActive'
    }
  },
  {
    path: 'user',
    name: 'countsUser',
    component: _import('counts/User'),
    meta: {
      title: '活跃用户',
      roles: 'countsUser'
    }
  },
  {
    path: 'silent',
    name: 'countsSilent',
    component: _import('counts/Silent'),
    meta: {
      title: '沉默用户',
      roles: 'countsSilent'
    }
  },
  {
    path: 'loss',
    name: 'countsLoss',
    component: _import('counts/Loss'),
    meta: {
      title: '流失用户',
      roles: 'countsLoss'
    }
  },
  {
    path: 'usdt',
    name: 'countsUsdt',
    component: _import('counts/Usdt'),
    meta: {
      title: 'USDT统计',
      roles: 'countsUsdt'
    }
  }
  ]
},
{
  path: '/order', // 挂单列表
  name: 'order',
  component: Main,
  // redirect: '/order/pay',
  meta: {
    title: '财务订单',
    icon: 'shoppingCard',
    roles: 'order'
  },
  children: [{
    path: 'pay',
    name: 'orderPay',
    component: _import('order/Pay'),
    meta: {
      title: '充值订单',
      roles: 'orderPay'
    }
  },
  {
    path: 'put',
    name: 'orderPut',
    component: _import('order/Put'),
    meta: {
      title: '提现管理',
      roles: 'orderPut'
    }
  },
  {
    path: 'address',
    name: 'orderAddress',
    component: _import('order/Address'),
    meta: {
      title: '地址管理',
      roles: 'orderAddress'
    }
  },
  {
    path: 'transfer',
    name: 'orderTransfer',
    component: _import('order/Transfer'),
    meta: {
      title: '转账订单',
      roles: 'orderTransfer'
    }
  },
  {
    path: 'activity',
    name: 'orderActivity',
    component: _import('order/Activity'),
    meta: {
      title: '活动订单',
      roles: 'orderActivity'
    }
  },
  {
    path: 'other',
    name: 'orderOther',
    component: _import('order/Other'),
    meta: {
      title: '其它订单',
      roles: 'orderOther'
    }
  },
  {
    path: 'list',
    name: 'orderList',
    component: _import('order/List'),
    meta: {
      title: '所有订单',
      roles: 'orderlist'
    }
  }
  ]
},
{
  path: '/operates', // 运营管理
  name: 'operates',
  component: Main,
  meta: {
    title: '运营管理',
    icon: 'theme',
    roles: 'operates'
  },
  children: [{
    path: 'notice',
    name: 'operatesNotice',
    component: _import('operates/Notice'),
    meta: {
      title: '公告管理',
      roles: 'notice'
    }
  },
  {
    path: 'advert',
    name: 'operatesAdvert',
    component: _import('operates/Advert'),
    meta: {
      title: '活动管理',
      roles: 'advert'
    }
  },
  {
    path: 'banner',
    name: 'operatesBanner',
    component: _import('operates/Banner'),
    meta: {
      title: '广告管理',
      roles: 'banner'
    }
  }, {
    path: 'luckHistory',
    name: 'operatesLuckHistory',
    component: _import('operates/LuckHistory'),
    meta: {
      title: '中奖历史',
      roles: 'luckHistory'
    }
  }
  ]
},
{
  path: '/mining', // 挖矿管理
  name: 'mine',
  component: Main,
  meta: {
    title: '挖矿管理',
    icon: 'mining',
    roles: 'mine'
  },
  children: [{
    path: 'logs',
    name: 'mineRecord',
    component: _import('mining/Logs'),
    meta: {
      title: '挖矿记录',
      roles: 'mineRecord'
    }
  },
  {
    hidden: true,
    path: 'detail',
    name: 'mineDetail',
    component: _import('mining/Detail'),
    meta: {
      title: '挖矿详情',
      roles: 'mineDetail'
    }
  }
  ]
},


{
  path: '/statis', // TDEx 统计报表
  name: 'statis',
  component: Main,
  meta: {
    title: '统计报表',
    icon: 'chart',
    roles: 'statistical'
  },
  children: [{
    path: 'balance',
    name: 'statisBalance',
    component: _import('statis/Balance'),
    meta: {
      title: '余额统计',
      roles: 'reportBalance'
    }
  },
  {
    path: 'money',
    name: 'statisMoney',
    component: _import('statis/Money'),
    meta: {
      title: '资金统计',
      roles: 'reportMoney'
    }
  },
  {
    path: 'stattd',
    name: 'statisStattd',
    component: _import('statis/Stattd'),
    meta: {
      title: 'TD监控',
      roles: 'reportStatTd'
    }
  },
  {
    path: 'user',
    name: 'statisUser',
    component: _import('statis/User'),
    meta: {
      title: '用户统计',
      roles: 'reportUser'
    }
  },
  {
    path: 'nexus',
    name: 'statisNexus',
    component: _import('statis/Nexus'),
    meta: {
      title: '邀请统计',
      roles: 'reportNexus'
    }
  },
  ]
},
{
  path: '/sendEmail', // TDEx 邮箱
  name: 'sendEmail',
  component: Main,
  meta: {
    title: '发送信息',
    icon: 'email',
    roles: 'message'
  },
  children: [{
    path: 'email',
    name: 'email',
    component: _import('sendEmail/email'),
    meta: {
      title: '发送邮件',
      roles: 'email'
    }
  },
  {
    path: 'shortMessage',
    name: 'shortMessage',
    component: _import('sendEmail/shortMessage'),
    meta: {
      title: '发送短信',
      roles: 'msg'
    }
  }
  ]
},
{
  path: '/cfdMonitor', // TDEx 邮箱
  name: 'cfdMonitor',
  component: Main,
  meta: {
    title: 'CFD后台监控',
    icon: 'email',
    roles: 'cfdMonitor'
  },
  children: [{
    path: 'cfdMonitorAccount',
    name: 'cfdMonitorAccount',
    component: _import('cfdMonitor/account'),
    meta: {
      title: '用户差价账户',
      roles: 'cfdMonitorAccount'
    }
  },
  {
    path: 'cfdMonitorStatistics',
    name: 'cfdMonitorStatistics',
    component: _import('cfdMonitor/statistics'),
    meta: {
      title: '差价产品盈亏统计',
      roles: 'cfdMonitorStatistics'
    }
  },
  {
    path: 'cfdMonitorHedge',
    name: 'cfdMonitorHedge',
    component: _import('cfdMonitor/hedge'),
    meta: {
      title: '对冲监控',
      roles: 'cfdMonitorHedge'
    }
  },
  {
    path: 'cfdMonitorRank',
    name: 'cfdMonitorRank',
    component: _import('cfdMonitor/rank'),
    meta: {
      title: '盈亏排行榜',
      roles: 'cfdMonitorRank'
    }
  },
  {
    path: 'cfdMonitorStatisticsWeek',
    name: 'cfdMonitorStatisticsWeek',
    component: _import('cfdMonitor/statisticsWeek'),
    meta: {
      title: '差价产品盈亏周统计',
      roles: 'cfdMonitorStatisticsWeek'
    }
  },
  ]
},
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
