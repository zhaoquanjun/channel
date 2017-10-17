<template>
<div class="baobiao4">
  <h3 class="vheader">做账与报税数据统计</h3>
  <SearchParams :length="tableData.length" @search="onSearch" @download="onDownload" :make-account="true"></SearchParams>
  <el-table id="dataTable" :data="tableData" @cell-click="downloadColumn" border style="width: 100%" :show-summary="true" :summary-method="getSummaries" :max-height="tableHeight" v-table-sum>
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
    <el-table-column prop="CurrentBusinessDateCompanyCount" label="当前账期" width="150">
    </el-table-column>
    <el-table-column prop="TiDanZero" label="零申报">
    </el-table-column>
    <el-table-column prop="ConfirmZero" label="确认零票" width="150">
    </el-table-column>
    <el-table-column prop="UnMonition" label="未传票">
    </el-table-column>
    <el-table-column label="账务确认" header-align="center">
      <el-table-column prop="UnMakeAccount" label="待出账" width="130">
      </el-table-column>
      <el-table-column prop="MakeAccountUnConfirm" label="出账待确认" width="130">
      </el-table-column>
      <!-- <el-table-column prop="ReceiptCompleteUnMakeAccount" label="传票完成未出账" width="150">
      </el-table-column> -->
      <el-table-column prop="Confirm" label="已确认" width="130">
      </el-table-column>
    </el-table-column>
    <el-table-column label="报税" header-align="center">
      <el-table-column prop="Tax" label="申报" width="130">
      </el-table-column>
      <el-table-column prop="UnTax" label="未申报" width="130">
      </el-table-column>
    </el-table-column>
  </el-table>
</div>
</template>
<script>
import SearchParams from '@/components/searchParams.vue'
import {
  agentaccountcustomer
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
      agentaccountcustomer(this.params).then((res) => {
        this.tableData = res.data
      })
    },
    onSearch(params) {
      console.log(params)
      this.params.enddate = params.cuttime
      this.params.ccodes = params.ccodes
      this.params.channelname = params.channelname
      this.fetchData()
    },
    onDownload() {
      ExcelDown().tableToExcel('dataTable', '做账与报税数据统计')
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
      console.log(AccountId)
      var enddate = this.params.enddate
      if (!enddate) {
        var date = new Date()
        enddate = date
      }
      console.log(enddate)
      var agent = 'https://agent.pilipa.cn/api/v1/AgentExport.ashx'
      var url = ''
      if (cell.cellIndex === 9) {
        url = agent + `?type=getmonitionandunmakeaccount&accountid=${AccountId || ''}&enddate=${enddate || ''}`
      } else if (cell.cellIndex === 10) {
        url = agent + `?type=getmakeaccountandunconfirm&accountid=${AccountId || ''}&enddate=${enddate || ''}`
      } else if (cell.cellIndex === 13) {
        url = agent + `?type=getuntax&accountid=${AccountId || ''}&enddate=${enddate || ''}`
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
.baobiao4 .el-table__body tr td:nth-child(10) .cell{
  cursor: pointer;
  color: #20a0ff;
  text-decoration: underline;
}
.baobiao4 .el-table__body tr td:nth-child(11) .cell{
  cursor: pointer;
  color: #20a0ff;
  text-decoration: underline;
}
.baobiao4 .el-table__body tr td:nth-child(14) .cell{
  cursor: pointer;
  color: #20a0ff;
  text-decoration: underline;
}
</style>
