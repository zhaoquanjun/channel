<template>
  <div class="recharge-apply">
    <h3 class="vheader">充值申请</h3>
    <div class="invoice-declare">
      <strong>账户金额</strong>
      <span>{{balance}}元</span>
      <el-button type="primary" @click="apply()">充值申请</el-button>
    </div>
    <div class="vsearch">
      <el-form ref="params" :inline="true" :model="params">
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
      <el-table-column prop="ChannelName1" label="一级代理商" min-width="150"></el-table-column>
      <el-table-column prop="ChannelName2" label="二级代理商" min-width="100"></el-table-column>
      <el-table-column prop="Amount" label="充值金额" width="150"></el-table-column>
      <el-table-column prop="Balance" label="余额" width="150"></el-table-column>
      <el-table-column prop="CreateDate" label="申请时间" :formatter="StatusDate"></el-table-column>
      <el-table-column prop="StatusStr" label="状态" :formatter="StatusFormat"></el-table-column>
      <el-table-column prop="AuditOpinion" label="审批意见"></el-table-column>
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
  balancecur,
  rechargeList,
  viewInvoice,
  deleteRecharge
} from '@/api/api'
import Dialog from '@/service/dialog.js'
import InvoiceView from '@/components/invoiceView.vue'
import RechargeApplyDialog from '@/components/rechargeApplyDialog'
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
        channelname: '',
        status: 0,
        start: '',
        end: '',
        limit: 10,
        offset: 0
      },
      clearable: false,
      tableData: []
    }
  },
  created() {
    this.getBalance()
    this.onSearch()
  },
  methods: {
    getBalance() {
      balancecur().then(res => {
        if (res.status) {
          this.balance = res.data
        }
      })
    },
    onSearch() {
      this.params.limit = this.pagination.pageSize
      this.params.offset = (this.pagination.currentPage - 1) * this.params.limit
      rechargeList(this.params).then((res) => {
        this.tableData = res.data
        this.pagination.total = res.Count
      })
    },
    apply(row) {
      if (row) {
        row = $.extend(true, {}, row)
      } else {
        row = {}
      }
      Dialog(RechargeApplyDialog, {
        row: row
      }).then(res => this.onSearch())
    },
    deleteItem(row) {
      this.$confirm('确认要删除充值申请？', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        deleteRecharge(row.Id).then(res => {
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
    StatusDate(row) {
      var date = row.CreateDate
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
.recharge-apply
  .invoice-declare
    width: 100%;
    padding: 10px 0;
    border-radius: 3px;
    font-size: 14px;
    overflow: hidden;
    button
      margin: 0 20px;
    span
      color: red;
</style>
