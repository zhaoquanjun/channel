<template>
<div>
  <h3 class="vheader">业绩统计</h3>
  <SearchParams :length="tableData.length" @search="onSearch" @download="onDownload"></SearchParams>
  <el-table id="dataTable" :data="tableData" border style="width: 100%" :show-summary="true" :summary-method="getSummaries" :max-height="tableHeight" v-table-sum>
    <el-table-column prop="PartitionName" label="大区" width="120">
    </el-table-column>
    <el-table-column prop="ProvinceName" label="省" width="120">
    </el-table-column>
    <el-table-column prop="CityName" label="市" width="120">
    </el-table-column>
    <el-table-column prop="ChannelName1" label="一级代理商" width="200">
    </el-table-column>
    <el-table-column prop="ChannelName2" label="二级代理商" width="200">
    </el-table-column>
    <el-table-column prop="Status" label="代理商是否解约" :formatter="handleStatus" min-width="100">
    </el-table-column>
    <el-table-column label="订单数量" header-align="center">
      <el-table-column prop="OrderNumZero" label="零申报" width="80">
      </el-table-column>
      <el-table-column prop="OrderNumSmall" label="小规模" width="100">
      </el-table-column>
      <el-table-column prop="OrderNumGeneral" label="一般纳税人" width="110">
      </el-table-column>
      <el-table-column prop="OrderNumHJ" label="小计" width="120">
      </el-table-column>
    </el-table-column>
    <el-table-column label="应收" header-align="center">
      <el-table-column prop="YSZero" label="零申报" width="120">
      </el-table-column>
      <el-table-column prop="YSSmall" label="小规模" width="120">
      </el-table-column>
      <el-table-column prop="YSGeneral" label="一般纳税人" width="120">
      </el-table-column>
      <el-table-column prop="YSHJ" label="小计" width="120">
      </el-table-column>
    </el-table-column>
    <el-table-column label="实收" header-align="center">
      <el-table-column prop="SSZero" label="零申报" width="120">
      </el-table-column>
      <el-table-column prop="SSSmall" label="小规模" width="120">
      </el-table-column>
      <el-table-column prop="SSGeneral" label="一般纳税人" width="110">
      </el-table-column>
      <el-table-column prop="SSHJ" label="小计" width="120">
      </el-table-column>
    </el-table-column>
  </el-table>
</div>
</template>
<script>
import SearchParams from '@/components/searchParamsNew.vue'
import {
  getAgentsReports
} from '../api/api'
import ExcelDown from '../service/excelDown'

export default {
  name: 'statisA',
  data: function () {
    return {
      tableData: [],
      allData: [],
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
    var userInfos = JSON.parse(sessionStorage.getItem('userInfo'))
    this.IsCenter = userInfos.IsCenter
    this.fetchData()
  },
  mounted() {
    this.tableHeight = document.querySelector('.content-right').offsetHeight - 163
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
      getAgentsReports(this.params).then((res) => {
        this.tableData = res.data
      })
    },
    onSearch(params) {
      console.log(params)
      this.params.startdate = params.starttime
      this.params.enddate = params.endtime
      this.params.status = params.status
      this.params.cityCodes = params.ccodes
      this.params.channelname = params.channelname
      this.fetchData()
    },
    onDownload() {
      ExcelDown().tableToExcel('dataTable', '业绩统计')
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
        const values = data.map(item => parseFloat(item[column.property]))
        if (index > 5 && index < 10) {
          sums[index] = values.reduce((prev, curr) => {
            const value = parseFloat(curr)
            if (!isNaN(value)) {
              return prev + curr
            } else {
              return prev
            }
          }, 0)
        } else if (index >= 10) {
          sums[index] = values.reduce((prev, curr) => {
            const value = parseFloat(curr)
            if (!isNaN(value)) {
              if (/\./g.test(value)) {
                return (parseFloat(prev) + parseFloat(curr)).toFixed(2)
              } else {
                return parseFloat(prev) + parseFloat(curr)
              }
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
<style scoped>
</style>
