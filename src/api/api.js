import axios from 'axios'
import {
  Loading,
  Message
} from 'element-ui'

let base = '/api'
let loadingInstance1
let ajaxCount = 0

axios.interceptors.request.use(function(config) {
  ajaxCount++
  if (ajaxCount > 0) {
    loadingInstance1 = Loading.service({
      fullscreen: true
    })
  }
  return config
}, function(error) {
  if (ajaxCount === 0) loadingInstance1.close()
  return Promise.reject(error)
})

axios.interceptors.response.use(function(response) {
  ajaxCount--
  if (ajaxCount === 0) loadingInstance1.close()
  if (!response.data.status) {
    Message.error({
      message: response.data.message,
      duration: 3000
    })
  }
  return response
}, function(error) {
  // error.response.status
  ajaxCount--
  if (ajaxCount === 0) loadingInstance1.close()
  if (error.response && error.response.status === 401) location.replace('#/login')
  console.log(error)
  return Promise.reject(error)
})

let cache = {}
let cacheFn = {}

function useCache(url, params) {
  const result = getFromCache(url, params)
  if (result) {
    return new Promise(function(resolve, reject) {
      if (result === 'Loading') {
        setCashFn(url, params, (r) => {
          resolve(r)
        })
      } else {
        setTimeout(() => {
          return resolve(result)
        }, 0)
      }
    })
  } else {
    saveToCache(url, params, 'Loading')
    return axios.get(url, params).then(res => {
      saveToCache(url, params, res.data)
      return res.data
    })
  }
}

function setCashFn(key, params, fn) {
  let paramKey = getParamKey(key, params)
  if (cacheFn[paramKey]) {
    cacheFn[paramKey].push(fn)
  } else {
    cacheFn[paramKey] = [fn]
  }
}

function saveToCache(key, params, data) {
  let paramKey = getParamKey(key, params)
  cache[paramKey] = data
  runCacheFn(key, params, data)
}

function runCacheFn(key, params, data) {
  if (data === 'Loading') return
  let paramKey = getParamKey(key, params)
  const fn = cacheFn[paramKey]
  if (fn) {
    fn.forEach(f => f(data))
  }
}

function getFromCache(key, params, data) {
  let paramKey = getParamKey(key, params)
  return cache[paramKey]
}

function getParamKey(key, params) {
  if (params) {
    return key + '-' + JSON.stringify(params)
  } else {
    return key
  }
}

// 登录
export const requestLogin = params => {
  return axios.post(`${base}/security/login`, params).then(res => res.data)
}

// 修改密码
export const resetPwd = params => {
  return axios.put(`${base}/account/pwd/reset`, params)
}
// 退出登录
export const logout = () => {
  return axios.delete(`${base}/security/logout`).then(res => res.data)
}

// 代理商管理
// --获取渠道列表 && 财务管理--财务信息列表 && 渠道返点列表
export const getAgents = params => {
  return axios.get(`${base}/agent`, {
    params: params
  }).then(res => res.data)
}
// 代理审核
export const agentAuth = params => {
  return axios.get(`${base}/agent/audit/`, {
    params: params
  }).then(res => res.data)
}

// 代理商审核-删除
export const remove = (ChannelId) => {
  return axios.delete(`${base}/agent/${ChannelId}`).then(res => res.data)
}

// 代理商审核-通过
export const pass = (channelId, data) => {
  return axios.put(`${base}/checkagent/${channelId}`, data).then(res => res.data)
}
// --获取城市列表
export const getCities = params => {
  return axios.get(`${base}/code/city`).then(res => res.data)
}
// --获取渠道详细信息
export const getAgent = params => {
  return axios.get(`${base}/agent/${params}`).then(res => res.data)
}
// --保存渠道详细信息
export const saveAgent = params => {
  if (!params.ChannelId) {
    return axios.post(`${base}/agent`, params).then(res => res.data)
  } else {
    return axios.put(`${base}/agent/${params.ChannelId}`, params).then(res => res.data)
  }
}
// --设置折扣
export const setDiscount = (channelid, params) => {
  return axios.put(`${base}/agent/${channelid}/discount`, params).then(res => res.data)
}
// --设置是否有下级
export const setIsFetation = (channelid, params) => {
  return axios.put(`${base}/agent/${channelid}/fetation`, params).then(res => res.data)
}
// --获取礼包类型
export const getGiftTypes = params => {
  return axios.get(`${base}/gifttype`).then(res => res.data)
}
// --获取礼包列表
export const getGifts = params => {
  return axios.get(`${base}/gift`, {
    params: params
  }).then(res => res.data)
}
// --增加列表
export const addGift = (params) => {
  return axios.post(`${base}/gift`, params).then(res => res.data)
}
// --删除礼包
export const deleteGift = (giftId) => {
  return axios.delete(`${base}/gift/${giftId}`).then(res => res.data)
}

// 通用- searchParams
// 大区列表
export const getPartitions = params => {
  return useCache(`${base}/channelpartition`, null)
}
// 省份列表 params: {ChannelPartitionIds: ''}
export const getParamsProvince = params => {
  return useCache(`${base}/dataanalysis/provinceinfo`, {
    params: params
  })
}
// 省份列表 params:
export const getProvince = params => {
  return useCache(`${base}/code/province`, {
    params: params
  })
}
export const getProvinceNew = () => {
  return axios.get(`${base}/channelpartition/province`).then(res => res.data)
}
export const getProvinceModify = (id) => {
  return axios.get(`${base}/channelpartition/province?id=${id}`).then(res => res.data)
}
// 城市列表 params: {ChannelPartitionIds: '', pcodes: ''}
export const getParamsCities = params => {
  return useCache(`${base}/dataanalysis/cityinfo`, {
    params: params
  })
}

// 转化率分析
// 0申报转小规模{offset,limit,ccodes,channelname,starttime,endtime=}
export const getZerotosmall = params => {
  return axios.get(`${base}/dataanalysis/zerotosmall`, {
    params: params
  }).then(res => res.data)
}
// 0申报转一般纳税人{offset,limit,ccodes,channelname,starttime,endtime=}
export const getZerotogeneral = params => {
  return axios.get(`${base}/dataanalysis/zerotogeneral`, {
    params: params
  }).then(res => res.data)
}
// 预提单转化正式订单{offset,limit,ccodes,channelname,starttime,endtime=}
export const getWithholdToOfficial = params => {
  return axios.get(`${base}/dataanalysis/withholdtoofficial`, {
    params: params
  }).then(res => res.data)
}
// 小规模转一般纳税人{offset,limit,ccodes,channelname,starttime,endtime=}
export const getSmallToGeneral = params => {
  return axios.get(`${base}/dataanalysis/smalltogeneral`, {
    params: params
  }).then(res => res.data)
}

// 占比分析
// 零申报占总订单数占比{offset,limit,ccodes,channelname,year,months}
export const getZeroToAll = params => {
  return axios.get(`${base}/dataanalysis/zerotoall`, {
    params: params
  }).then(res => res.data)
}
export const getZeroToAllChart = params => {
  return axios.get(`${base}/dataanalysis/zerotoallchart`, {
    params: params
  }).then(res => res.data)
}
// 新签与续费订单占比
export const getNewtorenew = params => {
  return axios.get(`${base}/dataanalysis/renew`, {
    params: params
  }).then(res => res.data)
}
export const getNewtorenewchart = params => {
  return axios.get(`${base}/dataanalysis/renewchart`, {
    params: params
  }).then(res => res.data)
}
// 预提单占比{offset,limit,ccodes,channelname,year,months}
export const getReneworofficial = params => {
  return axios.get(`${base}/dataanalysis/reneworofficial`, {
    params: params
  }).then(res => res.data)
}
export const getReneworofficialChart = params => {
  return axios.get(`${base}/dataanalysis/reneworofficialchart`, {
    params: params
  }).then(res => res.data)
}
// 客户统计
// 到期为续费客户统计
export const getNotrenewstatistics = params => {
  return axios.get(`${base}/dataanalysis/notrenewstatistics`, {
    params: params
  }).then(res => res.data)
}
// 新增客户统计
export const getNewCustomer = params => {
  return axios.get(`${base}/newcustomer`, {
    params: params
  }).then(res => res.data)
}
// 客户情况统计
export const getCustomerForCenter = params => {
  return axios.get(`${base}/customerforcenter`, {
    params: params
  }).then(res => res.data)
}
// 新增客户环比
export const getNewquarter = params => {
  return axios.get(`${base}/dataanalysis/newquarter`, {
    params: params
  }).then(res => res.data)
}

// 代理商统计
// 代理商充值统计
export const getPrepaynote = params => {
  return axios.get(`${base}/dataanalysis/prepaynote`, {
    params: params
  }).then(res => res.data)
}
// 总数据分析
export const getAgenttotal = params => {
  return axios.get(`${base}/dataanalysis/agenttotal`, {
    params: params
  }).then(res => res.data)
}
// 票据分析
export const getAgentreceipt = params => {
  return axios.get(`${base}/dataanalysis/agentreceipt`, {
    params: params
  }).then(res => res.data)
}
// 税期数据分析
export const getAgenttaxday = params => {
  return axios.get(`${base}/dataanalysis/agenttaxday`, {
    params: params
  }).then(res => res.data)
}

// 业绩查询
export const getAgentsReports = params => {
  return axios.get(`${base}/agentsreports`, {
    params: params
  }).then(res => res.data)
}
// 签单类型统计
export const getAgentsOrderType = params => {
  return axios.get(`${base}/agentordernum`, {
    params: params
  }).then(res => res.data)
}
// 订单管理
// 订单审核列表 && 订单查询
export const review = params => {
  return axios.get(`${base}/orders/agent/`, {
    params: params
  }).then(res => res.data)
}
// 订单审核列表--代理商查询
export const agents = params => {
  return axios.get(`${base}/agent/dict`).then(res => res.data)
}
// 订单审核--通过
export const passO = (OrderId) => {
  return axios.put(`${base}/orders/audit/${OrderId}`).then(res => res.data)
}
export const CheckIsConnectDate = params => {
  return axios.get(`${base}/order/CheckIsConnectDate`, {
    params: params
  }).then(res => res.data)
}
// 订单审核--驳回 && 订单注册审核--驳回 && 记账审核--驳回
export const backO = params => {
  return axios.put(`${base}/orders/back`, params).then(res => res.data)
}
// 订单查询--删除
export const deleteSearch = (OrderId) => {
  return axios.delete(`${base}/orders/${OrderId}`).then(res => res.data)
}
// 订单查询--修改同步官方工商信息
export const getcustomerupdatebygs = params => {
  return axios.get(`${base}/order/getcustomerupdatebygs?word=${params}`).then(res => res.data)
}
// 订单查询--修改上传识别身份证
export const getpersoncardbypath = params => {
  return axios.get(`${base}/order/getpersoncardbypath?path=${params}`).then(res => res.data)
}
// 订单审核--审核回退
export const rebackSearch = (OrderId) => {
  return axios.put(`${base}/orderauditback?orderid=${OrderId}`).then(res => res.data)
}
// 订单查询--退单信息
export const chargebackorderList = params => {
  return axios.get(`${base}/order/getchargebackorder`, {
    params: params
  }).then(res => res.data)
}
export const chargebackorder = params => {
  return axios.post(`${base}/order/chargebackorder`, params).then(res => res.data)
}
// 订单审核--挂起
export const guaqiSearch = params => {
  return axios.put(`${base}/toagent/hangupcustomer`, params).then(res => res.data)
}
// 订单注册审核
export const cusReview = params => {
  return axios.get(`${base}/orderszj/agent/`, {
    params: params
  }).then(res => res.data)
}
// 订单注册审核--通过
export const cusReviewPass = (OrderId) => {
  return axios.put(`${base}/orderszj/audit/${OrderId}`).then(res => res.data)
}
// 订单管理--记账审核列表
export const tobReview = params => {
  return axios.get(`${base}/orderszj2/agent/`, {
    params: params
  }).then(res => res.data)
}
// 订单管理--记账审核--通过
export const tobReviewPass = (OrderId) => {
  return axios.put(`${base}/orderszj2/audit/${OrderId}`).then(res => res.data)
}
// 订单管理--订单查看
export const orderTitle = (OrderId) => {
  return axios.get(`${base}/orders/${OrderId}`).then(res => res.data)
}
// 订单修改
export const modifyOrders = (OrderId, params) => {
  return axios.put(`${base}/orders/${OrderId}`, params).then(res => res.data)
}
// 订单查询--所属行业
export const industry = () => {
  return axios.get(`${base}/code/industry`).then(res => res.data)
}
// 订单查询--所属城市
export const citybychannel = () => {
  return axios.get(`${base}/citybychannel`).then(res => res.data)
}
// 订单查询--公司性质
export const cityprice = (cityCode, channelid, ischeck) => {
  return axios.get(`${base}/cityprice?cityCode=${cityCode}&channelid=${channelid}&ischeck=${ischeck}`).then(res => res.data)
}
// 图片上传
export const urlsignkey = () => {
  return axios.get(`${base}/signkey`).then(res => res.data)
}
// 订单管理--退单记录
export const getchargebackorderlist = params => {
  return axios.get(`${base}/order/getchargebackorderlist`, {
    params: params
  }).then(res => res.data)
}

// 发票管理
// 发票管理--发票审核列表
export const invoice = params => {
  return axios.get(`${base}/invoice/agent/`, {
    params: params
  }).then(res => res.data)
}
// 发票管理--发票审核--查看详细信息
export const viewInvoice = (InvoiceId) => {
  return axios.get(`${base}/invoice/${InvoiceId}`).then(res => res.data)
}
// 发票管理--发票审核--发票项目
export const invoiceType = () => {
  return axios.get(`${base}/invoice/type`).then(res => res.data)
}
//  发票管理--发票审核--开具发票 && 发票管理--发票审核--拒绝发票
export const operateInvoice = (invoiceId, params) => {
  return axios.put(`${base}/invoice/agent/audit/${invoiceId}`, params).then(res => res.data)
}
// 发票管理--发票查询
export const invoiceSearch = params => {
  return axios.get(`${base}/invoice/agent/issue`, {
    params: params
  }).then(res => res.data)
}
// 财务管理--财务明细列表
export const financeDetail = params => {
  return axios.get(`${base}/finance/agent/detail`, {
    params: params
  }).then(res => res.data)
}
// 财务管理--充值
export const finance = params => {
  return axios.post(`${base}/finance/AddFinancePrepaidRecord`, params).then(res => res.data)
}
// 财务管理--财务信息--充值类型下拉列表 && 管理平台--充值类型设置列表
export const allRechargeType = () => {
  return axios.get(`${base}/finance/GetAllRechargeType`).then(res => res.data)
}
// 充值类型设置--添加
export const addNewRechargeType = (record) => {
  return axios.post(`${base}/finance/AddNewRechargeType?name=${record}`).then(res => res.data)
}
// 充值类型设置--添加
export const updateRechargeType = (record, id) => {
  return axios.put(`${base}/finance/UpdateRechargeType?name=${record}&id=${id}`).then(res => res.data)
}
// 充值类型设置--添加
export const deleteRechargeType = (id) => {
  return axios.delete(`${base}/finance/DeleteRechargeType?id=${id}`).then(res => res.data)
}
// 财务管理--充值明细 && 财务管理--财务明细列表
export const rechargeDetail = params => {
  return axios.get(`${base}/finance/detail`, {
    params: params
  }).then(res => res.data)
}
// 财务管理--充值审核--充值订单列表
export const rechargeList = params => {
  return axios.get(`${base}/finance/getprepai/list`, {
    params: params
  }).then(res => res.data)
}
// 财务管理--充值审核--订单查看
export const rechargeListDetail = (Id) => {
  return axios.get(`${base}/finance/getprepai?id=${Id}`).then(res => res.data)
}
// 财务管理--充值审核--通过
export const rechargePass = params => {
  return axios.put(`${base}/finance/applyprepai`, params).then(res => res.data)
}
// 财务管理--充值审核--拒绝
export const rechargeRefuse = params => {
  return axios.put(`${base}/finance/putprepai`, params).then(res => res.data)
}
// 财务管理--财务统计--充值明细表
export const getrechargedetails = params => {
  return axios.get(`${base}/finance/getrechargedetails`, {
    params: params
  }).then(res => res.data)
}
// 财务管理--财务统计--支付明细表
export const getpaymentdetails = params => {
  return axios.get(`${base}/finance/getpaymentdetails`, {
    params: params
  }).then(res => res.data)
}
// 财务管理--财务统计--代理商当前余额表
export const getcurrentbalancedetails = params => {
  return axios.get(`${base}/finance/getcurrentbalancedetails`, {
    params: params
  }).then(res => res.data)
}
// 财务管理--财务统计--返点明细表
export const getrebatedetails = params => {
  return axios.get(`${base}/finance/getrebatedetails`, {
    params: params
  }).then(res => res.data)
}
// 财务管理--财务统计--发票明细清单
export const getinvoicesdetails = params => {
  return axios.get(`${base}/finance/getinvoicesdetails`, {
    params: params
  }).then(res => res.data)
}
// 财务管理--财务统计--扣减一代提成
export const getDeduteTab = params => {
  return axios.get(`${base}/finance/GetDeduteTab`, {
    params: params
  }).then(res => res.data)
}

// 渠道返点--代理商任务设置获取列表 $$ 提交新增任务
export const setTask = params => {
  return axios.get(`${base}/salestask`, {
    params: params
  }).then(res => res.data)
}
export const saveTask = params => { // 新增是post修改时put
  return axios.put(`${base}/salestask`, params).then(res => res.data)
}
export const saveTaskPost = params => {
  return axios.post(`${base}/salestask`, params).then(res => res.data)
}
// 渠道返点--返点设置
export const codereward = () => {
  return axios.get(`${base}/codereward`).then(res => res.data)
}
// 渠道返点--返点
export const fdSalestask = params => {
  return axios.get(`${base}/salestask`, {
    params: params
  }).then(res => res.data)
}
export const fdRewardnotes = params => {
  return axios.get(`${base}/rewardnotes`, {
    params: params
  }).then(res => res.data)
}
// 渠道返点-计算
export const fetch = params => {
  return axios.post(`${base}/rewardnotes`, params).then(res => res.data)
}
// 渠道返点--返点设置
export const confirmback = params => {
  return axios.put(`${base}/confirmback`, params).then(res => res.data)
}
// 渠道返点--渠道返点设置--增加设置
export const addCodereward = params => {
  return axios.post(`${base}/codereward`, params).then(res => res.data)
}
// 渠道返点--删除
export const deleteItem = (Id) => {
  return axios.delete(`${base}/codereward?id=${Id}`).then(res => res.data)
}

// 管理平台
// 员工管理--树形分支
export const userTree = () => {
  return axios.get(`${base}/departments`).then(res => res.data)
}
// 员工管理--新增组织结构
export const addTree = params => {
  return axios.post(`${base}/departments`, params).then(res => res.data)
}
// 员工管理--删除组织结构移动它下面的数据到新的组织结构(参数删除的id 被移入的id)
export const deleteTree = (deleteId, newId) => {
  return axios.delete(`${base}/departments/${deleteId}/${newId}`).then(res => res.data)
}
// 员工管理--全部数据列表
export const usersList = (Id, params) => {
  return axios.get(`${base}/account/${Id}`, {
    params: params
  }).then(res => res.data)
}
// 员工管理--获取角色列表
export const getRoles = () => {
  return axios.get(`${base}/code/role`).then(res => res.data)
}
// 员工管理--获取对应角色下的权限列表
export const getFunctions = (roleId) => {
  return axios.get(`${base}/function/${roleId}`).then(res => res.data)
}
// 员工管理--新增员工
export const account = params => {
  return axios.post(`${base}/account`, params).then(res => res.data)
}
// 员工管理--修改员工信息
export const accountChange = (userId, params) => {
  return axios.put(`${base}/account/${userId}`, params).then(res => res.data)
}
// 员工管理--删除员工信息
export const removeUser = (userId) => {
  return axios.delete(`${base}/account/${userId}`).then(res => res.data)
}
// 员工管理--大区列表
// export const getFqList = () => {
//   return axios.get(`${base}/channelpartition`).then(res => res.data)
// }
export const getFqList = (params) => {
  return axios.get(`${base}/channelpartition`, {params: params}).then(res => res.data)
}
// 员工管理--分区管理--渠道列表
export const getChannel = (id) => {
  return axios.get(`${base}/channelpartition/${id}`).then(res => res.data)
}
// 新增分区
export const addFq = (params) => {
  return axios.post(`${base}/channelpartition`, params).then(res => res.data)
}
// 修改大区
export const modifyFq = (params) => {
  return axios.put(`${base}/channelpartition`, params).then(res => res.data)
}
// 员工管理--删除分区
export const deleteFq = (id) => {
  return axios.delete(`${base}/channelpartition/${id}`).then(res => res.data)
}
// 员工管理--分区配置--新增渠道
export const newChannel = (id, params) => {
  return axios.put(`${base}/channelpartition/${id}`, params).then(res => res.data)
}
// 员工管理--新增渠道model
export const channelAgents = params => {
  return axios.get(`${base}/agent`, {
    params: params
  }).then(res => res.data)
}
// 价格列表 {cityCode}
export const getPrices = (params) => {
  return axios.get(`${base}/cityprice`, {
    params: params
  }).then(res => res.data)
}

// 获取活动种类
export const getPromotion = (params) => {
  return axios.get(`${base}/promotion`).then(res => res.data)
}
// 获取活动配置 {ChannelId:...}
export const getPromotionConfig = (params) => {
  return axios.get(`${base}/promotionconfig`, {
    params: params
  }).then(res => res.data)
}
// 删除活动配置 params 活动Id
export const deletePromotionConfig = (params) => {
  return axios.delete(`${base}/promotionconfig/${params}`).then(res => res.data)
}
// 添加活动配置
export const addPromotionConfig = (params) => {
  return axios.post(`${base}/promotionconfig/`, params).then(res => res.data)
}
// 获取客户设置
export const getCustomerSettings = (params) => {
  return axios.get(`${base}/cuscategory`, {
    params: params
  }).then(res => res.data)
}
// 保存客户设置
export const saveCustomerSettings = (params) => {
  return axios.put(`${base}/cuscategory`, params).then(res => res.data)
}
// 获取渠道礼包数量
export const getChannelGift = (params) => {
  return axios.get(`${base}/gift`, {
    params: params
  }).then(res => res.data)
}
// 获取数据权限相关表
export const dataauthorityinfos = () => {
  return axios.get(`${base}/dataauthorityinfos`).then(res => res.data)
}
// 做账数据管理--运营会计数据总览
export const agenttotalcustomer = params => {
  return axios.get(`${base}/dataanalysis/agenttotalcustomer`, {
    params: params
  }).then(res => res.data)
}
// 做账数据管理--待建账数据统计
export const agentrecallcustomer = params => {
  return axios.get(`${base}/dataanalysis/agentrecallcustomer`, {
    params: params
  }).then(res => res.data)
}
// 做账数据管理--传票数据统计
export const agentreceiptcustomer = params => {
  return axios.get(`${base}/dataanalysis/agentreceiptcustomer`, {
    params: params
  }).then(res => res.data)
}
// 做账数据管理--做账与报税数据统计
export const agentaccountcustomer = params => {
  return axios.get(`${base}/dataanalysis/agentaccountcustomer`, {
    params: params
  }).then(res => res.data)
}
// 业绩管理-订单统计
export const getStatisOrders = params => {
  return axios.get(`${base}/report/getorderstotalnum`, {
    params: params
  }).then(res => res.data)
}
// 业绩管理--订单统计--预提单下载查看详情
export const ytdDetails = params => {
  return axios.get(`${base}/dataanalysis/getreserveorders`, {
    params: params
  }).then(res => res.data)
}
// 业绩管理--订单统计--零申报下载查看详情
export const zsbDetails = params => {
  return axios.get(`${base}/dataanalysis/getzeroorders`, {
    params: params
  }).then(res => res.data)
}
// 业绩管理-续费管理
export const getStatisRenew = params => {
  return axios.get(`${base}/report/getreordersnum`, {
    params: params
  }).then(res => res.data)
}
// 续费管理--到期客户数下载查看详情
export const dqDetails = params => {
  return axios.get(`${base}/dataanalysis/getexpireorderdetails`, {
    params: params
  }).then(res => res.data)
}
// 续费管理--未续费客户数下载查看详情
export const wxfdDetails = params => {
  return axios.get(`${base}/dataanalysis/getnoreorderdetails`, {
    params: params
  }).then(res => res.data)
}
// 续费管理--已续费客户数下载查看详情
export const yxfDetails = params => {
  return axios.get(`${base}/dataanalysis/getreorderdetails`, {
    params: params
  }).then(res => res.data)
}
// 流转数据管理--预提单转正式订单统计
export const getStatisYtOdersTozsOders = params => {
  return axios.get(`${base}/dataanalysis/beforetoformalsearch`, {
    params: params
  }).then(res => res.data)
}
// 流转数据管理--零申报转非零申报统计
export const getStatisZeroTonoZero = params => {
  return axios.get(`${base}/dataanalysis/Iszerostatistics`, {
    params: params
  }).then(res => res.data)
}
// 流转数据管理--小规模转一般纳税人统计
export const getStatisCompany1to2 = params => {
  return axios.get(`${base}/dataanalysis/littletoformal`, {
    params: params
  }).then(res => res.data)
}
// 流转数据管理--预提单转正式订单--预提单数量下载查看详情
export const LZytdDetails = params => {
  return axios.get(`${base}/dataanalysis/getbeforehandlist`, {
    params: params
  }).then(res => res.data)
}
// 流转数据管理--预提单转正式订单--转正式订单数量数量下载查看详情
export const LZzzsDetails = params => {
  return axios.get(`${base}/dataanalysis/gettoformallist`, {
    params: params
  }).then(res => res.data)
}
// 流转数据管理--零申报转非零申报--零申报下载查看详情
export const LZzsbDetails = params => {
  return axios.get(`${base}/dataanalysis/getzerolist`, {
    params: params
  }).then(res => res.data)
}
// 流转数据管理--零申报转非零申报--转小规模下载查看详情
export const LZzToxgmDetails = params => {
  return axios.get(`${base}/dataanalysis/gettolittlelist`, {
    params: params
  }).then(res => res.data)
}
// 流转数据管理--零申报转非零申报--转一般纳税人下载查看详情
export const LZzToybDetails = params => {
  return axios.get(`${base}/dataanalysis/getzerotoformallist`, {
    params: params
  }).then(res => res.data)
}
// 流转数据管理--小规模转一般纳税人--小规模下载查看详情
export const LZlittleDetails = params => {
  return axios.get(`${base}/dataanalysis/getlittlelist`, {
    params: params
  }).then(res => res.data)
}
// 流转数据管理--小规模转一般纳税人--小规模转一般纳税人下载查看详情
export const LZxToybDetails = params => {
  return axios.get(`${base}/dataanalysis/getlittletoformallist`, {
    params: params
  }).then(res => res.data)
}
// 外勤数据管理
export const getStatisOutwork = params => {
  return axios.get(`${base}/dataanalysis/gettasknum`, {
    params: params
  }).then(res => res.data)
}
// 活动类型设置--通用活动列表
export const getgloblepromotionlist = params => {
  return axios.get(`${base}/newpromotion/getgloblepromotionlist`, {
    params: params
  }).then(res => res.data)
}
// 活动类型设置--代理商活动列表
export const getchannelpromotionlist = params => {
  return axios.get(`${base}/newpromotion/getchannelpromotionlist`, {
    params: params
  }).then(res => res.data)
}
// 活动类型设置--添加活动类型
export const addpromotion = (params) => {
  return axios.post(`${base}/newpromotion/addpromotion`, params).then(res => res.data)
}
// 活动类型设置--get修改活动类型通用活动
export const globlepromotionDetail = params => {
  return axios.get(`${base}/newpromotion/getgloblepromotion`, {
    params: params
  }).then(res => res.data)
}
// 活动类型设置--get修改活动类型代理商修改活动
export const GetChannelPromotion = params => {
  return axios.get(`${base}/newpromotion/GetChannelPromotion`, {
    params: params
  }).then(res => res.data)
}
// 活动类型设置--修改活动类型
export const Updatepromotion = (params) => {
  return axios.put(`${base}/newpromotion/updatepromotion`, params).then(res => res.data)
}
// 活动类型设置--代理商修改通用活动类型
export const updategloblepromotionbychannel = (params) => {
  return axios.put(`${base}/newpromotion/updategloblepromotionbychannel`, params).then(res => res.data)
}
// 活动类型设置--删除活动类型通用和代理商自己
export const deletepromotion = (id) => {
  return axios.delete(`${base}/newpromotion/deletepromotion/${id}`).then(res => res.data)
}
// 活动类型设置--删除活动类型代理商删除通用
export const deletechannelpromotion = (id) => {
  return axios.delete(`${base}/newpromotion/deletechannelpromotion/${id}`).then(res => res.data)
}
