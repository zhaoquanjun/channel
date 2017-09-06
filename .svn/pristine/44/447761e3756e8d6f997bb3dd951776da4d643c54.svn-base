<template>
<div class="baobiao">
  <h3 class="vheader">待建账数据统计</h3>
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
    <el-table-column prop="UnMakeAccount" label="未建账客户数">
    </el-table-column>
    <el-table-column prop="UnMakeAccountLess10Day" label="10天以内未建账">
    </el-table-column>
    <el-table-column prop="UnMakeAccountMore10Day" label="10天以上未建账">
    </el-table-column>
  </el-table>
</div>
</template>
<script>
import SearchParams from '@/components/searchParams.vue'
import {
  agentrecallcustomer
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
      agentrecallcustomer(this.params).then((res) => {
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
      console.log(AccountId)
      var enddate = this.params.enddate
      if (!enddate) {
        var date = new Date()
        enddate = date
      }
      console.log(enddate)
      var agent = 'http://123.56.31.133:8083/api/v1/agentdata'
      var url = ''
      if (cell.cellIndex === 5) {
        url = agent + `/getunaccount?accountid=${AccountId || ''}&enddate=${enddate || ''}`
      } else if (cell.cellIndex === 7) {
        url = agent + `/getunaccountmore10day?accountid=${AccountId || ''}&enddate=${enddate || ''}`
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
.baobiao .el-table__body tr td:nth-child(5) .cell{
  cursor: pointer;
  color: #20a0ff;
  text-decoration: underline;
}
.baobiao .el-table__body tr td:nth-child(7) .cell{
  cursor: pointer;
  color: #20a0ff;
  text-decoration: underline;
}
</style>
