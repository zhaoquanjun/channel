<template>
<div class="finance4">
  <h2 class="text-center">返点明细表</h2>
  <div class="vsearch">
    <el-form ref="params" :inline="true" :model="params">
      <el-form-item class="form-width1" label="年">
        <el-select v-model="params.year">
          <el-option v-for="item in years" :key="item" :label="item" :value="item">
          </el-option>
        </el-select>
      </el-form-item>
      <el-form-item class="form-width" label="月">
        <el-select v-model="params.months" multiple placeholder="全部">
          <el-option v-for="item in months" :key="item" :label="item" :value="item">
          </el-option>
        </el-select>
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
    <el-table-column prop="Month" label="返点月份" width="130"></el-table-column>
    <el-table-column prop="ChannelName1" label="一级代理" width="300"></el-table-column>
    <el-table-column prop="ChannelName2" label="二级代理" width="300"></el-table-column>
    <el-table-column prop="Status" label="代理商是否解约" :formatter="handleStatus">
    </el-table-column>
    <el-table-column prop="Amount" label="返点金额"></el-table-column>
  </el-table>
  <el-pagination @size-change="handleSizeChange" @current-change="handleCurrentChange" :current-page="pagination.currentPage" :page-sizes="[10, 20, 30]" :page-size="pagination.pageSize" layout="total, sizes, prev, pager, next, jumper" :total="pagination.total"
    style="text-align:center; margin:20px;">
  </el-pagination>
</div>
</template>

<script>
import { getrebatedetails } from '@/api/api'
import ElSelect from '@/components/select.vue'
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
        year: 2017,
        months: '',
        channelname: '',
        status
      },
      years: [2017, 2018],
      months: ['1月', '2月', '3月', '4月', '5月', '6月', '7月', '8月', '9月', '10月', '11月', '12月']
    }
  },
  created() {

  },
  methods: {
    onSearch() {
      var months = this.params.months
      months = months.map(str => {
        return parseInt(str) < 10 ? ('0' + parseInt(str)) : parseInt(str)
      })
      months = months.join(',')
      let limit = this.pagination.pageSize
      let offset = (this.pagination.currentPage - 1) * limit
      let channelname = this.params.channelname
      let year = this.params.year
      let status = this.params.status
      let Months = months
      getrebatedetails({
        limit: limit,
        offset: offset,
        channelname: channelname,
        year: year,
        month: Months,
        status: status
      }).then((res) => {
        // console.log(res.data)
        this.tableData = res.data
        this.pagination.total = res.Count
      })
    },
    onDownload() {
      var paramsmonths = this.params.months
      paramsmonths = paramsmonths.map(str => {
        return parseInt(str) < 10 ? ('0' + parseInt(str)) : parseInt(str)
      })
      paramsmonths = paramsmonths.join(',')
      const {
        year,
        channelname,
        status
      } = this.params
      // if (this.pagination.total > 1000) {
      //   this.$message({
      //     type: 'warning',
      //     message: '总条数过多，请缩小查询范围'
      //   })
      // } else {
      const url = `/api/download/getrebatedetails?year=${year || ''}&month=${paramsmonths || ''}&channelname=${channelname || ''}&status=${status}`
      // console.log(url)
      window.open(url)
      // }
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
  },
  components: {
    ElSelect
  }
}
</script>

<style>
.finance4 .vsearch .form-width1 .el-form-item__content {
  width: 80px;
}
.finance4 .vsearch .form-width .el-form-item__content {
  width: 150px;
}
</style>
