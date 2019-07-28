export default {
  'adminLogin': '/admin/ajax/login', // 管理员登录
  'adminLogout': '/admin/ajax/loginout', // 管理员注销
  'adminResetPassword': '/admin/ajax/changepassword', // 修改管理员密码
  'adminModules': '/admin/ajax/modules', // 管理员可用模块
  'adminLogs': '/admin/ajax/adminlogs', // 管理员日志
  'adminLogsSearch': '/admin/ajax/adminlogssearch', // 管理员日志搜索
  'adminList': '/admin/ajax/getadmins', // 管理员账号列表
  'adminCreate': '/admin/ajax/generateadmin', // 管理员账号创建
  'adminRemove': '/admin/ajax/removeadmin', // 管理员账号删除
  'adminPassword': '/admin/ajax/changepassword', // 管理员账号密码修改
  'adminSetGroup': '/admin/ajax/setpermit', // 管理员权限组设置
  'adminPermitGroup': '/admin/ajax/permitgroupsaccess', // 所有权限组 -> 管理员模块

  'allPermitGroup': '/admin/ajax/permitgroups', // 所有权限组  -> 权限组模块
  'removePermitGroup': '/admin/ajax/removepermitgroup', // 删除权限组
  'newPermitGroup': '/admin/ajax/newpermitgroup', // 新建权限组
  'allModules': '/admin/ajax/getallmodules', // 所有模块
  'currentPermitModules': '/admin/ajax/permitmodules', // 当前权限组所拥有的模块
  'addPermitModule': '/admin/ajax/editpermitmodule', // 增加权限组模块
  'removePermitModule': '/admin/ajax/removepermitmodule', // 移除权限组模块

  'countsActive': '/admin/ajax/statis/getreguserbytime', // 活跃统计 -> 获取指定时间注册用户
  'countsUser': '/admin/ajax/statis/getactiveloginuser', // 统计用户
  'countsSilent': '/admin/ajax/statis/getuseractivestats', // 沉默用户
  'countsLoss': '/admin/ajax/statis/getuseractivestats', // 流失用户
  'countsUsdt': '/admin/ajax/statis/usdtrank', // USDT统计

  'orderPay': '/admin/ajax/orderpay/list', // 充值订单 
  'orderPaySearch': '/admin/ajax/orderpay/search', // 充值订单搜索
  'orderPut': '/admin/ajax/orderput/list', // 提现订单列表 
  'orderPutSearch': '/admin/ajax/orderput/search', // 提现订单搜索
  'orderTransfer': '/admin/ajax/ordertransfer/list', // 转账订单列表 
  'orderTransferSearch': '/admin/ajax/ordertransfer/search', // 转账订单搜索
  'orderActivity': '/admin/ajax/orderactivity/list', // 活动订单列表 
  // 'orderActivitySearch': '/admin/ajax/orderactivity/search', // 活动订单搜索
  'orderOther': '/admin/ajax/orderother/list', // 其它订单列表 
  'orderOtherSearch': '/admin/ajax/orderother/search', // 其它订单搜索
  'orderList': '/admin/ajax/orderlist', // 所有订单
  'orderWithdraw': '/admin/ajax/contract/withdraw', // 提现
  'orderChange': '/admin/ajax/contract/withdrawhandle', // 取消或完成提现
  'orderLogs': '/admin/ajax/contract/getwithdrawlogbyid',
  'futuresList': '/admin/ajax/reverse/historieslist', // 期货列表
  'futuresSearch': '/admin/ajax/reverse/historiessearch', // 期货搜索
  'futuresOrder': '/admin/ajax/reverse/orderslist', // 期货订单
  'futuresOrderSearch': '/admin/ajax/reverse/orderssearch', // 期货订单搜索
  'futuresPosition': '/admin/ajax/reverse/positionslist', // 期货持仓
  'futuresPositionSearch': '/admin/ajax/reverse/positionssearch', // 期货持仓搜索
  'futuresBurstlist': '/admin/ajax/reverse/burstlist', // 期货持仓搜索
  'futuresBurstsearch': '/admin/ajax/reverse/burstsearch', // 期货持仓搜索
  'futuresWalletlogslist': '/admin/ajax/reverse/walletlogslist', //  钱包记录
  'futuresWalletlogssearch': '/admin/ajax/reverse/walletlogssearch', //  搜索钱包记录
  'cfdList': '/admin/ajax/cfd/historieslist', // cfd列表
  'cfdSearch': '/admin/ajax/cfd/historiessearch', // cfd搜索
  'cfdOrder': '/admin/ajax/cfd/orderslist', // cfd订单
  'cfdOrderSearch': '/admin/ajax/cfd/orderssearch', // cfd订单搜索
  'cfdPosition': '/admin/ajax/cfd/positionslist', // cfd持仓
  'cfdPositionSearch': '/admin/ajax/cfd/positionssearch', // cfd持仓搜索
  'cfdHistoryPosition': '/admin/ajax/cfd/historypositionslist', // cfd持仓历史
  'cfdTdTotal': '/admin/ajax/cfd/tdtotal', // cfd Td手续费总和
  'cfdHistoryPositionSearch': '/admin/ajax/cfd/historypositionssearch', // cfd持仓历史搜索
  'spotsOrder': '/admin/ajax/spot/orderlist', // 现货订单
  'spotsOrderSearch': '/admin/ajax/spot/orderlistsearch', // 现货委托搜索
  'spotsList': '/admin/ajax/spot/detailslist', // 现货历史
  'spotsDetailsSearch': '/admin/ajax/spot/detailslistsearch', // 现货历史搜索
  'spotsHistory': '/admin/ajax/spot/historylist', // 现货历史
  'spotsHistorySearch': '/admin/ajax/spot/historylistsearch', // 现货历史搜索
  'markPrice': '/admin/ajax/markprice', // 标记价格 -> 计算盈亏
  'noticeList': '/admin/ajax/notice/list', // 公告列表
  'noticeEdit': '/admin/ajax/notice/edit', // 公告编辑
  'noticeAdd': '/admin/ajax/notice/add', // 公告添加
  'noticeDel': '/admin/ajax/notice/del', // 公告删除
  'advertList': '/admin/ajax/advert/list', // 广告列表
  'advertAdd': '/admin/ajax/advert/add', // 广告添加
  'advertEdit': '/admin/ajax/advert/edit', // 广告编辑
  'advertDel': '/admin/ajax/advert/del', // 广告删除
  'imageUpload': '/admin/ajax/image/upload',
  'imageDelete': '/admin/ajax/image/delete',
  'userList': '/admin/ajax/user/list', // 用户列表
  'userSearch': '/admin/ajax/user/searchuser', // 用户搜索
  'userOnlineChart': '/admin/ajax/center/charts', // 在线用户图表
  'userOnline': '/admin/ajax/center/sessionlist', // 在线用户
  'userOnlineSearch': '/admin/ajax/center/sessionlist', // 在线用户搜索
  'userLogs': '/admin/ajax/statis/getuserrequestlog', // 用户日志
  'userNexus': '/admin/ajax/statis/getuserinvite', // 邀请关系
  'userNexusSearch': '/admin/ajax/statis/getuserinvitesearch', // 邀请关系搜索
  'identlist': '/admin/ajax/otc/identlist', // 实名验证
  'identlistSearch': '/admin/ajax/otc/searchidentlist', // 实名验证搜索
  'unbindident': '/admin/ajax/otc/unbindident', // 取消实名验证
  'userFrozen': '/admin/ajax/user/freezeuser', // 用户冻结或解冻
  'userPassword': '/admin/ajax/user/changepassword', // 用户密码更改
  'userType': '/admin/ajax/user/changetype', // 用户类型更改
  'userUnbind': '/admin/ajax/user/unbind', // 用户绑定更改
  'userWallet': '/admin/ajax/user/wallet', // 用户钱包更改
  'userDeposit': '/admin/ajax/user/userdeposit', // 用户资产
  'userBill': '/admin/ajax/user/bill',
  'userDaiyu': '/admin/ajax/user/daiyu',
  'userDaiyu2': '/admin/ajax/user/daiyu2',
  'userChangeagentmode': '/admin/ajax/user/changeagentmode',
  'userPermissions': '/admin/ajax/user/permissions',
  'userSearchpermissions': '/admin/ajax/user/searchpermissions',

  'addressList': '/admin/ajax/center/addresslist', // 地址列表
  'addressSearch': '/admin/ajax/center/addresssearch', // 地址搜索
  'addressUnused': '/admin/ajax/center/addresslistunused', // 地址未使用总数
  'balance': '/admin/ajax/contract/getbalance', // 钱包余额
  'dashboard': '/admin/ajax/statis/dashboard', // 首页接口
  'mineList': '/admin/ajax/mine/list', // 挖矿日记
  'mineDeatil': '/admin/ajax/mine/detail', // 挖矿详情
  'week': '/admin/ajax/ranking/weekpureloss',

  'bannerAdd': '/admin/ajax/banner/add',
  'bannerEdit': '/admin/ajax/banner/edit',
  'bannerList': '/admin/ajax/banner/list',
  'bannerDel': '/admin/ajax/banner/del',

  'statisBalance': '/admin/ajax/report/balance', // 统计报表 -> 钱包余额
  'statisBalanceSearch': '/admin/ajax/balance/search', // 统计报表 -> 钱包余额搜索


  'reportUser': '/admin/ajax/report/user', //用户统计
  'reportToday': '/admin/ajax/report/today', //资金统计
  'reportSum': '/admin/ajax/report/sum', //资金统计
  'reportStattd': '/admin/ajax/report/stattd', //TD监控
  'reportAgentData': '/admin/ajax/report/agentData',
  'reportPlatform': '/admin/ajax/report/platform', //平台总数据

  'reportNexus': '/admin/ajax/report/nexus',
  'reportNexusSearch': '/admin/ajax/report/nexussearch', //平台总数据

  'capitalRecordReverse': '/admin/ajax/capitalRecord/reverse', //合约资金记录
  'capitalRecordReverseSearch': '/admin/ajax/capitalRecord/reverseSearch', //搜索合约资金记录
  'capitalRecordSpot': '/admin/ajax/capitalRecord/spot', //币币资金记录
  'capitalRecordSpotSearch': '/admin/ajax/capitalRecord/spotSearch', //搜索合约资金记录
  'capitalRecordCfd': '/admin/ajax/capitalRecord/cfd', //差价资金记录
  'capitalRecordCfdSearch': '/admin/ajax/capitalRecord/cfdSearch', //搜索合约资金记录
  'capitalRecordCoinApply': '/admin/ajax/capitalRecord/coinapply', //申购记录
  'capitalRecordCoinApplySearch': '/admin/ajax/capitalRecord/coinapplySearch', //搜索申购记录



  'emailList': '/admin/ajax/email/list', // 发送邮件 -> 用户列表
  'emailSearch': '/admin/ajax/email/search',
  'emailSend': '/admin/ajax/email/send',
  'emailAsk': '/admin/ajax/email/ask',



  'msgList': '/admin/ajax/msg/list',
  'msgSend': '/admin/ajax/msg/send',
  'msgSearch': '/admin/ajax/msg/search',

  'luckyList': '/admin/ajax/lucky/list',
  'luckySearch': '/admin/ajax/lucky/search',
  'luckyGetluckbydate': '/admin/ajax/lucky/getluckbydate',
  'luckyGetlucktotal': '/admin/ajax/lucky/getlucktotal',


  'coinExplorer':'/admin/ajax/etcdinfo/coinexplorer',
  'coinInfo':'/admin/ajax/etcdinfo/coininfo',


  'cfdAccount':'/admin/ajax/cfdmonitor/account',
  'cfdSearchAccount':'/admin/ajax/cfdmonitor/searchaccount',
  'cfdStatistics':'/admin/ajax/cfdmonitor/statistics',
  'cfdSearchStatistics':'/admin/ajax/cfdmonitor/searchstatistics',
  'cfdHedge':'/admin/ajax/cfdmonitor/hedge',
  'cfdSearchHedge':'/admin/ajax/cfdmonitor/searchhedge',
  'cfdRank':'/admin/ajax/cfdmonitor/rank',
  'cfdSearchRank':'/admin/ajax/cfdmonitor/searchrank',
  'cfdStatisticsWeek':'/admin/ajax/cfdmonitor/statisticsweek',
  'cfdSearchStatisticsWeek':'/admin/ajax/cfdmonitor/searchstatisticsweek',


  'otcSell':'/admin/ajax/otc/sell',
  
}
