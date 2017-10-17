<template>
<div class="baobiao1">
  <h3 class="vheader">运营会计数据总览</h3>
  <SearchParams :length="tableData.length"  @search="onSearch" @download="onDownload" :make-account="true"></SearchParams>
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
    <el-table-column prop="AllCusNum" label="全部客户数" width="150">
    </el-table-column>
    <el-table-column prop="TotalNum" label="Agent系统客户数" width="150">
    </el-table-column>
    <el-table-column prop="NoSetUpNum" label="未建账">
    </el-table-column>
    <el-table-column label="建账完成" header-align="center">
      <el-table-column prop="RingNum" label="当前账期" width="130">
      </el-table-column>
      <el-table-column prop="LateNum" label="历史账期-需补账" width="150">
      </el-table-column>
      <el-table-column prop="UnstartNum" label="未开始做账" width="150">
      </el-table-column>
    </el-table-column>
    <el-table-column prop="HungNum" label="挂起">
    </el-table-column>
  </el-table>
</div>
</template>
<script>
import SearchParams from '@/components/searchParams.vue'
import {
  agenttotalcustomer
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
      agenttotalcustomer(this.params).then((res) => {
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
      ExcelDown().tableToExcel('dataTable', '运营会计数据')
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
      // console.log(arguments, 'arguments')
      // 不同列下载东西不一样
      // console.log(cell.cellIndex)
      var AccountId = row.AccountId
      // console.log(AccountId)
      var enddate = this.params.enddate
      if (!enddate) {
        var date = new Date()
        enddate = date
      }
      // console.log(enddate)
      var agent = 'https://agent.pilipa.cn/api/v1/AgentExport.ashx'
      var url = ''
      if (cell.cellIndex === 6) {
        url = agent + `?type=totalcustomer&accountid=${AccountId || ''}&enddate=${enddate || ''}`
      } else if (cell.cellIndex === 9) {
        url = agent + `?type=historybusinessdate&accountid=${AccountId || ''}&enddate=${enddate || ''}`
      } else if (cell.cellIndex === 11) {
        url = agent + `?type=totalhung&accountid=${AccountId || ''}&enddate=${enddate || ''}`
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
.baobiao1 .el-table__body tr td:nth-child(7) .cell{
  cursor: pointer;
  color: #20a0ff;
  text-decoration: underline;
}
.baobiao1 .el-table__body tr td:nth-child(10) .cell{
  cursor: pointer;
  color: #20a0ff;
  text-decoration: underline;
}
.baobiao1 .el-table__body tr td:nth-child(12) .cell{
  cursor: pointer;
  color: #20a0ff;
  text-decoration: underline;
}
</style>
