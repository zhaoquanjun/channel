<template>
<div>
  <h2 class="text-center">新增客户环比</h2>
  <SearchParams :length="tableData.length" @search="onSearch" :show-date-range="true" @download="onDownload"></SearchParams>
  <el-table :data="tableData" border style="width: 100%" :summary-method="getSummaries" show-summary v-table-sum>
    <el-table-column prop="PartitionName" label="大区">
    </el-table-column>
    <el-table-column prop="ProvinceName" label="省份">
    </el-table-column>
    <el-table-column prop="CityName" label="城市" width="100">
    </el-table-column>
    <el-table-column prop="ChannelName1" label="一级代理商" width="200">
    </el-table-column>
    <el-table-column prop="ChannelName2" label="二级代理商" width="200">
    </el-table-column>
    <el-table-column prop="LastCustomerNum" label="上期新增客户数" width="140">
    </el-table-column>
    <el-table-column prop="LastContractAmount" label="上期新增金额" width="130">
    </el-table-column>
    <el-table-column prop="CustomerNum" label="本期新增客户数" width="140">
    </el-table-column>
    <el-table-column prop="ContractAmount" label="本期新增金额" width="130">
    </el-table-column>
    <el-table-column prop="NewQuarter" label="新增客户数环比" width="140">
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
  getNewquarter
} from '../../api/api'

export default {
  name: 'StatisCustotaltocTab5',
  data: function () {
    return {
      tableData: [],
      pagination: {
        total: 0,
        pageSize: 10,
        currentPage: 1
      },
      total: {},
      params: {},
      allData: []
    }
  },
  methods: {
    onSearch(params) {
      if (!(params.starttime && params.endtime && params.laststarttime && params.lastendtime)) {
        this.$alert('时间范围不能为空！', '错误！', {
          confirmButtonText: '确定'
        })
        return
      }
      this.params = params
      let limit = this.pagination.pageSize
      let offset = (this.pagination.currentPage - 1) * limit
      this.params.limit = limit
      this.params.offset = offset
      getNewquarter(this.params).then(res => {
        this.pagination.total = res.Count
        this.tableData = res.data.DataInfo
        this.total = res.data.Total[0]
      })
    },
    handleSizeChange(val) {
      this.pagination.pageSize = val
      this.onSearch(this.params)
    },
    handleCurrentChange(val) {
      this.pagination.currentPage = val
      this.onSearch(this.params)
    },
    getSummaries(param) {
      const sums = ['合计', '-', '-', '-', '-', this.total.LastNum, this.total.LastAmount, this.total.CurrNum, this.total.CurrAmount, this.total.SumQoQ]
      return sums
    },
    onDownload(params) {
      const {
        starttime,
        endtime,
        ccodes,
        channelname,
        laststarttime,
        lastendtime
      } = params
      const url = `/api/download/newquarter?laststarttime=${laststarttime || ''}&lastendtime=${lastendtime || ''} &starttime=${starttime || ''}&endtime=${endtime || ''}&ccodes=${ccodes || ''}&channelname=${channelname || ''}`
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
