<template>
<div class="statis-new-customers">
  <h3 class="vheader">新增客户统计</h3>
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
    <el-table-column prop="Status" label="代理商是否解约" :formatter="handleStatus" min-width="150">
    </el-table-column>
    <el-table-column label="新增客户数" header-align="center">
      <el-table-column prop="ZeroNum" label="零申报" width="130">
      </el-table-column>
      <el-table-column prop="SmallNum" label="小规模" width="130">
      </el-table-column>
      <el-table-column prop="NormalNum" label="一般纳税人" width="150">
      </el-table-column>
      <el-table-column prop="CustomerNum" label="小计" width="150">
      </el-table-column>
    </el-table-column>
    <el-table-column prop="ContractAmount" label="新增客户金额" width="150">
    </el-table-column>
    <el-table-column prop="ZeroAmount" label="新增零申报金额" width="150">
    </el-table-column>
  </el-table>
  <!-- <el-pagination @size-change="handleSizeChange" @current-change="handleCurrentChange" :current-page="pagination.currentPage" :page-sizes="[10, 20, 30]" :page-size="pagination.pageSize" layout="total, sizes, prev, pager, next, jumper" :total="pagination.total"
    style="text-align:center; margin:20px;">
  </el-pagination> -->
</div>
</template>
<script>
import SearchParams from '@/components/searchParamsNew.vue'
import {
  getNewCustomer
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
      getNewCustomer(this.params).then((res) => {
        // console.log(res)
        this.tableData = res.data.DataInfo
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
    // onSearch(params) {
    //   if (params) {
    //     this.params = params
    //   }
    //   // let limit = this.pagination.pageSize
    //   // let offset = (this.pagination.currentPage - 1) * limit
    //   // this.params.limit = limit
    //   // this.params.offset = offset
    //   getNewCustomer(this.params).then(res => {
    //     this.pagination.total = res.Count
    //     this.tableData = res.data.DataInfo
    //     // this.total = res.data.Total[0]
    //   })
    // },
    onDownload() {
      var exportHref = ExcelDown().tableToExcel('dataTable', 'sheet name')
      setTimeout(function() { location.href = exportHref }, 100) // trigger download
    },
    // handleSizeChange(val) {
    //   this.pagination.pageSize = val
    //   this.onSearch()
    // },
    // handleCurrentChange(val) {
    //   this.pagination.currentPage = val
    //   this.onSearch()
    // },
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
      if (cell.cellIndex === 6) {
        url = '/api/download/getzeroorders' + Param
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
.statis-new-customers .el-table__body tr td:nth-child(7) .cell{
  cursor: pointer;
  color: #20a0ff;
  text-decoration: underline;
}
</style>
