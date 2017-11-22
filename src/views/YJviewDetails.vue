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
    <el-table-column prop="PartitionName" label="大区" width="80px">
    </el-table-column>
    <el-table-column prop="ProvinceName" label="省" width="90px">
    </el-table-column>
    <el-table-column prop="CityName" label="市" width="90px">
    </el-table-column>
    <el-table-column prop="ChannelName1" label="一级代理商" min-width="150px">
    </el-table-column>
    <el-table-column prop="ChannelName2" label="二级代理商" min-width="100px">
    </el-table-column>
    <el-table-column prop="Name" label="公司名称" min-width="150px">
    </el-table-column>
    <el-table-column prop="AddedValueText" label="法人" width="100px">
    </el-table-column>
    <el-table-column v-if="isShowZSB" prop="ServiceStart" label="开始账期" width="115px">
    </el-table-column>
    <el-table-column v-if="isShowZSB" prop="ServiceEnd" label="结束账期" width="115px">
    </el-table-column>
    <el-table-column v-if="isShowZSB" prop="CategoryText" label="订单类型" width="100px">
    </el-table-column>
    <el-table-column prop="ContractAmount" label="合同金额" width="100px">
    </el-table-column>
    <el-table-column prop="BLAmount" label="提单金额" width="100px">
    </el-table-column>
    <el-table-column prop="SSAmount" label="折后金额" width="100px">
    </el-table-column>
  </el-table>
</div>
</template>

<script>
import { ytdDetails, zsbDetails } from '@/api/api'
export default {
  data: function() {
    return {
      commonData: {},
      tableData: [],
      isShowZSB: false
    }
  },
  created() {
    this.commonData = this.$route.query
    if (this.commonData.title === '预提单明细表') {
      this.isShowZSB = false
    } else {
      this.isShowZSB = true
    }
    this.refresh()
  },
  methods: {
    refresh() {
      var params = {}
      params.startdate = this.commonData.startdate
      params.enddate = this.commonData.enddate
      params.channelid = this.commonData.channelid || ''
      if (this.commonData.title === '零申报明细表' && !this.commonData.iscustomers) {
        zsbDetails(params).then((res) => {
          this.tableData = res.data
        })
      } else if (this.commonData.title === '预提单明细表') {
        ytdDetails(params).then((res) => {
          this.tableData = res.data
        })
      } else if (this.commonData.title === '零申报明细表' && this.commonData.iscustomers) {
        params.iscustomers = this.commonData.iscustomers
        zsbDetails(params).then((res) => {
          this.tableData = res.data
        })
      }
    },
    download() {
      var channelid = this.commonData.channelid
      var startdate = this.commonData.startdate
      var enddate = this.commonData.enddate
      var url = ''
      var Param = `?channelid=${channelid || ''}&startdate=${startdate || ''}&enddate=${enddate || ''}`
      if (this.commonData.title === '零申报明细表' && !this.commonData.iscustomers) {
        url = '/api/download/getzeroorders' + Param
      } else if (this.commonData.title === '预提单明细表') {
        url = '/api/download/getreserveorders' + Param
      } else if (this.commonData.title === '零申报明细表' && this.commonData.iscustomers) {
        Param = `?iscustomers=1&channelid=${channelid || ''}&startdate=${startdate || ''}&enddate=${enddate || ''}`
        url = '/api/download/getzeroorders' + Param
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
