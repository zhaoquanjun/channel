<template>
<div class="finance1">
  <h2 class="text-center">扣减一代提成表</h2>
  <div class="vsearch">
    <el-form ref="params" :inline="true" :model="params">
      <el-form-item label="日期">
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
      <el-form-item class="form-width" label="二代退单编号">
        <el-input v-model="params.rebackId"></el-input>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="onSearch">查询</el-button>
        <el-button type="primary" @click="onDownload" :disabled="!tableData.length">导出</el-button>
      </el-form-item>
    </el-form>
  </div>
  <el-table :data="tableData" border style="width: 100%">
    <el-table-column prop="ChannelName1" label="一级代理商" width="250">
    </el-table-column>
    <el-table-column prop="ChannelName2" label="二级代理商" width="200">
    </el-table-column>
    <el-table-column prop="Status" label="代理商是否解约" :formatter="handleStatus">
    </el-table-column>
    <el-table-column prop="BackAmount" label="扣减金额" align="center">
    </el-table-column>
    <el-table-column prop="RebackId" label="二代退单编号" align="center">
    </el-table-column>
    <el-table-column prop="Applydate" label="操作日期" align="center">
    </el-table-column>
  </el-table>
  <el-pagination @size-change="handleSizeChange" @current-change="handleCurrentChange" :current-page="pagination.currentPage" :page-sizes="[10, 20, 30]" :page-size="pagination.pageSize" layout="total, sizes, prev, pager, next, jumper" :total="pagination.total"
    style="text-align:center; margin:20px;">
  </el-pagination>
</div>
</template>

<script>
import {
  getrechargedetails
} from '../../api/api'

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
        rebackId: '',
        status: ''
      },
      clearable: false
    }
  },
  created() {
  },
  methods: {
    onSearch() {
      let limit = this.pagination.pageSize
      let offset = (this.pagination.currentPage - 1) * limit
      let channelname = this.params.channelname
      let starttime = this.params.starttime
      let endtime = this.params.endtime
      let rebackId = this.params.rebackId
      let status = this.params.status
      getrechargedetails({
        limit: limit,
        offset: offset,
        starttime: starttime,
        endtime: endtime,
        channelname: channelname,
        rebackId: rebackId,
        status: status
      }).then((res) => {
        // console.log(res.data)
        this.tableData = res.data
        this.pagination.total = res.Count
      })
    },
    onDownload() {
      const {
        starttime,
        endtime,
        channelname,
        rebackId,
        status
      } = this.params
      const url = `/api/download/getrechargedetails?starttime=${starttime || ''}&endtime=${endtime || ''}&channelname=${channelname || ''}&rebackId=${rebackId}&status=${status}`
      window.open(url)
    },
    StatusDate(row) {
      var date = row.Applydate
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
.finance1 .vsearch .el-form--inline .el-form-item {
  margin-right: 0;
}
.finance1 .vsearch .form-width2 .el-form-item__content {
  width: 120px;
}
.finance1 .vsearch .form-width .el-form-item__content {
  width: 120px;
}
.finance1 .dataWidth {
  width: 120px;
}
</style>
