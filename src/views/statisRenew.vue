<template>
  <div class="statis-renew">
    <h3 class="vheader">续费情况统计</h3>
    <SearchParams :length="tableData.length" @search="onSearch" @download="onDownload"></SearchParams>
    <el-table id="dataTable" :data="tableData" border style="width: 100%" :show-summary="true" :summary-method="getSummaries" :max-height="tableHeight" v-table-sum:[1,2,3]="downloadSum" @cell-click="downloadColumn">
      <el-table-column prop="PartitionName" label="大区" width="120">
      </el-table-column>
      <el-table-column prop="ProvinceName" label="省份" width="120">
      </el-table-column>
      <el-table-column prop="CityName" label="城市" width="120">
      </el-table-column>
      <el-table-column prop="ChannelName1" label="一级代理商" min-width="200">
      </el-table-column>
      <el-table-column prop="ChannelName2" label="二级代理商" min-width="200">
      </el-table-column>
      <el-table-column prop="Status" label="代理商是否解约" :formatter="handleStatus" min-width="150">
      </el-table-column>
      <el-table-column prop="ExpireNum" label="到期客户数" width="150">
      </el-table-column>
      <el-table-column prop="NoReNum" label="未续费客户数" width="150">
      </el-table-column>
      <el-table-column prop="ReNum" label="已续费客户数" width="150">
      </el-table-column>
    </el-table>
  </div>
</template>

<script>
import SearchParams from '@/components/newsearchParamsYearMonth.vue'
import {
  getStatisRenew
} from '.././api/api'
import ExcelDown from '../service/excelDown'
export default {
  data: function () {
    return {
      tableData: [],
      params: {
        year: '2017',
        months: '',
        status: ''
      },
      tableHeight: 300,
      time: ''
    }
  },
  created() {
    var userInfos = JSON.parse(sessionStorage.getItem('userInfo'))
    this.IsCenter = userInfos.IsCenter
    this.getLastAgent()
    this.fetchData()
  },
  mounted() {
    this.tableHeight = document.querySelector('.content-right').offsetHeight - 163
  },
  methods: {
    getLastAgent() {
      var date = new Date()
      this.time = date.setMonth(-1)
      var month = date.getMonth() + 1
      var year = date.getFullYear()
      console.log(month, year)
      this.params.months = month < 10 ? ('0' + month) : month
      this.params.year = year
    },
    fetchData() {
      getStatisRenew(this.params).then((res) => {
        // console.log(res)
        this.tableData = res.data
      })
    },
    onSearch(params) {
      console.log(params)
      this.params.year = params.year
      this.params.months = params.months
      this.params.ccodes = params.ccodes
      this.params.channelname = params.channelname
      this.params.status = params.status
      this.fetchData()
    },
    onDownload() {
      ExcelDown().tableToExcel('dataTable', '续费情况统计')
    },
    getSummaries(param) {
      const {
        columns,
        data
      } = param
      const sums = []
      columns.forEach((column, index) => {
        if (index === 0) {
          sums[index] = '合计'
          return
        }
        const values = data.map(item => Number(item[column.property]))
        if (index > 5) {
          sums[index] = values.reduce((prev, curr) => {
            const value = Number(curr)
            if (!isNaN(value)) {
              return prev + curr
            } else {
              return prev
            }
          }, 0)
        } else {
          sums[index] = '-'
        }
      })

      return sums
    },
    downloadSum(index) {
      console.log(this.params, 'this.params')
      var {
        status,
        year,
        months,
        ccodes,
        channelname
      } = this.params
      var url = ''
      var Param = `?status=${status || ''}&year=${year || ''}&months=${months || ''}&ccodes=${ccodes || ''}&channelname=${channelname || ''}`
      if (index === 1) {
        url = '/api/download/getexpireorderdetails' + Param
      } else if (index === 2) {
        url = '/api/download/getnoreorderdetails' + Param
      } else if (index === 3) {
        url = '/api/download/getreorderdetails' + Param
      }
      window.open(url)
      // alert(index)
    },
    downloadColumn(row, column, cell) {
      var obj = {
        channelid: row.ChannelId,
        year: this.params.year,
        months: this.params.months
      }
      if (cell.cellIndex === 6) {
        obj.title = '到期客户明细'
        window.open('/admin.html#/XF-viewDetails?' + $.param(obj), '_blank')
        // this.$router.push({name: 'XFviewDetails', query: obj})
      } else if (cell.cellIndex === 7) {
        obj.title = '未续费客户明细'
        window.open('/admin.html#/XF-viewDetails?' + $.param(obj), '_blank')
        // this.$router.push({name: 'XFviewDetails', query: obj})
      } else if (cell.cellIndex === 8) {
        obj.title = '续费客户明细'
        window.open('/admin.html#/XF-viewDetails?' + $.param(obj), '_blank')
        // this.$router.push({name: 'XFviewDetails', query: obj})
      } else {
        return
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
    }
  },
  components: {
    SearchParams
  }
}
</script>

<style>
.statis-renew .el-table__body tr td:nth-child(7) .cell{
  cursor: pointer;
  color: #20a0ff;
  text-decoration: underline;
}
.statis-renew .el-table__body tr td:nth-child(8) .cell{
  cursor: pointer;
  color: #20a0ff;
  text-decoration: underline;
}
.statis-renew .el-table__body tr td:nth-child(9) .cell{
  cursor: pointer;
  color: #20a0ff;
  text-decoration: underline;
}
</style>
