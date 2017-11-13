<template>
<div class="view-detail-1">
  <div class="vheader">
    <h3>{{commonData.title}}</h3>
    <div class="header-right">
      <div class="header-refresh" @click="refresh()">
        <i class="fa fa-refresh" aria-hidden="true"></i>
        <span class="font-style">刷新</span>
      </div>
      <div class="header-download" @click="download">
        <i class="fa fa-download" aria-hidden="true"></i>
        <span class="font-style">下载</span>
      </div>
    </div>
  </div>
  <el-table :data="tableData" border style="width: 100%" height="570">
    <el-table-column prop="PartitionName" label="大区">
    </el-table-column>
    <el-table-column prop="ProvinceName" label="省">
    </el-table-column>
    <el-table-column prop="CityName" label="市">
    </el-table-column>
    <el-table-column prop="ChannelName1" label="一级代理商">
    </el-table-column>
    <el-table-column prop="ChannelName2" label="二级代理商">
    </el-table-column>
    <el-table-column prop="cname" label="公司名称">
    </el-table-column>
    <el-table-column prop="ctype" label="公司性质">
    </el-table-column>
    <el-table-column prop="lperson" label="法人">
    </el-table-column>
    <el-table-column v-if="showDiffView === 3" prop="little" label="是否转为小规模">
    </el-table-column>
    <el-table-column v-if="showDiffView === 3" prop="formal" label="是否转为一般纳税人">
    </el-table-column>
    <el-table-column v-if="showDiffView === 6" prop="istoformal" label="是否转为一般纳税人">
    </el-table-column>
    <el-table-column v-if="showDiffView === 1" prop="ischange" label="是否转为正式订单">
    </el-table-column>
    <el-table-column prop="CreateDate" label="提单时间">
    </el-table-column>
    <el-table-column prop="ChangeDate" label="转化时间">
    </el-table-column>
    <el-table-column prop="cdays" label="转化周期（天）">
    </el-table-column>
  </el-table>
</div>
</template>

<script>
import { LZytdDetails, LZzzsDetails, LZzsbDetails, LZzToxgmDetails, LZzToybDetails, LZlittleDetails, LZxToybDetails } from '@/api/api'
export default {
  data: function() {
    return {
      commonData: {},
      tableData: [],
      showDiffView: ''
    }
  },
  created() {
    this.commonData = this.$route.query
    console.log(this.commonData)
    this.setView()
    this.refresh()
  },
  methods: {
    setView() {
      if (this.commonData.title === '预提单明细表') {
        this.showDiffView = 1
      } else if (this.commonData.title === '转正式单明细表') {
        this.showDiffView = 2
      } else if (this.commonData.title === '零申报明细表') {
        this.showDiffView = 3
      } else if (this.commonData.title === '零申报转小规模明细表') {
        this.showDiffView = 4
      } else if (this.commonData.title === '零申报转一般纳税人明细表') {
        this.showDiffView = 5
      } else if (this.commonData.title === '小规模明细表') {
        this.showDiffView = 6
      } else if (this.commonData.title === '小规模转一般纳税人明细表') {
        this.showDiffView = 7
      }
    },
    refresh() {
      this.setView()
      var params = {}
      params.startdate = this.commonData.startdate
      params.enddate = this.commonData.enddate
      params.channelid = this.commonData.channelid || ''
      console.log(this.showDiffView, 'this.showDiffView')
      if (this.showDiffView === 1) {
        LZytdDetails(params).then((res) => {
          this.tableData = res.data
        })
      } else if (this.showDiffView === 2) {
        LZzzsDetails(params).then((res) => {
          this.tableData = res.data
        })
      } else if (this.showDiffView === 3) {
        LZzsbDetails(params).then((res) => {
          this.tableData = res.data
        })
      } else if (this.showDiffView === 4) {
        LZzToxgmDetails(params).then((res) => {
          this.tableData = res.data
        })
      } else if (this.showDiffView === 5) {
        LZzToybDetails(params).then((res) => {
          this.tableData = res.data
        })
      } else if (this.showDiffView === 6) {
        LZlittleDetails(params).then((res) => {
          this.tableData = res.data
        })
      } else if (this.showDiffView === 7) {
        LZxToybDetails(params).then((res) => {
          this.tableData = res.data
        })
      }
    },
    download() {
      this.setView()
      var channelid = this.commonData.channelid
      var startdate = this.commonData.startdate
      var enddate = this.commonData.enddate
      var url = ''
      console.log(this.showDiffView, '下载')
      var Param = `?channelid=${channelid || ''}&startdate=${startdate || ''}&enddate=${enddate || ''}`
      if (this.showDiffView === 1) {
        url = '/api/dataanalysis/exportbeforehandlist' + Param
      } else if (this.showDiffView === 2) {
        url = '/api/dataanalysis/exporttoformallist' + Param
      } else if (this.showDiffView === 3) {
        url = '/api/dataanalysis/exportzerolist' + Param
      } else if (this.showDiffView === 4) {
        url = '/api/dataanalysis/exporttolittlelist' + Param
      } else if (this.showDiffView === 5) {
        url = '/api/dataanalysis/exportzerotoformallist' + Param
      } else if (this.showDiffView === 6) {
        url = '/api/dataanalysis/exportlittlelist' + Param
      } else if (this.showDiffView === 7) {
        url = '/api/dataanalysis/exportlittletoformallist' + Param
      }
      window.open(url)
    }
  }
}
</script>

<style scoped>
.view-detail-1 .vheader {
  overflow: hidden;
}
.view-detail-1 .vheader h3 {
  float: left;
  margin: 0
}
.view-detail-1 .vheader .header-right {
  float: right;
}
.view-detail-1 .vheader .header-right div {
  float: left;
  cursor: pointer;
  width: 60px;
  margin: 0 10px;
  text-align: center;
  color: #20a0ff;
}
</style>
