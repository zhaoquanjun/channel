import Vue from 'vue'
import Router from 'vue-router'
import Main from '@/views/Main'
import Home from '@/views/Home'
import Login from '@/views/Login'
import AgentList from '@/views/Agent' // 代理管理list
import AgentAuth from '@/views/AgentAuth' // 代理审核
import Review from '@/views/review' // 订单审核
import OrderSearch from '@/views/orderSearch' // 订单查询
import CusReview from '@/views/CusReview' // 注册审核
import TobReview from '@/views/tobReview' // 记账审核
import InvoiceReview from '@/views/invoiceReview' // 发票审核
import InvoiceSearch from '@/views/invoiceSearch' // 发票查询
import Recharge from '@/views/recharge' // 财务信息
import Finance from '@/views/finance' // 财务明细
import RechargeCheck from '@/views/rechargeCheck' // 财务-充值审核
import FinanceStatis from '@/views/financeStatis' // 财务统计
import StatisConversion from '@/views/StatisConversion'  // 转化率分析
import StatisProportion from '@/views/StatisProportion'  // 占比分析
import StatisAchieve from '@/views/StatisAchieve'  // 业绩统计
import StatisPaytype from '@/views/StatisPaytype'  // 业绩统计
import FdList from '@/views/fandian' // 渠道返点
import FdSettings from '@/views/fdSettings' // 返点设置
import StatisCustotaltoc from '@/views/StatisCustotaltoc'  // 客户统计
import StatisChannel from '@/views/StatisChannel'  // 渠道统计
import UserList from '@/views/userList' // 员工管理
// import UserFq from '@/views/usersFq' // 分区设置
import PartitionManage from '@/views/partitionManage' // 大区管理
import OperateAccount from '@/views/operateAccount' // 做账数据管理--运营会计数据总览
import WaitSetAccount from '@/views/waitSetAccount' // 做账数据管理--待建账数据统计
import Receipt from '@/views/receipt' // 做账数据管理--传票数据统计
import MakeAccount from '@/views/makeAccount' // 做账数据管理--做账与报税数据统计
import StatisOrders from '@/views/statisOrders' // 业绩数据管理--订单统计
import StatisNewCustomers from '@/views/statisNewCustomers' // 业绩数据管理--新增客户统计
import StatisRenew from '@/views/statisRenew' // 续费数据管理
import StatisYtOdersTozsOders from '@/views/statisYtOdersTozsOders' // 流转数据管理
import StatisZeroTonoZero from '@/views/statisZeroTonoZero' // 流转数据管理--预提单转正式订单统一
import StatisCompanyType1To2 from '@/views/statisCompanyType1To2' // 流转数据管理--小规模转一般纳税人统计
import StatisOutwork from '@/views/statisOutwork' // 外勤数据管理
import ChargeType from '@/views/chargeType' // 充值类型设置
import PromotionType from '@/views/promotionType' // 活动类型设置
import Chargeback from '@/views/chargeback' // 退单记录
import YJViewDetails from '@/views/YJviewDetails' // 业绩数据管理-预提单&&零申报查看明细
import XFViewDetails from '@/views/XFviewDetails' // 续费数据管理-查看明细
import LZViewDetails from '@/views/LZViewDetails' // 流转数据管理-查看明细
import InfoList from '@/views/infolist' // 公告管理列表
import NoticeDetail from '@/views/noticeDetail' // 公告详情页

Vue.use(Router)
const router = new Router({
  routes: [{
    path: '/',
    name: 'Main',
    component: Main,
    children: [{
      name: 'main.home',
      path: '/',
      component: Home
    }, {
      name: 'main.agent',
      path: 'agent',
      component: AgentList
    }, {
      name: 'main.agentAuth',
      path: 'AgentAuth',
      component: AgentAuth
    }, {
      name: 'main.review',
      path: 'review',
      component: Review
    }, {
      name: 'main.cusReview',
      path: 'cusReview',
      component: CusReview
    }, {
      name: 'main.tobReview',
      path: 'tobReview',
      component: TobReview
    }, {
      name: 'main.orderSearch',
      path: 'orderSearch',
      component: OrderSearch
    }, {
      name: 'main.invoiceReview',
      path: 'invoiceReview',
      component: InvoiceReview
    }, {
      name: 'main.invoiceSearch',
      path: 'invoiceSearch',
      component: InvoiceSearch
    }, {
      name: 'main.chargebackRecord',
      path: 'chargebackRecord',
      component: Chargeback
    }, {
      name: 'main.recharge',
      path: 'recharge',
      component: Recharge
    }, {
      name: 'main.finance',
      path: 'finance',
      component: Finance
    }, {
      name: 'main.recharge_review',
      path: 'recharge_review',
      component: RechargeCheck
    }, {
      name: 'main.finance_statis',
      path: 'finance_statis',
      component: FinanceStatis
    }, {
      name: 'main.statis_conversion',
      path: 'statis_conversion',
      component: StatisConversion
    }, {
      name: 'main.statis_proportion',
      path: 'statis_proportion',
      component: StatisProportion
    }, {
      name: 'main.achieve',
      path: 'achieve',
      component: StatisAchieve
    }, {
      name: 'main.statis_paytype',
      path: 'statis_paytype',
      component: StatisPaytype
    }, {
      name: 'main.fd_list',
      path: 'fd_list',
      component: FdList
    }, {
      name: 'main.fd_settings',
      path: 'fd_settings',
      component: FdSettings
    }, {
      name: 'main.users',
      path: 'users',
      component: UserList
    }, {
      name: 'main.users_fq',
      path: 'users_fq',
      // component: UserFq
      component: PartitionManage
    }, {
      name: 'main.setPromotionType',
      path: 'setPromotionType',
      // component: UserFq
      component: PromotionType
    }, {
      name: 'main.setChargeType',
      path: 'setChargeType',
      component: ChargeType
    }, {
      name: 'main.custotaltoc',
      path: 'custotaltoc',
      component: StatisCustotaltoc
    }, {
      name: 'main.statis_channel',
      path: 'statis_channel',
      component: StatisChannel
    }, {
      name: 'main.operateAccount',
      path: 'operateAccount',
      component: OperateAccount
    }, {
      name: 'main.waitSetAccount',
      path: 'waitSetAccount',
      component: WaitSetAccount
    }, {
      name: 'main.receipt',
      path: 'receipt',
      component: Receipt
    }, {
      name: 'main.makeAccount',
      path: 'makeAccount',
      component: MakeAccount
    }, {
      name: 'main.statis_orders',
      path: 'statis_orders',
      component: StatisOrders
    }, {
      name: 'main.statis_achieve',
      path: 'statis_achieve',
      component: StatisAchieve
    }, {
      name: 'main.statis_newCustomers',
      path: 'statis_newCustomers',
      component: StatisNewCustomers
    }, {
      name: 'main.statis_renew',
      path: 'statis_renew',
      component: StatisRenew
    }, {
      name: 'main.statis_ytOdersTozsOders',
      path: 'statis_ytOdersTozsOders',
      component: StatisYtOdersTozsOders
    }, {
      name: 'main.statis_ZeroTonoZero',
      path: 'statis_ZeroTonoZero',
      component: StatisZeroTonoZero
    }, {
      name: 'main.statis_companyType1To2',
      path: 'statis_companyType1To2',
      component: StatisCompanyType1To2
    }, {
      name: 'main.statis_outwork',
      path: 'statis_outwork',
      component: StatisOutwork
    }, {
      name: 'InfoList',
      path: 'info_list',
      component: InfoList
    }, {
      name: 'NoticeDetail',
      path: '/noticeDetails',
      component: NoticeDetail
    }]
  }, {
    path: '/login',
    name: 'Login',
    component: Login
  }, {
    name: 'YJviewDetails',
    path: '/YJ-viewDetails',
    component: YJViewDetails
  }, {
    name: 'XFviewDetails',
    path: '/XF-viewDetails',
    component: XFViewDetails
  }, {
    name: 'LZviewDetails',
    path: '/LZ-viewDetails',
    component: LZViewDetails
  }]
})

router.beforeEach((to, from, next) => {
  // console.log(localStorage.getItem('userInfo'), 'userInfo')
  if (!sessionStorage.getItem('userInfo')) {
    if (to.name === 'Login') {
      next()
    }
    next('/login')
  } else {
    next()
  }
})

export default router
