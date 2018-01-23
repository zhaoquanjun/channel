<template>
<div class="recharge-check">
  <h3 class="vheader">充值审核</h3>
  <div class="vsearch">
    <el-form ref="params" :inline="true" :model="params">
      <el-form-item label="申请时间">
        <el-date-picker v-model="params.starttime" type="date" :clearable="clearable">
        </el-date-picker>
        <span>-</span>
        <el-date-picker v-model="params.endtime" type="date" :clearable="clearable">
        </el-date-picker>
      </el-form-item>
      <el-form-item label="代理商">
        <el-autocomplete class="form-width2" v-model="params.channelname" :trigger-on-focus="false" :fetch-suggestions="querySearch"></el-autocomplete>
      </el-form-item>
      <el-form-item class="form-width1" label="代理商是否解约">
        <el-select v-model="params.channelstatus">
          <el-option v-for="item in Status" :key="item.status" :label="item.statusName" :value="item.status">
          </el-option>
        </el-select>
      </el-form-item>
      <el-form-item class="form-width" label="审核状态">
        <el-select v-model="params.status">
          <el-option v-for="item in checkStatus" :key="item.status" :label="item.name" :value="item.status"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="fetchData">查询</el-button>
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
    <el-table-column prop="channelstatus" label="代理商是否解约" :formatter="handleStatus" width="100">
    </el-table-column>
    <el-table-column prop="Amount" label="充值金额" width="120">
    </el-table-column>
    <el-table-column prop="Balance" label="余额" width="120">
    </el-table-column>
    <el-table-column prop="CreateDate" label="申请时间" :formatter="StatusDate" width="130">
    </el-table-column>
    <el-table-column prop="Status" label="审核状态" :formatter="StatusFormat" width="100">
    </el-table-column>
    <el-table-column prop="AuditOpinion" label="审核意见" width="100">
    </el-table-column>
    <el-table-column v-if="category != 7 && category != 13" label="操作" width="200">
      <template scope="scope">
        <el-button @click="view(scope.row)" type="text" size="small">查看</el-button>
        <el-button v-if="scope.row.Status === 1" @click="pass(scope.row)" type="text" size="small">通过</el-button>
        <el-button v-if="scope.row.Status === 1" @click="refuse(scope.row)" type="text" size="small">驳回</el-button>
      </template>
    </el-table-column>
    <el-table-column v-else label="操作" width="200">
      <template scope="scope">
        <el-button @click="view(scope.row)" type="text" size="small">查看</el-button>
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
  agents,
  rechargeList
} from '../api/api'
import Dialog from '../service/dialog'
import RechargeDeatils from './components/rechargeDetails'
import RechargeSure from './components/rechargeSure'
import Refuse from '../components/refuse'
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
      params: {
        starttime: '',
        endtime: '',
        channelname: '',
        status: 1,
        channelstatus: ''
      },
      checkStatus: [{
        name: '未审核',
        status: 1
      }, {
        name: '通过',
        status: 2
      }, {
        name: '拒审',
        status: 3
      }],
      Status: [
        {status: '', statusName: '全部'},
        {status: 0, statusName: '是'},
        {status: 1, statusName: '否'}
      ],
      clearable: false,
      category: ''
    }
  },
  created() {
    this.category = JSON.parse(sessionStorage.getItem('userInfo')).Category
    console.log(this.category, 'category')
    this.fetchData()
    this.Agents()
  },
  methods: {
    fetchData() {
      let limit = this.pagination.pageSize
      let offset = (this.pagination.currentPage - 1) * limit
      let starttime = this.params.starttime
      let endtime = this.params.endtime
      let channelname = this.params.channelname
      let status = this.params.status
      let channelstatus = this.params.channelstatus
      rechargeList({
        limit: limit,
        offset: offset,
        start: starttime,
        end: endtime,
        channelname: channelname,
        status: status,
        channelstatus: channelstatus
      }).then((res) => {
        console.log(res.data)
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
        // console.log(this.agents)
      })
    },
    view(row) {
      Dialog(RechargeDeatils, {
        Id: row.Id
      })
    },
    pass(row) {
      Dialog(RechargeSure, {
        row: row
      }).then(() => {
        this.fetchData()
      })
    },
    refuse(row) {
      Dialog(Refuse, {
        sign: 'RECHARGE',
        title: '拒绝充值',
        row: row
      }).then(() => {
        this.fetchData()
      })
    },
    StatusFormat: function(row) {
      var status = row.Status
      switch (status) {
        case 1:
          status = '未审核'
          break
        case 2:
          status = '通过'
          break
        case 3:
          status = '拒审'
      }
      return status
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
    },
    handleStatus(row) {
      // console.log(row)
      var status = +row.channelstatus
      if (status === 0) {
        status = '是'
      } else if (status > 0) {
        status = '否'
      }
      return status
    },
    handleSizeChange(val) {
      this.pagination.pageSize = val
      this.fetchData()
    },
    handleCurrentChange(val) {
      this.pagination.currentPage = val
      this.fetchData()
    }
  }
}
</script>

<style>
.recharge-check .vsearch .form-width2 .el-input {
  width: 120px;
}
.recharge-check .vsearch .form-width .el-form-item__content {
  width: 90px;
}
.recharge-check .vsearch .form-width1 .el-form-item__content {
  width: 75px;
}
</style>
