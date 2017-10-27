<template>
<div class="finance1">
  <h2 class="text-center">充值明细表</h2>
  <div class="vsearch">
    <el-form ref="params" :inline="true" :model="params">
      <el-form-item label="账单日期">
        <el-date-picker class="dataWidth" v-model="params.starttime" type="date" :clearable="clearable">
        </el-date-picker>
        <span>-</span>
        <el-date-picker class="dataWidth" v-model="params.endtime" type="date" :clearable="clearable">
        </el-date-picker>
      </el-form-item>
      <el-form-item class="form-width" label="代理商">
        <el-autocomplete class="inline-input" v-model="params.channelname" :trigger-on-focus="false" :fetch-suggestions="querySearch"></el-autocomplete>
      </el-form-item>
      <el-form-item class="form-width" label="代理商是否解约">
        <el-select v-model="params.status">
          <el-option v-for="item in Status" :key="item.status" :label="item.statusName" :value="item.status">
          </el-option>
        </el-select>
      </el-form-item>
      <el-form-item class="form-width2" label="充值类型">
        <el-select v-model="params.type" @change="ShowFinanceType">
          <el-option v-for="item in financeType" :key="item.type" :label="item.name" :value="item.type"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item class="form-width2" label="">
        <el-select v-model="params.subtype" :disabled="isShowAllChildFinanceType">
          <el-option v-for="item in financeTypeChild" :key="item.Id" :label="item.RechargeName" :value="item.Id"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item class="form-width" label="收款编号">
        <el-input v-model="params.collectionNumber"></el-input>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="onSearch">查询</el-button>
        <el-button type="primary" @click="onDownload" :disabled="!tableData.length">导出</el-button>
      </el-form-item>
    </el-form>
  </div>
  <el-table :data="tableData" border style="width: 100%">
    <el-table-column prop="ChannelName1" label="一级代理商" width="250">
    </el-table-column>
    <el-table-column prop="ChannelName2" label="二级代理商" width="200">
    </el-table-column>
    <el-table-column prop="Status" label="代理商是否解约" :formatter="handleStatus">
    </el-table-column>
    <el-table-column prop="BillTime" label="账单日期" align="center" :formatter="StatusDate">
    </el-table-column>
    <el-table-column prop="Category" label="充值类型" align="center" :formatter="TypeFormat">
    </el-table-column>
    <el-table-column prop="subtype" label="充值子类型" align="center" width="110">
    </el-table-column>
    <el-table-column prop="Amount" label="充值金额" align="center">
    </el-table-column>
    <el-table-column prop="CollectionNumber" label="收款编号" align="center" width="200">
    </el-table-column>
  </el-table>
  <el-pagination @size-change="handleSizeChange" @current-change="handleCurrentChange" :current-page="pagination.currentPage" :page-sizes="[10, 20, 30]" :page-size="pagination.pageSize" layout="total, sizes, prev, pager, next, jumper" :total="pagination.total"
    style="text-align:center; margin:20px;">
  </el-pagination>
</div>
</template>

<script>
import {
  getrechargedetails,
  allRechargeType
} from '../../api/api'

export default {
  props: ['agents'],
  data: function() {
    return {
      Status: [
        {status: '', statusName: '全部'},
        {status: 0, statusName: '是'},
        {status: 1, statusName: '否'}
      ],
      pagination: {
        total: 0,
        pageSize: 10,
        currentPage: 1
      },
      tableData: [],
      params: {
        starttime: '',
        endtime: '',
        channelname: '',
        type: 0,
        status: '',
        subtype: '',
        collectionNumber: ''
      },
      financeType: [{
        name: '全部',
        type: 0
      }, {
        name: '正常充值',
        type: 2
      }, {
        name: '退单回充',
        type: 3
      }, {
        name: '返点',
        type: 4
      }, {
        name: '一代提成',
        type: 5
      }, {
        name: '中心充值',
        type: 7
      }],
      clearable: false,
      financeTypeChild: [],
      isShowAllChildFinanceType: true
    }
  },
  mounted() {
    this.getChildFinanceType()
  },
  methods: {
    getChildFinanceType() {
      allRechargeType().then(res => {
        if (res.status) {
          this.financeTypeChild = res.data
          var obj = {
            Id: '',
            RechargeName: '全部细类'
          }
          this.financeTypeChild.unshift(obj)
          console.log(this.financeTypeChild)
        }
      })
    },
    onSearch() {
      let limit = this.pagination.pageSize
      let offset = (this.pagination.currentPage - 1) * limit
      let channelname = this.params.channelname
      let starttime = this.params.starttime
      let endtime = this.params.endtime
      let type = this.params.type
      let status = this.params.status
      let subtype = this.params.subtype
      let collectionNumber = this.params.collectionNumber
      console.log(status)
      getrechargedetails({
        limit: limit,
        offset: offset,
        starttime: starttime,
        endtime: endtime,
        channelname: channelname,
        type: type,
        status: status,
        subtype: subtype,
        collectionNumber: collectionNumber
      }).then((res) => {
        // console.log(res.data)
        this.tableData = res.data
        this.pagination.total = res.Count
      })
    },
    onDownload() {
      const {
        starttime,
        endtime,
        channelname,
        type,
        status,
        subtype,
        collectionNumber
      } = this.params
      const url = `/api/download/getrechargedetails?starttime=${starttime || ''}&endtime=${endtime || ''}&channelname=${channelname || ''}&type=${type || 0}&status=${status}&subtype=${subtype}&collectionNumber=${collectionNumber || ''}`
      // console.log(url)
      window.open(url)
      // if (this.pagination.total > 1000) {
      //   this.$message({
      //     type: 'warning',
      //     message: '总条数过多，请缩小查询范围'
      //   })
      // } else {
      //   const url = `/api/download/getrechargedetails?starttime=${starttime || ''}&endtime=${endtime || ''}&channelname=${channelname || ''}&type=${type || 0}&status=${status || ''}`
      //   // console.log(url)
      //   window.open(url)
      // }
    },
    ShowFinanceType(val) {
      // console.log(val)
      if (val === 7) {
        this.isShowAllChildFinanceType = false
      } else {
        this.isShowAllChildFinanceType = true
        this.params.subtype = ''
      }
    },
    TypeFormat: function(row) {
      var type = row.Category
      switch (type) {
        case 2:
          type = '正常充值'
          break
        case 3:
          type = '退单回充'
          break
        case 4:
          type = '返点'
          break
        case 5:
          type = '一代提成'
          break
        case 7:
          type = '中心充值'
          break
      }
      return type
    },
    StatusDate(row) {
      var date = row.BillTime
      if (!date) {
        return ''
      }
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
      var status = +row.Status
      if (status === 0) {
        status = '是'
      } else if (status > 0) {
        status = '否'
      }
      return status
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
.finance1 .vsearch .el-form--inline .el-form-item {
  margin-right: 0;
}
.finance1 .vsearch .form-width2 .el-form-item__content {
  width: 120px;
}
.finance1 .vsearch .form-width .el-form-item__content {
  width: 120px;
}
.finance1 .dataWidth {
  width: 120px;
}
</style>
