<template>
  <div class="invoice-apply">
    <h3 class="vheader">发票管理</h3>
    <div class="invoice-declare">
      <div>
        <strong>未开发票金额</strong>
        <span>4320元</span>
        <el-button type="primary" @click="apply()">立即申请</el-button>
        <span>提醒：</span>
      </div>
      <ul>
        <li>每月仅10-20日可申请发票，未开发票金额为本月之前的累计未开发票总额（其中抵消掉退单已开具的发票金额）。</li>
        <li>第二年3月份前可申请上年发票，3月份及以后则不可申请。</li>
      </ul>
    </div>
    <el-tabs type="card" :value="activeName">
      <el-tab-pane label="发票申请查询" name="tab1">
        <Tab1></Tab1>
      </el-tab-pane>
      <el-tab-pane label="发票开具查询" name="tab2">
        <Tab2></Tab2>
      </el-tab-pane>
    </el-tabs>
  </div>
</template>

<script>
import InvoiceApplyTab1 from '@/views/components/channelCom/invoiceApplyTab1'
import InvoiceApplyTab2 from '@/views/components/channelCom/invoiceApplyTab2'
export default {
  data: function() {
    return {
      activeName: 'tab1',
      agents: []
    }
  },
  components: {
    Tab1: InvoiceApplyTab1,
    Tab2: InvoiceApplyTab2
  }
}
</script>

<style lang='stylus' scoped>
.invoice-apply
  .invoice-declare
    width: 100%;
    padding: 9px;
    border-radius: 3px;
    margin-bottom: 20px;
    font-size: 14px;
    background: #eee;
    overflow: hidden;
    div
      float: left;
      button
        margin: 0 20px;
      span
        color: red;
    ul
      float: left;
      list-style: initial;
      margin: 0;
      padding-left: 20px;
      color: red;
</style>
