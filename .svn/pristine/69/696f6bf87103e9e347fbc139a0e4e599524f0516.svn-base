<template>
<div class="baobiao3">
  <h3 class="vheader">传票数据统计</h3>
  <SearchParams :length="tableData.length" @search="onSearch" @download="onDownload" :make-account="true"></SearchParams>
  <el-table id="dataTable" :data="tableData" @cell-click="downloadColumn" border style="width: 100%" :show-summary="true" :summary-method="getSummaries" :max-height="tableHeight" v-table-sum>
    <!-- <el-table-column prop="PartitionName" label="日期" width="120">
    </el-table-column> -->
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
    <el-table-column prop="CurrentBusinessDateCompanyCount" label="当前账期">
    </el-table-column>
    <el-table-column prop="TiDanZero" label="零申报">
    </el-table-column>
    <el-table-column label="催票" header-align="center">
      <el-table-column prop="UnUrgeCount" label="未催" width="130">
      </el-table-column>
      <el-table-column prop="UrgeCount" label="已催" width="130">
      </el-table-column>
    </el-table-column>
    <el-table-column prop="ConfirmZero" label="确认零票">
    </el-table-column>
    <el-table-column label="传票" header-align="center">
      <el-table-column prop="UnMonitionCount" label="待传票" width="130">
      </el-table-column>
      <el-table-column prop="MonitionCount" label="传票未完成" width="130">
      </el-table-column>
      <el-table-column prop="MonitionCompleteCount" label="传票完成（有票）" width="150">
      </el-table-column>
    </el-table-column>
    <el-table-column prop="CompleteRate" :formatter="handleNum" label="传票完成率">
    </el-table-column>
    <el-table-column prop="RejectCount" label="驳票客户数">
    </el-table-column>
  </el-table>
</div>
</template>
<script>
import SearchParams from '@/components/searchParams.vue'
import {
  agentreceiptcustomer
} from '../api/api'
import ExcelDown from '../service/excelDown'

export default {
  data: function () {
    return {
      tableData: [],
      params: {
        enddate: '',
        ccodes: '',
        channelname: ''
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
      agentreceiptcustomer(this.params).then((res) => {
        this.tableData = res.data
      })
    },
    handleNum(row) {
      console.log(row)
      var completeRate = row.CompleteRate
      completeRate = completeRate * 100 + '%'
      return completeRate
    },
    onSearch(params) {
      console.log(params)
      this.params.enddate = params.cuttime
      this.params.ccodes = params.ccodes
      this.params.channelname = params.channelname
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
      var AccountId = row.AccountId
      // console.log(AccountId)
      var enddate = this.params.enddate
      if (!enddate) {
        var date = new Date()
        enddate = date
      }
      // console.log(enddate)
      var agent = 'http://123.56.31.133:8083/api/v1/AgentExport.ashx'
      var url = ''
      if (cell.cellIndex === 5) {
        url = agent + `?type=ReceiptDetail&accountid=${AccountId || ''}&enddate=${enddate || ''}`
      } else if (cell.cellIndex === 7) {
        url = agent + `?type=unurge&accountid=${AccountId || ''}&enddate=${enddate || ''}`
      } else if (cell.cellIndex === 8) {
        url = agent + `?type=urge&accountid=${AccountId || ''}&enddate=${enddate || ''}`
      } else if (cell.cellIndex === 10) {
        url = agent + `?type=requirereceipt&accountid=${AccountId || ''}&enddate=${enddate || ''}`
      } else if (cell.cellIndex === 14) {
        url = agent + `?type=rejectreceipt&accountid=${AccountId || ''}&enddate=${enddate || ''}`
      } else {
        // console.log(url, '不能点')
        return
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
.baobiao3 .el-table__body tr td:nth-child(6) .cell{
  cursor: pointer;
  color: #20a0ff;
  text-decoration: underline;
}
.baobiao3 .el-table__body tr td:nth-child(8) .cell{
  cursor: pointer;
  color: #20a0ff;
  text-decoration: underline;
}
.baobiao3 .el-table__body tr td:nth-child(9) .cell{
  cursor: pointer;
  color: #20a0ff;
  text-decoration: underline;
}
.baobiao3 .el-table__body tr td:nth-child(11) .cell{
  cursor: pointer;
  color: #20a0ff;
  text-decoration: underline;
}
.baobiao3 .el-table__body tr td:nth-child(15) .cell{
  cursor: pointer;
  color: #20a0ff;
  text-decoration: underline;
}
</style>
