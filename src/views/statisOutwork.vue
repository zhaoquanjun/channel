<template>
  <div class="statis-outwork">
    <h3 class="vheader">外勤情况统计</h3>
    <SearchParams :length="tableData.length" @search="onSearch" @download="onDownload"></SearchParams>
    <el-table id="dataTable" :data="tableData" border style="width: 100%" :show-summary="true" :summary-method="getSummaries" :max-height="tableHeight" v-table-sum @cell-click="downloadColumn">
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
      <el-table-column prop="Status" label="代理商是否解约" :formatter="handleStatus" min-width="100">
      </el-table-column>
      <el-table-column prop="ordernum" label="预提单数" width="100">
      </el-table-column>
      <el-table-column prop="allmainnum" label="外勤总任务数量" width="140">
      </el-table-column>
      <el-table-column prop="mainnum1" label="总任务待分配" width="125">
      </el-table-column>
      <el-table-column prop="mainnum2" label="总任务待处理" width="125">
      </el-table-column>
      <el-table-column prop="mainnum3" label="总任务进行中" width="125">
      </el-table-column>
      <el-table-column prop="mainnum4" label="总任务已完成" width="125">
      </el-table-column>
      <el-table-column prop="mainnum5" label="总任务已取消" width="125">
      </el-table-column>
      <el-table-column prop="allchildnum" label="子任务总数量" width="125">
      </el-table-column>
      <el-table-column prop="childnum1" label="子任务待分配" width="125">
      </el-table-column>
      <el-table-column prop="childnum2" label="子任务待处理" width="125">
      </el-table-column>
      <el-table-column prop="childnum3" label="子任务进行中" width="125">
      </el-table-column>
      <el-table-column prop="childnum4" label="子任务已完成" width="125">
      </el-table-column>
      <el-table-column prop="childnum5" label="子任务已取消" width="125">
      </el-table-column>
    </el-table>
  </div>
</template>

<script>
import SearchParams from '@/components/searchParamsNew.vue'
import {
  getStatisOutwork
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
      cities: '',
      tableHeight: 300
    }
  },
  created() {
    this.fetchData()
    var start = this.getNowMonthStartDate()
    var end = this.getNowMonthLastDate()
    this.params.startdate = new Date(new Date(start))
    this.params.enddate = new Date(new Date(end))
  },
  mounted() {
    this.tableHeight = document.querySelector('.content-right').offsetHeight - 163
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
      getStatisOutwork(this.params).then((res) => {
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
      ExcelDown().tableToExcel('dataTable', '外勤状况统计')
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
    downloadColumn(row, column, cell) {
      var channelid = row.ChannelId
      var startdate = this.params.startdate
      var enddate = this.params.enddate
      var url = ''
      var Param = `?channelid=${channelid || ''}&startdate=${startdate || ''}&enddate=${enddate || ''}`
      if (cell.cellIndex === 7) {
        url = '/api/download/getmaintaskdetails' + Param
      } else if (cell.cellIndex === 13) {
        url = '/api/download/getchildtaskdetails' + Param
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
.statis-outwork .el-table__body tr td:nth-child(8) .cell{
  cursor: pointer;
  color: #20a0ff;
  text-decoration: underline;
}
.statis-outwork .el-table__body tr td:nth-child(14) .cell{
  cursor: pointer;
  color: #20a0ff;
  text-decoration: underline;
}
</style>
