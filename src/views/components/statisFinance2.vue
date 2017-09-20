<template>
<div class="finance2">
  <h2 class="text-center">支付明细表</h2>
  <div class="vsearch">
    <el-form ref="params" :inline="true" :model="params">
      <el-form-item label="订单日期">
        <el-date-picker class="dataWidth" v-model="params.starttime" type="date" :clearable="clearable">
        </el-date-picker>
        <span>-</span>
        <el-date-picker class="dataWidth" v-model="params.endtime" type="date" :clearable="clearable">
        </el-date-picker>
      </el-form-item>
      <el-form-item class="form-width" label="代理商">
        <el-autocomplete class="inline-input" v-model="params.channelname" :trigger-on-focus="false" :fetch-suggestions="querySearch"></el-autocomplete>
      </el-form-item>
      <el-form-item class="form-width" label="代理商是否解约">
        <el-select v-model="params.status">
          <el-option v-for="item in Status" :key="item.status" :label="item.statusName" :value="item.status">
          </el-option>
        </el-select>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="onSearch">查询</el-button>
        <el-button type="primary" @click="onDownload" :disabled="!tableData.length">导出</el-button>
      </el-form-item>
    </el-form>
  </div>
  <el-table :data="tableData" border style="width: 100%">
    <el-table-column prop="ChannelName1" label="一级代理" min-width="200">
    </el-table-column>
    <el-table-column prop="ChannelName2" label="二级代理" min-width="200">
    </el-table-column>
    <el-table-column prop="Status" label="代理商是否解约" :formatter="handleStatus">
    </el-table-column>
    <el-table-column prop="CreateDate" label="订单日期" :formatter="StatusDate" width="120">
    </el-table-column>
    <el-table-column prop="OrderId" label="订单编号" width="210">
    </el-table-column>
    <el-table-column prop="Name" label="公司名称" width="200">
    </el-table-column>
    <el-table-column prop="AddedValueText" label="公司性质" width="110">
    </el-table-column>
    <el-table-column prop="ContractNO" label="合同编号" width="200">
    </el-table-column>
    <el-table-column prop="ContractDate" label="签订日期" :formatter="StatusDate" width="120">
    </el-table-column>
    <el-table-column prop="ServiceStart" label="开始记账日期" :formatter="StatusDate" width="130">
    </el-table-column>
    <el-table-column prop="ServiceCycle" label="服务期间（月）" width="140">
    </el-table-column>
    <el-table-column prop="ServiceEnd" label="结束日期" :formatter="StatusDate" width="120">
    </el-table-column>
    <el-table-column prop="ContractAmount" label="合同金额" width="100">
    </el-table-column>
    <el-table-column prop="BLAmount" label="提单金额" width="100">
    </el-table-column>
    <el-table-column prop="PurchaseAmount" label="折后金额" width="100">
    </el-table-column>
  </el-table>
  <el-pagination @size-change="handleSizeChange" @current-change="handleCurrentChange" :current-page="pagination.currentPage" :page-sizes="[10, 20, 30]" :page-size="pagination.pageSize" layout="total, sizes, prev, pager, next, jumper" :total="pagination.total"
    style="text-align:center; margin:20px;">
  </el-pagination>
</div>
</template>

<script>
import { getpaymentdetails } from '@/api/api'
export default {
  props: ['agents'],
  data: function() {
    return {
      Status: [
        {status: '', statusName: '全部'},
        {status: 0, statusName: '是'},
        {status: 1, statusName: '否'}
      ],
      pagination: {
        total: 0,
        pageSize: 10,
        currentPage: 1
      },
      tableData: [],
      params: {
        starttime: '',
        endtime: '',
        channelname: '',
        status: ''
      },
      clearable: false
    }
  },
  created() {

  },
  methods: {
    onSearch(params) {
      let limit = this.pagination.pageSize
      let offset = (this.pagination.currentPage - 1) * limit
      let channelname = this.params.channelname
      let starttime = this.params.starttime
      let endtime = this.params.endtime
      let status = this.params.status
      getpaymentdetails({
        limit: limit,
        offset: offset,
        starttime: starttime,
        endtime: endtime,
        channelname: channelname,
        status: status
      }).then((res) => {
        // console.log(res.data)
        this.tableData = res.data
        this.pagination.total = res.Count
      })
    },
    onDownload(params) {
      const {
        starttime,
        endtime,
        channelname,
        status
      } = this.params
      if (this.pagination.total > 1000) {
        this.$message({
          type: 'warning',
          message: '总条数过多，请缩小查询范围'
        })
      } else {
        const url = `/api/download/getpaymentdetails?starttime=${starttime || ''}&endtime=${endtime || ''}&channelname=${channelname || ''}&status=${status || ''}`
        console.log(url)
        window.open(url)
      }
    },
    StatusDate(row, column) {
      var date = row[column.property]
      return date.substring(0, 10)
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
    handleStatus(row) {
      // console.log(row)
      var status = +row.Status
      if (status === 0) {
        status = '是'
      } else if (status > 0) {
        status = '否'
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

<style>
.finance2 .dataWidth {
  width: 120px;
}
.finance2 .form-width .el-form-item__content {
  width: 120px;
}
</style>
