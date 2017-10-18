<template>
<div class="charge-back">
  <h3 class="vheader">退单记录</h3>
  <div class="vsearch">
    <el-form ref="params" :inline="true" :model="params">
      <el-form-item label="退单日期">
        <el-date-picker class="inputWiddate" v-model="params.startdate" type="date" placeholder="开始日期" :clearable="clearable">
        </el-date-picker>
        <span>-</span>
        <el-date-picker class="inputWiddate" v-model="params.enddate" type="date" placeholder="结束日期" :clearable="clearable">
        </el-date-picker>
      </el-form-item>
      <el-form-item label="代理商">
        <el-autocomplete class="inputWid" v-model="params.channelname" :trigger-on-focus="false" :fetch-suggestions="querySearch"></el-autocomplete>
      </el-form-item>
      <el-form-item label="代理商是否解约">
        <el-select class="selectWid" v-model="params.status">
          <el-option v-for="item in Status" :key="item.status" :label="item.statusName" :value="item.status">
          </el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="公司名称">
        <el-input class="inputWid" v-model="params.customername"></el-input>
      </el-form-item>
      <el-form-item label="订单编号">
        <el-input class="inputWid" v-model="params.orderid"></el-input>
      </el-form-item>
      <el-form-item label="已开发票">
        <el-select class="selectWid" v-model="params.type " clearable placeholder="全部">
          <el-option v-for="item in types" :key="item.type" :label="item.name" :value="item.type">
          </el-option>
        </el-select>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="fetchData">查询</el-button>
        <el-button type="primary" @click="onDownload" :disabled="!tableData.length">导出</el-button>
      </el-form-item>
    </el-form>
  </div>
  <el-table :data="tableData" border style="width: 100%">
    <el-table-column prop="ProvinceName" label="省" width="120">
    </el-table-column>
    <el-table-column prop="CityName" label="市" width="120">
    </el-table-column>
    <el-table-column prop="ChannelName1" label="一级代理商" min-width="200">
    </el-table-column>
    <el-table-column prop="ChannelName2" label="二级代理商" min-width="200">
    </el-table-column>
    <el-table-column prop="Status" label="代理商是否解约">
    </el-table-column>
    <el-table-column prop="CustomerName" label="公司名称" min-width="200">
    </el-table-column>
    <el-table-column prop="OrderId" label="订单编号" min-width="210">
    </el-table-column>
    <el-table-column prop="BackAmount" label="退单金额" min-width="120">
    </el-table-column>
    <el-table-column prop="BackReason" label="退单原因" min-width="200">
    </el-table-column>
    <el-table-column prop="CreateDate" label="退单日期" :formatter="StatusDate" min-width="115">
    </el-table-column>
    <el-table-column prop="IsInvoice" label="已开发票">
    </el-table-column>
    <el-table-column prop="InvoiceId" label="发票申请编号" min-width="120">
    </el-table-column>
    <el-table-column prop="BLAmount" label="订单可开金额" min-width="120">
    </el-table-column>
    <el-table-column label="操作" width="80">
      <template scope="scope">
        <el-button @click="viewOrder(scope.row)" type="text" size="small">查看</el-button>
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
  getchargebackorderlist,
  agents
} from '@/api/api'
import Dialog from '../service/dialog.js'
import RebackOrder from '@/views/components/rebackOrder'
export default {
  data() {
    return {
      pagination: {
        total: 0,
        pageSize: 10,
        currentPage: 1
      },
      Status: [
        {status: '', statusName: '全部'},
        {status: 0, statusName: '是'},
        {status: 1, statusName: '否'}
      ],
      types: [
        {type: 0, name: '全部'},
        {type: 1, name: '是'},
        {type: 2, name: '否'}
      ],
      agents: [],
      tableData: [],
      params: {
        customername: '',
        orderid: '',
        startdate: '',
        enddate: '',
        channelname: '',
        status: '',
        type: 0
      },
      clearable: false
    }
  },
  mounted() {
    this.fetchData()
    this.Agents()
  },
  methods: {
    fetchData() {
      let limit = this.pagination.pageSize
      let offset = (this.pagination.currentPage - 1) * limit
      let type = this.params.type
      let customername = this.params.customername
      let orderid = this.params.orderid
      let status = this.params.status
      let channelname = this.params.channelname
      let startdate = this.params.startdate
      let enddate = this.params.enddate
      getchargebackorderlist({
        limit: limit,
        offset: offset,
        type: type,
        customername: customername,
        orderid: orderid,
        status: status,
        channelname: channelname,
        startdate: startdate,
        enddate: enddate
      }).then((res) => {
        this.tableData = res.data
        this.pagination.total = res.Count
      })
    },
    Agents() {
      agents().then((res) => {
        this.agents = res.data
        for (let i in this.agents) {
          this.agents[i].value = this.agents[i].ChannelName
        }
      })
    },
    viewOrder(row) {
      if (row.ChannelName2) {
        var showCommissionAmount = true
      } else {
        showCommissionAmount = false
      }
      Dialog(RebackOrder, {
        isView: true,
        orderid: row.OrderId,
        showCommissionAmount: showCommissionAmount
      }).then(res => this.fetchData())
    },
    onDownload() {
      const {
        startdate,
        enddate,
        channelname,
        type,
        status,
        customername,
        orderid
      } = this.params
      const url = `/api/download/chargebackorderlist
?startdate=${startdate || ''}&enddate=${enddate || ''}&channelname=${channelname || ''}&type=${type}&status=${status}&customername=${customername}&orderid=${orderid}`
      window.open(url)
    },
    handleSizeChange(val) {
      this.pagination.pageSize = val
      this.fetchData()
    },
    handleCurrentChange(val) {
      this.pagination.currentPage = val
      this.fetchData()
    },
    StatusDate(row) {
      var date = row.CreateDate
      return date.substring(0, 10)
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
    }
  }
}
</script>

<style scoped>
.charge-back .inputWid {
  width: 100px;
}
.charge-back .selectWid {
  width: 77px;
}
.charge-back .inputWiddate {
  width: 120px;
}
</style>
