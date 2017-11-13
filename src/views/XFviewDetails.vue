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
    <el-table-column prop="Name" label="公司名称">
    </el-table-column>
    <el-table-column prop="AddedValueText" label="公司性质">
    </el-table-column>
    <el-table-column prop="LegalPerson" label="法人">
    </el-table-column>
    <el-table-column prop="Contacts" label="联系人">
    </el-table-column>
    <el-table-column prop="Mobile" label="联系人电话">
    </el-table-column>
    <el-table-column prop="UserName" label="销售">
    </el-table-column>
    <el-table-column prop="ServiceStart" label="开始账期">
    </el-table-column>
    <el-table-column prop="ServiceEnd" label="结束账期">
    </el-table-column>
    <el-table-column v-if="showDiffView = 1" prop="IsReOrderText" label="是否续费">
    </el-table-column>
    <el-table-column v-if="showDiffView != 2" prop="ReOrderData" label="续费时间">
    </el-table-column>
  </el-table>
</div>
</template>

<script>
import { dqDetails, wxfdDetails, yxfDetails } from '@/api/api'
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
      if (this.commonData.title === '到期客户明细') {
        this.showDiffView = 1
      } else if (this.commonData.title === '未续费客户明细') {
        this.showDiffView = 2
      } else if (this.commonData.title === '续费客户明细') {
        this.showDiffView = 3
      }
    },
    refresh() {
      this.setView()
      var params = {}
      params.year = this.commonData.year
      params.months = this.commonData.months
      params.channelid = this.commonData.channelid || ''
      console.log(this.showDiffView, 'this.showDiffView')
      if (this.showDiffView === 1) {
        dqDetails(params).then((res) => {
          this.tableData = res.data
        })
      } else if (this.showDiffView === 2) {
        wxfdDetails(params).then((res) => {
          this.tableData = res.data
        })
      } else if (this.showDiffView === 3) {
        yxfDetails(params).then((res) => {
          this.tableData = res.data
        })
      }
    },
    download() {
      this.setView()
      var channelid = this.commonData.channelid
      var year = this.commonData.year
      var months = this.commonData.months
      var url = ''
      console.log(this.showDiffView, '下载')
      var Param = `?channelid=${channelid || ''}&year=${year || ''}&months=${months || ''}`
      if (this.showDiffView === 1) {
        url = '/api/download/getexpireorderdetails' + Param
      } else if (this.showDiffView === 2) {
        url = '/api/download/getnoreorderdetails' + Param
      } else if (this.showDiffView === 3) {
        url = '/api/download/getreorderdetails' + Param
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
