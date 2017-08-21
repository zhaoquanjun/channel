<template>
<div class="finance3">
  <h2 class="text-center">代理商当前余额表</h2>
  <div class="vsearch">
    <el-form ref="params" :inline="true" :model="params">
      <el-form-item class="form-width" label="代理商">
        <el-autocomplete class="inline-input" v-model="params.channelname" :trigger-on-focus="false" :fetch-suggestions="querySearch"></el-autocomplete>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="onSearch">查询</el-button>
        <el-button type="primary" @click="onDownload" :disabled="!tableData.length">导出</el-button>
      </el-form-item>
    </el-form>
  </div>
  <el-table :data="tableData" border style="width: 100%">
    <el-table-column prop="ChannelName1" label="一级代理" width="250"></el-table-column>
    <el-table-column prop="ChannelName2" label="二级代理" width="200"></el-table-column>
    <el-table-column prop="CZAmount" label="累计充值金额"></el-table-column>
    <el-table-column prop="ZFAmount" label="累计支付金额"></el-table-column>
    <el-table-column prop="Balance" label="余额"></el-table-column>
  </el-table>
  <el-pagination @size-change="handleSizeChange" @current-change="handleCurrentChange" :current-page="pagination.currentPage" :page-sizes="[10, 20, 30]" :page-size="pagination.pageSize" layout="total, sizes, prev, pager, next, jumper" :total="pagination.total"
    style="text-align:center; margin:20px;">
  </el-pagination>
</div>
</template>

<script>
import { getcurrentbalancedetails } from '@/api/api'
export default {
  props: ['agents'],
  data: function() {
    return {
      pagination: {
        total: 0,
        pageSize: 10,
        currentPage: 1
      },
      tableData: [],
      params: {
        channelname: ''
      }
    }
  },
  created() {

  },
  methods: {
    onSearch(params) {
      let limit = this.pagination.pageSize
      let offset = (this.pagination.currentPage - 1) * limit
      let channelname = this.params.channelname
      getcurrentbalancedetails({
        limit: limit,
        offset: offset,
        channelname: channelname
      }).then((res) => {
        // console.log(res.data)
        this.tableData = res.data
        this.pagination.total = res.Count
      })
    },
    onDownload(params) {
      const {
        channelname
      } = this.params
      if (this.pagination.total > 4000) {
        this.$message({
          type: 'warning',
          message: '总条数过多，请缩小查询范围'
        })
      } else {
        const url = `/api/download/getcurrentbalancedetails?channelname=${channelname || ''}`
        console.log(url)
        window.open(url)
      }
    },
    querySearch(queryString, cb) {
      var channels = this.agents
      var results = queryString ? channels.filter(this.createFilter(queryString)) : channels
      cb(results)
    },
    createFilter(queryString) {
      return (channel) => {
        return (channel.value.indexOf(queryString) >= 0)
      }
    },
    handleSizeChange(val) {
      this.pagination.pageSize = val
      this.onSearch()
    },
    handleCurrentChange(val) {
      this.pagination.currentPage = val
      this.onSearch()
    }
  }
}
</script>

<style>
.finance3 .form-width .el-form-item__content {
  width: 120px;
}
</style>
