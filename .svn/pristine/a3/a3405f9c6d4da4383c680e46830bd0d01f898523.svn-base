<template>
<div>
  <h3 class="vheader">财务信息</h3>
  <div class="vsearch">
    <el-form ref="params" :inline="true" :model="params">
      <el-form-item label="代理商">
        <el-autocomplete class="inline-input" v-model="params.channelname" :trigger-on-focus="false" :fetch-suggestions="querySearch" placeholder="请输入内容"></el-autocomplete>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="fetchData">查询</el-button>
      </el-form-item>
    </el-form>
  </div>
  <el-table :data="tableData" border style="width: 100%">
    <el-table-column prop="ProvinceName" label="省" max-width="120">
    </el-table-column>
    <el-table-column prop="CityName" label="市" max-width="120">
    </el-table-column>
    <el-table-column prop="ChannelName1" label="代理商" min-width="200">
    </el-table-column>
    <el-table-column prop="ChannelName2" label="二级代理商" min-width="200">
    </el-table-column>
    <el-table-column prop="Address" label="地址" min-width="200">
    </el-table-column>
    <el-table-column prop="Tel" label="联系方式" width="130">
      <template scope="scope">
        <span v-text="scope.row.Tel"></span><br>
        <span v-text="scope.row.Mobile"></span>
      </template>
    </el-table-column>
    <el-table-column prop="Balance" label="余额" width="120">
    </el-table-column>
    <el-table-column label="操作" width="200">
      <template scope="scope">
          <!-- <el-button @click="addMoney(scope.row)" type="text" size="small">充值</el-button> -->
          <el-button @click="addMoneyDetail(scope.row)" type="text" size="small">充值明细</el-button>
          <el-button @click="payDetail(scope.row)" type="text" size="small">支付明细</el-button>
        </template>
    </el-table-column>
  </el-table>
  <el-pagination @size-change="handleSizeChange" @current-change="handleCurrentChange" :current-page="pagination.currentPage" :page-sizes="[10, 20, 30]" :page-size="pagination.pageSize" layout="total, sizes, prev, pager, next, jumper" :total="pagination.total"
    style="text-align:center; margin:20px;">
  </el-pagination>
</div>
</template>

<script>
import {
  getAgents,
  agents
} from '../api/api'
import Dialog from '../service/dialog.js'
// import AddMoney from '../components/addMoney.vue'
import AddMoneyDetail from '../components/addMoneyDetail.vue'
// import bus from '../bus'
export default {
  data: function() {
    return {
      pagination: {
        total: 0,
        pageSize: 10,
        currentPage: 1
      },
      tableData: [],
      agents: [],
      isShowSearch: false,
      channels: [],
      params: {
        channelname: ''
      },
      detail: '', // 充值详情列表
      payList: '', // 支付明细列表
      val: ''
    }
  },
  created() {
    this.fetchData()
    this.getAgents()
  },
  methods: {
    fetchData() {
      let limit = this.pagination.pageSize
      let offset = (this.pagination.currentPage - 1) * limit
      let channelname = this.params.channelname
      getAgents({
        limit: limit,
        offset: offset,
        channelname: channelname
      }).then((res) => {
        this.tableData = res.data
        this.pagination.total = res.Count
        this.isShowSearch = false
      })
    },
    getAgents() {
      agents().then((res) => {
        this.agents = res.data
        for (let i in this.agents) {
          this.agents[i].value = this.agents[i].ChannelName
        }
        // console.log(this.agents)
      })
    },
    // addMoney(row) {
    //   Dialog(AddMoney, {
    //     row: row
    //   })
    //   bus.$on('finance-success', () => {
    //     this.fetchData()
    //   })
    // },
    addMoneyDetail(row) {
      let channelId = row.ChannelId
      Dialog(AddMoneyDetail, {
        channelId: channelId,
        type: 2
      })
    },
    payDetail(row) {
      // type == 1
      let channelId = row.ChannelId
      Dialog(AddMoneyDetail, {
        channelId: channelId,
        type: 1
      })
    },
    handleSizeChange(val) {
      this.pagination.pageSize = val
      this.fetchData()
    },
    handleCurrentChange(val) {
      this.pagination.currentPage = val
      this.fetchData()
    },
    querySearch(queryString, cb) {
      // console.log(queryString)
      var channels = this.agents
      var results = queryString ? channels.filter(this.createFilter(queryString)) : channels
      // console.log(results)
      // 调用 callback 返回建议列表的数据
      cb(results)
    },
    createFilter(queryString) {
      return (channel) => {
        return (channel.value.indexOf(queryString) >= 0)
      }
    }
  }
}
</script>

<style scoped>
.channel-list {
  position: relative;
  background: #eee;
  z-index: 2
}
</style>
