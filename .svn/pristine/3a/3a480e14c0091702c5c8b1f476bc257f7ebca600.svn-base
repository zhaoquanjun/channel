<template>
<div class="invoiceReview">
  <h3 class="vheader">发票审核</h3>
  <div class="vsearch">
    <el-form ref="searchParam" :inline="true" :model="params">
      <el-form-item label="发票申请编号">
        <el-input v-model="params.invoiceid"></el-input>
      </el-form-item>
      <el-form-item class="form-width" label="代理商">
        <el-autocomplete class="inline-input" v-model="params.channelname" :trigger-on-focus="false" :fetch-suggestions="querySearch"></el-autocomplete>
      </el-form-item>
      <el-form-item label="税号">
        <el-input v-model="params.invoicecode"></el-input>
      </el-form-item>
      <el-form-item label="申请时间">
        <el-date-picker v-model="params.starttime" type="date" placeholder="开始日期" :clearable="clearable">
        </el-date-picker>
        <span>-</span>
        <el-date-picker v-model="params.endtime" type="date" placeholder="结束日期" :clearable="clearable">
        </el-date-picker>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="fetchData">查询</el-button>
      </el-form-item>
    </el-form>
  </div>
  <el-table :data="tableData" border style="width: 100%">
    <el-table-column prop="InvoiceId" label="发票申请编号" width="170" align="center">
    </el-table-column>
    <el-table-column prop="ProvinceName" label="省" align="center">
    </el-table-column>
    <el-table-column prop="CityName" label="市" align="center">
    </el-table-column>
    <el-table-column prop="ChannelName1" label="一级代理商" width="200">
    </el-table-column>
    <el-table-column prop="ChannelName2" label="二级代理商" width="200">
    </el-table-column>
    <el-table-column prop="Title" label="发票抬头" width="190">
    </el-table-column>
    <el-table-column prop="InvoiceNumber" label="税号" width="150">
    </el-table-column>
    <el-table-column prop="Amount" label="发票金额" align="center" width="100">
    </el-table-column>
    <el-table-column prop="Category" label="发票类型" :formatter="CategoryFormat" align="center" width="110">
    </el-table-column>
    <!-- <el-table-column prop="Property" label="发票性质" :formatter="PropertyFormat" align="center" width="110">
    </el-table-column> -->
    <el-table-column prop="ApplyDate" label="申请时间" :formatter="StatusDate" align="center" width="115">
    </el-table-column>
    <!-- <el-table-column prop="Status" label="发票审批状态" :formatter="StatusFormat" align="center" width="130">
    </el-table-column> -->
    <el-table-column label="操作" align="center" width="200">
      <template scope="scope">
          <el-button @click="scan(scope.row)" type="text" size="small">查看</el-button>
          <el-button @click="accept(scope.row)" type="text" size="small">开具发票</el-button>
          <el-button @click="reject(scope.row)" type="text" size="small">拒绝开票</el-button>
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
  invoice,
  agents,
  viewInvoice,
  operateInvoice
} from '../api/api'
import Dialog from '../service/dialog.js'
import InvoiceView from '../components/invoiceView.vue'
import Refuse from '../components/refuse.vue'
import bus from '../bus'
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
        invoicecode: '',
        channelname: '',
        invoiceid: '',
        starttime: '',
        endtime: '',
        status: 1
      },
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
      let start = this.params.starttime
      let end = this.params.endtime
      let invoiceid = this.params.invoiceid
      let invoicecode = this.params.invoicecode
      let status = this.params.status
      invoice({
        limit: limit,
        offset: offset,
        start: start,
        end: end,
        invoiceid: invoiceid,
        invoicecode: invoicecode,
        channelname: channelname,
        status: status
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
    StatusDate(row) {
      var date = row.ApplyDate
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
    accept(row) {
      var InvoiceId = row.InvoiceId
      var date = new Date()
      console.log(date)
      this.$confirm('确认开具发票吗?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        var item = {
          InvoiceAudit: '同意',
          Pass: true,
          InvoiceDate: date
        }
        operateInvoice(InvoiceId, item).then(res => {
          if (res.status) {
            this.$message({
              type: 'success',
              message: '开票成功!'
            })
            this.fetchData()
          }
        })
      }).catch(() => {})
    },
    reject(row) {
      var item = {
        Pass: false
      }
      var InvoiceId = row.InvoiceId
      Dialog(Refuse, {
        item: item,
        Id: InvoiceId,
        sign: 'INVOICE',
        title: '拒绝发票'
      })
      bus.$on('rejec-success', () => {
        this.fetchData()
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
.invoiceReview .vsearch .form-width .el-form-item__content {
  width: 140px;
}
.invoiceReview .vsearch .el-date-editor.el-input {
  width:120px;
}
</style>
