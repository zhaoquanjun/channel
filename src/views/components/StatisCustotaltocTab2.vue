<template>
<div>
  <h2 class="text-center">到期未续费客户统计</h2>
  <SearchParams :length="tableData.length" @search="onSearch" @download="onDownload"></SearchParams>
  <div class="pull-right" style="margin-right:20px"><a href="javascript:;" @click="onDetailExport">到期未续费客户明细</a></div>
  <el-table :data="tableData" border style="width: 100%" show-summary :summary-method="getSummaries" v-table-sum>
    <el-table-column prop="PartitionName" label="大区">
    </el-table-column>
    <el-table-column prop="ProvinceName" label="省份">
    </el-table-column>
    <el-table-column prop="CityName" label="城市">
    </el-table-column>
    <el-table-column prop="ChannelName1" label="一级代理商" width="300">
    </el-table-column>
    <el-table-column prop="ChannelName2" label="二级代理商" width="300">
    </el-table-column>
    <el-table-column prop="NotReFeeNum" label="未续费客户数">
    </el-table-column>
  </el-table>
  <el-pagination @size-change="handleSizeChange" @current-change="handleCurrentChange" :current-page="pagination.currentPage" :page-sizes="[10, 20, 30]" :page-size="pagination.pageSize" layout="total, sizes, prev, pager, next, jumper" :total="pagination.total"
    style="text-align:center; margin:20px;">
  </el-pagination>
</div>
</template>
<script>
import SearchParams from '@/components/searchParams.vue'
import {
  getNotrenewstatistics
} from '../../api/api'

export default {
  name: 'StatisCustotaltocTab2',
  data: function () {
    return {
      tableData: [],
      pagination: {
        total: 0,
        pageSize: 10,
        currentPage: 1
      },
      total: {},
      params: {}
    }
  },
  methods: {
    onSearch(params) {
      if (params) {
        this.params = params
      }
      let limit = this.pagination.pageSize
      let offset = (this.pagination.currentPage - 1) * limit
      this.params.limit = limit
      this.params.offset = offset
      getNotrenewstatistics(this.params).then(res => {
        this.pagination.total = res.Count
        this.tableData = res.data.DataInfo
        this.total = res.data.Total[0]
      })
    },
    handleSizeChange(val) {
      this.pagination.pageSize = val
      this.onSearch()
    },
    handleCurrentChange(val) {
      this.pagination.currentPage = val
      this.onSearch()
    },
    getSummaries(param) {
      const sums = ['合计', '-', '-', '-', '-', this.total.SumNotReFee]
      return sums
    },
    onDetailExport() {
      const {
        starttime,
        endtime,
        ccodes,
        channelname
      } = this.params
      const url = `/api/download/notrenewdetail?starttime=${starttime || ''}&endtime=${endtime || ''}&ccodes=${ccodes || ''}&channelname=${channelname || ''}`
      console.log(url)
      window.open(url)
    },
    onDownload(params) {
      const {
        starttime,
        endtime,
        ccodes,
        channelname
      } = params
      const url = `/api/download/notrenewstatistics?starttime=${starttime || ''}&endtime=${endtime || ''}&ccodes=${ccodes || ''}&channelname=${channelname || ''}`
      // console.log(url)
      window.open(url)
    }
  },
  components: {
    SearchParams
  }
}
</script>
<style>
</style>
