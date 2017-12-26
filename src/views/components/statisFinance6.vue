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
      <el-form-item class="form-width" label="代理商状态">
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
    <el-table-column prop="PartitionName" label="大区" width="120">
    </el-table-column>
    <el-table-column prop="ProvinceName" label="省份" width="120">
    </el-table-column>
    <el-table-column prop="CityName" label="城市" width="120">
    </el-table-column>
    <el-table-column prop="ChannelName1" label="一级代理商" min-width="250">
    </el-table-column>
    <el-table-column prop="ChannelName2" label="二级代理商" min-width="200">
    </el-table-column>
    <el-table-column prop="Stext" label="代理商状态">
    </el-table-column>
    <el-table-column prop="Amount" label="扣减金额" align="center">
    </el-table-column>
    <el-table-column prop="OrderId" label="二代退单编号" align="center" min-width="200">
    </el-table-column>
    <el-table-column prop="CreateDate" label="操作日期" :formatter="StatusDate" width="120px">
    </el-table-column>
  </el-table>
  <el-pagination @size-change="handleSizeChange" @current-change="handleCurrentChange" :current-page="pagination.currentPage" :page-sizes="[10, 20, 30]" :page-size="pagination.pageSize" layout="total, sizes, prev, pager, next, jumper" :total="pagination.total"
    style="text-align:center; margin:20px;">
  </el-pagination>
</div>
</template>

<script>
import {
  getDeduteTab
} from '../../api/api'

export default {
  props: ['agents'],
  data: function() {
    return {
      Status: [
        {status: '', statusName: '全部'},
        {status: 1, statusName: '正常'},
        {status: 0, statusName: '解约'}
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
      getDeduteTab({
        limit: limit,
        offset: offset,
        startdate: starttime,
        enddate: endtime,
        channelname: channelname,
        billid: rebackId,
        status: status
      }).then((res) => {
        // console.log(res.data)
        if (res.status) {
          this.tableData = res.data
          this.pagination.total = res.Count
        }
      })
    },
    onDownload() {
      const {
        startdate,
        enddate,
        channelname,
        billid,
        status
      } = this.params
      const url = `/api/download/GetDeduteTab?startdate=${startdate || ''}&enddate=${enddate || ''}&channelname=${channelname || ''}&billid=${billid || ''}&status=${status}`
      window.open(url)
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
    StatusDate(row, column) {
      var date = row[column.property]
      // console.log(date)
      if (!date) {
        return ''
      }
      return date.substring(0, 10)
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
