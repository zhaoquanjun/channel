<template>
<div class="statis-orders">
  <h3 class="vheader">订单统计</h3>
  <SearchParams :length="tableData.length" @search="onSearch" @download="onDownload"></SearchParams>
  <el-table id="dataTable" :data="tableData" border style="width: 100%" :show-summary="true" :summary-method="getSummaries" :max-height="tableHeight" v-table-sum @cell-click="downloadColumn">
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
    <el-table-column label="套餐类型" header-align="center">
      <el-table-column prop="ZeroYearNum" label="零税半年报" width="130">
      </el-table-column>
      <el-table-column prop="QuarterNum" label="季度报" width="130">
      </el-table-column>
      <el-table-column prop="HalfYearNum" label="半年报" width="150">
      </el-table-column>
      <el-table-column prop="YearNum" label="一年报" width="150">
      </el-table-column>
    </el-table-column>
    <el-table-column label="订单类型" header-align="center">
      <el-table-column prop="ReserveNum" label="预提单" width="130">
      </el-table-column>
      <el-table-column prop="FormalNum" label="正式订单" width="130">
      </el-table-column>
    </el-table-column>
    <el-table-column label="订单性质" header-align="center">
      <el-table-column prop="NewNum" label="新签订单数" width="150">
      </el-table-column>
      <el-table-column prop="ReNum" label="续费订单数" width="150">
      </el-table-column>
    </el-table-column>
    <el-table-column label="客户类型" header-align="center">
      <el-table-column prop="ZeroNum" label="零申报" width="110">
      </el-table-column>
      <el-table-column prop="SmallNum" label="小规模" width="110">
      </el-table-column>
      <el-table-column prop="NormalNum" label="一般纳税人" width="120">
      </el-table-column>
      <el-table-column prop="TotalNum" label="小计" width="100">
      </el-table-column>
    </el-table-column>
  </el-table>
</div>
</template>
<script>
import SearchParams from '@/components/searchParamsNew.vue'
import {
  getStatisOrders
} from '../api/api'
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
  },
  mounted() {
    this.tableHeight = document.querySelector('.content-right').offsetHeight - 105
  },
  methods: {
    fetchData() {
      getStatisOrders(this.params).then((res) => {
        console.log(res)
        this.tableData = res.data
      })
    },
    onSearch(params) {
      console.log(params)
      this.params.startdate = params.starttime
      this.params.enddate = params.endtime
      this.params.cityCodes = params.ccodes
      this.params.channelname = params.channelname
      this.params.status = params.status
      this.fetchData()
    },
    onDownload() {
      var exportHref = ExcelDown().tableToExcel('dataTable', 'sheet name')
      setTimeout(function() { location.href = exportHref }, 100) // trigger download
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
        if (index > 4) {
          sums[index] = values.reduce((prev, curr) => {
            const value = Number(curr)
            if (!isNaN(value)) {
              return (parseFloat(prev) + parseFloat(curr)).toFixed(2)
            } else {
              return parseFloat(prev).toFixed(2)
            }
          }, 0)
        } else {
          sums[index] = '-'
        }
      })

      return sums
    },
    downloadColumn(row, column, cell) {
      // console.log(arguments, 'arguments')
      // 不同列下载东西不一样
      // console.log(cell.cellIndex)
      var channelid = row.ChannelId
      // console.log(AccountId)
      var startdate = this.params.startdate
      var enddate = this.params.enddate
      var url = ''
      var Param = `?channelid=${channelid || ''}&startdate=${startdate || ''}&enddate=${enddate || ''}`
      if (cell.cellIndex === 9) {
        url = '/api/download/getreserveorders' + Param
      } else if (cell.cellIndex === 13) {
        url = '/api/download/getzeroorders' + Param
      }
      window.open(url)
    }
  },
  components: {
    SearchParams
  }
}
</script>
<style>
.statis-orders .el-table__body tr td:nth-child(10) .cell{
  cursor: pointer;
  color: #20a0ff;
  text-decoration: underline;
}
.statis-orders .el-table__body tr td:nth-child(14) .cell{
  cursor: pointer;
  color: #20a0ff;
  text-decoration: underline;
}
</style>
