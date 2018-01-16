<template>
<div class="invoice-apply-tab1">
  <div class="vsearch">
    <el-form ref="params" :inline="true" :model="params">
      <el-form-item class="form-width" label="发票申请编号">
        <el-input v-model="params.invoiceid"></el-input>
      </el-form-item>
      <el-form-item class="form-width" label="代理商">
        <el-input v-model="params.channelname"></el-input>
      </el-form-item>
      <el-form-item class="form-width" label="税号">
        <el-input v-model="params.invoicecode"></el-input>
      </el-form-item>
      <el-form-item label="申请时间">
        <el-date-picker v-model="params.start" type="date" :clearable="clearable">
        </el-date-picker>
        <span>-</span>
        <el-date-picker v-model="params.end" type="date" :clearable="clearable">
        </el-date-picker>
      </el-form-item>
      <el-form-item label="审核状态">
        <el-select v-model="params.status">
          <el-option v-for="item in Status" :key="item.status" :label="item.statusName" :value="item.status">
          </el-option>
        </el-select>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="onSearch">查询</el-button>
      </el-form-item>
    </el-form>
  </div>
  <el-table :data="tableData" border style="width: 100%">
    <el-table-column prop="InvoiceId" label="编号" width="120"></el-table-column>
    <el-table-column prop="ChannelName1" label="一级代理商" min-width="250"></el-table-column>
    <el-table-column prop="ChannelName2" label="二级代理商" min-width="200"></el-table-column>
    <el-table-column prop="Title" label="发票抬头"></el-table-column>
    <el-table-column prop="InvoiceNumber" label="税号"></el-table-column>
    <el-table-column prop="Amount" label="开票金额"></el-table-column>
    <el-table-column prop="Property" label="发票类型"></el-table-column>
    <el-table-column prop="ApplyDate" label="申请时间"></el-table-column>
    <el-table-column prop="Status" label="审批状态"></el-table-column>
    <el-table-column prop="AuditMsg" label="审批意见"></el-table-column>
    <el-table-column label="操作" width="180">
      <template scope="scope">
        <el-button @click="viewInvoice(scope.row)" type="text" size="small">查看</el-button>
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
  invoiceapply
} from '@/api/api'
export default {
  data: function() {
    return {
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
      tableData: [],
      params: {
        status: 0
      },
      clearable: false,
      financeTypeChild: [],
      isShowAllChildFinanceType: true
    }
  },
  methods: {
    onSearch() {
      let limit = this.pagination.pageSize
      let offset = (this.pagination.currentPage - 1) * limit
      let invoiceid = this.params.invoiceid
      let channelname = this.params.channelname
      let invoicecode = this.params.invoicecode
      let start = this.params.start
      let end = this.params.end
      let status = this.params.status
      console.log(status)
      invoiceapply({
        limit: limit,
        offset: offset,
        invoiceid: invoiceid,
        channelname: channelname,
        invoicecode: invoicecode,
        start: start,
        end: end,
        status: status
      }).then((res) => {
        this.tableData = res.data
        this.pagination.total = res.Count
      })
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

</style>
