import Vue from 'vue'
import Router from 'vue-router'
import Main from '@/views/Main'
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

Vue.use(Router)
const router = new Router({
  routes: [{
    path: '/',
    name: 'Main',
    component: Main,
    children: [{
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
      name: 'main.custotaltoc',
      path: 'custotaltoc',
      component: StatisCustotaltoc
    }, {
      name: 'main.statis_channel',
      path: 'statis_channel',
      component: StatisChannel
    }]
  }, {
    path: '/login',
    name: 'Login',
    component: Login
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
