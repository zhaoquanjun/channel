<template>
  <div class="invoice-apply">
    <h3 class="vheader">发票管理</h3>
    <div class="invoice-declare">
      <div>
        <strong>未开发票金额</strong>
        <span>{{balance}}元</span>
        <el-button type="primary" @click="apply()">立即申请</el-button>
      </div>
      <ul>
        <div>【温馨提示】</div>
        <li>1、每月仅10-20日可申请发票，未开发票金额为本月之前的累计未开发票总额（其中抵消掉退单已开具的发票金额）。</li>
        <li>2、第二年3月份前可申请上年发票，3月份及以后则不可申请。</li>
      </ul>
    </div>
    <div class="vsearch">
      <el-form ref="params" :inline="true" :model="params">
        <el-form-item label="发票申请编号">
          <el-input v-model="params.invoiceid"></el-input>
        </el-form-item>
        <el-form-item label="代理商">
          <el-input v-model="params.channelname"></el-input>
        </el-form-item>
        <el-form-item class="select-width" label="状态">
          <el-select v-model="params.status">
            <el-option v-for="item in Status" :key="item.status" :label="item.statusName" :value="item.status">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="">
          <el-date-picker v-model="params.start" type="date" :clearable="clearable" placeholder="开始日期">
          </el-date-picker>
          <span>-</span>
          <el-date-picker v-model="params.end" type="date" :clearable="clearable" placeholder="结束日期">
          </el-date-picker>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="onSearch">查询</el-button>
        </el-form-item>
      </el-form>
    </div>
    <el-table :data="tableData" border header-align="left" style="width: 100%">
      <el-table-column prop="InvoiceId" label="编号" width="170"></el-table-column>
      <el-table-column prop="ChannelName1" label="一级代理商" min-width="150"></el-table-column>
      <el-table-column prop="ChannelName2" label="二级代理商" min-width="100"></el-table-column>
      <el-table-column prop="Title" label="发票抬头" width="150"></el-table-column>
      <el-table-column prop="InvoiceNumber" label="税号" width="150"></el-table-column>
      <el-table-column prop="Amount" label="开票金额"></el-table-column>
      <el-table-column prop="Property" label="发票类型" :formatter="CategoryFormat"></el-table-column>
      <el-table-column prop="ApplyDate" label="申请时间" :formatter="StatusDate"></el-table-column>
      <el-table-column prop="Status" label="状态" :formatter="StatusFormat"></el-table-column>
      <el-table-column prop="AuditMsg" label="审批意见"></el-table-column>
      <el-table-column label="操作">
        <template scope="scope">
          <div v-if="scope.row.IsCurr === 0">
            <el-button @click="view(scope.row)" type="text" size="small">查看</el-button>
          </div>
          <div v-if="scope.row.IsCurr === 1">
            <el-button v-if="scope.row.Status === 2" @click="view(scope.row)" type="text" size="small">查看</el-button>
            <el-button v-if="scope.row.Status !== 2" @click="apply(scope.row)" type="text" size="small">修改</el-button>
            <el-button v-if="scope.row.Status !== 2" @click="deleteItem(scope.row)" type="text" size="small">删除</el-button>
          </div>
        </template>
      </el-table-column>

    </el-table>
    <el-pagination @size-change="handleSizeChange" @current-change="handleCurrentChange" :current-page="pagination.currentPage" :page-sizes="[10, 20, 30]" :page-size="pagination.pageSize" layout="total, sizes, prev, pager, next, jumper" :total="pagination.total"
      style="text-align:center; margin:20px;">
    </el-pagination>
  </div>
</template>

<script>
import {
  invoiceLastmonth,
  viewInvoice,
  deleteinvoice
} from '@/api/api'
import Dialog from '@/service/dialog.js'
import InvoiceView from '@/components/invoiceView.vue'
import ApplyDialog from '@/views/components/invoiceApplyDialog'
import { mapState } from 'vuex'
export default {
  data: function() {
    return {
      balance: '',
      Status: [
        {status: 0, statusName: '全部'},
        {status: 1, statusName: '未审核'},
        {status: 2, statusName: '通过'},
        {status: 3, statusName: '拒审'}
      ],
      pagination: {
        total: 0,
        pageSize: 10,
        currentPage: 1
      },
      params: {
        invoiceid: '',
        channelname: '',
        status: 0,
        start: '',
        end: '',
        limit: 10,
        offset: 0
      },
      clearable: false
    }
  },
  computed: {
    ...mapState({
      tableData (state) {
        return state.invoice.tableData
      }
    })
  },
  created() {
    this.getBalance()
    this.onSearch()
  },
  methods: {
    getBalance() {
      invoiceLastmonth().then(res => {
        if (res.status) {
          this.balance = res.data
        }
      })
    },
    onSearch() {
      this.params.limit = this.pagination.pageSize
      this.params.offset = (this.pagination.currentPage - 1) * this.params.limit
      const payload = {
        params: this.params,
        cb: (res) => {
          this.pagination.total = res.Count
        }
      }
      this.$store.dispatch('fetchinvoicelist', payload)
    },
    apply(row) {
      let invoiceorderParams = {}
      invoiceorderParams.balance = this.balance
      invoiceorderParams.invoiceId = row ? row.InvoiceId : ''
      Dialog(ApplyDialog, {
        invoiceorderParams: invoiceorderParams
      }).then(res => this.onSearch())
    },
    deleteItem(row) {
      this.$confirm('确定要删除发票申请？', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        deleteinvoice(row.InvoiceId).then(res => {
          if (res.status) {
            this.$message({
              type: 'success',
              message: '删除成功!'
            })
            this.onSearch()
          }
        })
      }).catch(() => {})
    },
    view(row) {
      var InvoiceId = row.InvoiceId
      viewInvoice(InvoiceId).then((res) => {
        this.scanView = res.data
        Dialog(InvoiceView, {
          view: this.scanView
        })
      })
    },
    CategoryFormat(row) {
      var category = row.Category
      switch (category) {
        case 1:
          category = '专票'
          break
        case 2:
          category = '普票'
          break
      }
      return category
    },
    StatusDate(row) {
      var date = row.ApplyDate
      return date.substring(0, 10)
    },
    StatusFormat(row) {
      let status = row.Status
      switch (status) {
        case 1:
          status = '未审核'
          break
        case 2:
          status = '通过'
          break
        case 3:
          status = '拒审'
          break
      }
      return status
    },
    handleSizeChange(val) {
      this.pagination.pageSize = val
      this.onSearch()
    },
    handleCurrentChange(val) {
      this.pagination.currentPage = val
      this.onSearch()
    }
  }
}
</script>

<style lang='stylus' scoped>
.invoice-apply
  .invoice-declare
    width: 100%;
    padding: 10px 0;
    border-radius: 3px;
    margin-bottom: 20px;
    font-size: 14px;
    overflow: hidden;
    div
      margin-bottom: 10px;
      button
        margin: 0 20px;
      span
        color: red;
    ul
      margin: 0;
      padding: 10px;
      color: #1b9bfc;
      background-color: #f0fafa;
      li
        padding-left: 6px;
</style>
