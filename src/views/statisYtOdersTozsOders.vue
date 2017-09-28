<template>
  <div class="statis-ytOdersTozsOders">
    <h3 class="vheader">预提单转正式订单统计</h3>
    <SearchParams :length="tableData.length" @search="onSearch" @download="onDownload"></SearchParams>
    <el-table id="dataTable" :data="tableData" border style="width: 100%" :show-summary="true" :summary-method="getSummaries" :max-height="410" v-table-sum:[1,2]="downloadSum" @cell-click="downloadColumn">
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
      <el-table-column prop="ytdcount" label="预提单数量" width="150">
      </el-table-column>
      <el-table-column prop="zzscount" label="转为正式订单数量" width="150">
      </el-table-column>
    </el-table>
  </div>
</template>

<script>
import SearchParams from '@/components/searchParamsNew.vue'
import {
  getStatisYtOdersTozsOders
} from '.././api/api'
import ExcelDown from '../service/excelDown'
export default {
  data: function () {
    return {
      tableData: [],
      params: {
        startdate: '',
        enddate: '',
        status: ''
      },
      cities: ''
    }
  },
  created() {
    this.fetchData()
    var start = this.getNowMonthStartDate()
    var end = this.getNowMonthLastDate()
    this.params.startdate = new Date(new Date(start))
    this.params.enddate = new Date(new Date(end))
  },
  methods: {
    getNowMonthStartDate() {
      var date = new Date()
      return date.toLocaleString().match(/\d{0,4}\/\d{1,2}\/(\d{1,2})/)[0].replace(/(\d{0,4}\/\d{1,2}\/)\d{1,2}/, '$11')
    },
    getNowMonthLastDate() {
      var date = new Date()
      var nextMonthStartDate = date.toLocaleString().match(/\d{0,4}\/\d{1,2}\/(\d{1,2})/)[0].replace(/(\d{0,4})\/(\d{1,2})\/(\d{1,2})/, function() {
        return parseInt(arguments[2]) === 12 ? (parseInt(arguments[1]) + 1) + '/1/1' : arguments[1] + '/' + (parseInt(arguments[2]) + 1) + '/1'
      })
      return new Date(new Date(nextMonthStartDate).getTime() - 1).toLocaleString().match(/\d{0,4}\/\d{1,2}\/(\d{1,2})/)[0]
    },
    fetchData() {
      getStatisYtOdersTozsOders(this.params).then((res) => {
        // console.log(res)
        this.tableData = res.data
      })
    },
    onSearch(params) {
      console.log(params)
      this.params.startdate = params.starttime
      this.params.enddate = params.endtime
      this.params.ccodes = params.ccodes
      this.params.channelname = params.channelname
      this.params.status = params.status
      this.fetchData()
    },
    onDownload() {
      ExcelDown().tableToExcel('dataTable', '预提单转正式订单统计')
      // var exportHref = ExcelDown().tableToExcel('dataTable', 'sheet name')
      // setTimeout(function() { location.href = exportHref }, 100) // trigger download
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
        startdate,
        enddate,
        ccodes,
        channelname
      } = this.params
      var url = ''
      var Param = `?status=${status || ''}&startdate=${startdate || ''}&enddate=${enddate || ''}&ccodes=${ccodes || ''}&channelname=${channelname || ''}`
      if (index === 1) {
        url = '/api/dataanalysis/exportbeforehandlist' + Param
      } else if (index === 2) {
        url = '/api/dataanalysis/exporttoformallist' + Param
      }
      window.open(url)
      // alert(index)
    },
    downloadColumn(row, column, cell) {
      var channelid = row.ChannelId
      var startdate = this.params.startdate
      var enddate = this.params.enddate
      var url = ''
      var Param = `?channelid=${channelid || ''}&startdate=${startdate || ''}&enddate=${enddate || ''}`
      if (cell.cellIndex === 6) {
        url = '/api/dataanalysis/exportbeforehandlist' + Param
      } else if (cell.cellIndex === 7) {
        url = '/api/dataanalysis/exporttoformallist' + Param
      } else {
        return
      }
      window.open(url)
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
.statis-ytOdersTozsOders .el-table__body tr td:nth-child(7) .cell{
  cursor: pointer;
  color: #20a0ff;
  text-decoration: underline;
}
.statis-ytOdersTozsOders .el-table__body tr td:nth-child(8) .cell{
  cursor: pointer;
  color: #20a0ff;
  text-decoration: underline;
}
</style>
