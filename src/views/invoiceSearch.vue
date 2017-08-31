<template>
<div class="invoice-search">
  <h3 class="vheader">发票查询</h3>
  <div class="vsearch">
    <el-form ref="params" :inline="true" :model="params">
      <el-form-item class="form-width" label="发票申请编号">
        <el-input v-model="params.invoiceid"></el-input>
      </el-form-item>
      <el-form-item class="form-width" label="代理商">
        <el-autocomplete class="inline-input" v-model="params.channelname" :trigger-on-focus="false" :fetch-suggestions="querySearch"></el-autocomplete>
      </el-form-item>
      <el-form-item class="form-width" label="税号">
        <el-input v-model="params.invoicecode"></el-input>
      </el-form-item>
      <el-form-item class="form-width2" label="审核状态">
        <el-select v-model="params.status">
          <el-option v-for="item in CheckStatus" :key="item.status" :label="item.name" :value="item.status"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="申请时间">
        <el-date-picker v-model="params.start" type="date" placeholder="开始日期" :clearable="clearable">
        </el-date-picker>
        <span>-</span>
        <el-date-picker v-model="params.end" type="date" placeholder="结束日期" :clearable="clearable">
        </el-date-picker>
      </el-form-item>
      <el-form-item label="审核时间">
        <el-date-picker v-model="params.auditstart" type="date" placeholder="开始日期" :clearable="clearable">
        </el-date-picker>
        <span>-</span>
        <el-date-picker v-model="params.auditend" type="date" placeholder="结束日期" :clearable="clearable">
        </el-date-picker>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="fetchData">查询</el-button>
      </el-form-item>
    </el-form>
  </div>
  <el-table :data="tableData" border style="width: 100%">
    <el-table-column prop="InvoiceId" label="发票申请编号" width="200" align="center">
    </el-table-column>
    <el-table-column prop="ProvinceName" label="省" align="center">
    </el-table-column>
    <el-table-column prop="CityName" label="市" align="center">
    </el-table-column>
    <el-table-column prop="ChannelName1" label="一级代理商" width="200" align="center">
    </el-table-column>
    <el-table-column prop="ChannelName2" label="二级代理商" width="200" align="center">
    </el-table-column>
    <!-- <el-table-column prop="Property" label="发票性质" :formatter="PropertyFormat" align="center" width="110">
    </el-table-column> -->
    <el-table-column prop="Title" label="发票抬头" width="200" align="center">
    </el-table-column>
    <el-table-column prop="InvoiceNumber" label="税号" width="200" align="center">
    </el-table-column>
    <el-table-column prop="Amount" label="发票金额" align="center" width="130">
    </el-table-column>
    <el-table-column prop="Category" label="发票类型" :formatter="CategoryFormat" align="center" width="110">
    </el-table-column>
    <el-table-column prop="ApplyDate" label="申请时间" :formatter="StatusDate" align="center" width="120">
    </el-table-column>
    <el-table-column prop="AuditDate" label="审核时间" :formatter="StatusDate" align="center" width="120">
    </el-table-column>
    <el-table-column label="操作" align="center">
      <template scope="scope">
          <el-button @click="scan(scope.row)" type="text" size="small">查看</el-button>
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
  invoiceSearch,
  agents,
  viewInvoice
} from '../api/api'
import Dialog from '../service/dialog.js'
import InvoiceView from '../components/invoiceView.vue'
export default {
  name: 'invoiceReview',
  data: function() {
    return {
      pagination: {
        total: 0,
        pageSize: 10,
        currentPage: 1
      },
      tableData: [],
      agents: [],
      scanView: null,
      params: {
        channelname: '',
        start: null,
        end: null,
        auditstart: null,
        auditend: null,
        invoiceid: '',
        status: 2,
        invoicecode: null
      },
      CheckStatus: [{
        name: '通过',
        status: 2
      }, {
        name: '拒审',
        status: 3
      }],
      clearable: false
    }
  },
  created() {
    this.fetchData()
    this.Agents()
  },
  methods: {
    fetchData() {
      let limit = this.pagination.pageSize
      let offset = (this.pagination.currentPage - 1) * limit
      let channelname = this.params.channelname
      let start = this.params.start
      let end = this.params.end
      let auditstart = this.params.auditstart
      let auditend = this.params.auditend
      let status = this.params.status
      let invoicecode = this.params.invoicecode
      let invoiceid = this.params.invoiceid
      invoiceSearch({
        limit: limit,
        offset: offset,
        channelname: channelname,
        start: start,
        end: end,
        auditstart: auditstart,
        auditend: auditend,
        status: status,
        invoicecode: invoicecode,
        invoiceid: invoiceid
      }).then((res) => {
        this.tableData = res.data
        this.pagination.total = res.Count
      })
    },
    Agents() {
      agents().then((res) => {
        this.agents = res.data
        for (let i in this.agents) {
          this.agents[i].value = this.agents[i].ChannelName
        }
        // console.log(this.agents)
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
    StatusDate(row, column) {
      var date = row[column.property]
      if (!date) {
        return
      }
      return date.substring(0, 10)
    },
    scan(row) {
      var InvoiceId = row.InvoiceId
      viewInvoice(InvoiceId).then((res) => {
        this.scanView = res.data
        Dialog(InvoiceView, {
          view: this.scanView
        })
      })
    },
    querySearch(queryString, cb) {
      var channels = this.agents
      var results = queryString ? channels.filter(this.createFilter(queryString)) : channels
      cb(results)
    },
    createFilter(queryString) {
      return (channel) => {
        return (channel.value.indexOf(queryString) >= 0)
      }
    },
    handleSizeChange(val) {
      this.pagination.pageSize = val
      this.fetchData()
    },
    handleCurrentChange(val) {
      this.pagination.currentPage = val
      this.fetchData()
    }
  }
}
</script>

<style>
.invoice-search .vsearch .form-width .el-form-item__content {
  width: 120px;
}
.invoice-search .vsearch .form-width2 .el-form-item__content {
  width: 75px;
}
.invoice-search .vsearch .el-date-editor.el-input {
  width: 118px;
}
</style>
