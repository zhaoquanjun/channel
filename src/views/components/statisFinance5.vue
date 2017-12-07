<template>
<div class="finance5">
  <h2 class="text-center">发票明细清单</h2>
  <div class="vsearch">
    <el-form ref="params" :inline="true" :model="params">
      <el-form-item label="订单日期">
        <el-date-picker class="inputWid" v-model="params.startorder" type="date" :clearable="clearable">
        </el-date-picker>
        <span>-</span>
        <el-date-picker class="inputWid" v-model="params.endorder" type="date" :clearable="clearable">
        </el-date-picker>
      </el-form-item>
      <el-form-item class="form-width" label="订单编号">
        <el-input v-model="params.orderid"></el-input>
      </el-form-item>
      <el-form-item class="form-width" label="代理商">
        <el-autocomplete class="inline-input" v-model="params.channelname" :trigger-on-focus="false" :fetch-suggestions="querySearch"></el-autocomplete>
      </el-form-item>
      <el-form-item class="form-width1" label="代理商状态">
        <el-select v-model="params.status">
          <el-option v-for="item in Status" :key="item.status" :label="item.statusName" :value="item.status">
          </el-option>
        </el-select>
      </el-form-item>
      <el-form-item class="form-width1" label="是否申请发票">
        <el-select v-model="params.type">
          <el-option v-for="item in invoiceStatus" :key="item.type" :label="item.name" :value="item.type"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item class="form-width2" label="发票审核状态">
        <el-select v-model="params.auditstatus">
          <el-option v-for="item in auditStatus" :key="item.type" :label="item.name" :value="item.type"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item class="form-width" label="发票申请编号">
        <el-input v-model="params.invoicesId"></el-input>
      </el-form-item>
      <el-form-item label="发票申请日期">
        <el-date-picker class="inputWid" v-model="params.startapply" type="date" :clearable="clearable">
        </el-date-picker>
        <span>-</span>
        <el-date-picker class="inputWid" v-model="params.endapply" type="date" :clearable="clearable">
        </el-date-picker>
      </el-form-item>
      <el-form-item label="发票审核日期">
        <el-date-picker class="inputWid" v-model="params.startaudit" type="date" :clearable="clearable">
        </el-date-picker>
        <span>-</span>
        <el-date-picker class="inputWid" v-model="params.endaudit" type="date" :clearable="clearable">
        </el-date-picker>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="onSearch">查询</el-button>
        <el-button type="primary" @click="onDownload" :disabled="!tableData.length">导出</el-button>
      </el-form-item>
    </el-form>
  </div>
  <el-table :data="tableData" border style="width: 100%">
    <el-table-column prop="ChannelName1" label="一级代理" min-width="200">
    </el-table-column>
    <el-table-column prop="ChannelName2" label="二级代理" min-width="200">
    </el-table-column>
    <el-table-column prop="Stext" label="代理商状态">
    </el-table-column>
    <el-table-column prop="CreateDate" label="订单日期" :formatter="StatusDate" width="120">
    </el-table-column>
    <el-table-column prop="OrderId" label="订单编号" width="210">
    </el-table-column>
    <el-table-column prop="Name" label="公司名称" width="200">
    </el-table-column>
    <el-table-column prop="AddedValueText" label="公司性质" width="110">
    </el-table-column>
    <el-table-column prop="BLAmount" label="订单总金额" width="110">
    </el-table-column>
    <el-table-column prop="SSAmount" label="折扣金额" width="100">
    </el-table-column>
    <el-table-column prop="SSAmount" label="实收金额" width="100">
    </el-table-column>
    <el-table-column prop="KKAmount" label="可开金额" width="100">
    </el-table-column>
    <el-table-column prop="IsInvoice" label="是否申请发票" width="130">
    </el-table-column>
    <el-table-column prop="AuditStatus" label="发票审核状态" width="130">
    </el-table-column>
    <el-table-column prop="ApplyDate" label="发票申请日期" :formatter="StatusDate" width="130">
    </el-table-column>
    <el-table-column prop="AuditDate" label="发票审核日期" :formatter="StatusDate" width="130">
    </el-table-column>
    <el-table-column prop="InvoiceId" label="发票申请编号" width="200">
    </el-table-column>
    <el-table-column prop="Amount" label="发票金额" width="120">
    </el-table-column>
  </el-table>
  <el-pagination @size-change="handleSizeChange" @current-change="handleCurrentChange" :current-page="pagination.currentPage" :page-sizes="[10, 20, 30]" :page-size="pagination.pageSize" layout="total, sizes, prev, pager, next, jumper" :total="pagination.total"
    style="text-align:center; margin:20px;">
  </el-pagination>
</div>
</template>

<script>
import { getinvoicesdetails } from '@/api/api'
export default {
  props: ['agents'],
  data: function() {
    return {
      Status: [
        {status: '', statusName: '全部'},
        {status: 1, statusName: '正常'},
        {status: 0, statusName: '解约'}
      ],
      pagination: {
        total: 0,
        pageSize: 10,
        currentPage: 1
      },
      tableData: [],
      params: {
        startorder: '',
        endorder: '',
        startapply: '',
        endapply: '',
        startaudit: '',
        endaudit: '',
        channelname: '',
        invoicesId: '',
        type: 0,
        status: '',
        orderid: '',
        auditstatus: 0
      },
      invoiceStatus: [{
        name: '全部',
        type: 0
      }, {
        name: '是',
        type: 1
      }, {
        name: '否',
        type: 2
      }],
      auditStatus: [{
        name: '全部',
        type: 0
      }, {
        name: '未审核',
        type: 1
      }, {
        name: '通过',
        type: 2
      }, {
        name: '拒审',
        type: 3
      }],
      clearable: false
    }
  },
  created() {

  },
  methods: {
    // StatusFormat: function(row) {
    //   var status = row.Status
    //   switch (status) {
    //     case 0:
    //       status = '全部'
    //       break
    //     case 1:
    //       status = '是'
    //       break
    //     case 2:
    //       status = '否'
    //       break
    //   }
    //   return status
    // },
    onSearch(params) {
      let limit = this.pagination.pageSize
      let offset = (this.pagination.currentPage - 1) * limit
      let type = this.params.type
      let channelname = this.params.channelname
      let invoicesId = this.params.invoicesId
      let startorder = this.params.startorder
      let endorder = this.params.endorder
      let startapply = this.params.startapply
      let endapply = this.params.endapply
      let startaudit = this.params.startaudit
      let endaudit = this.params.endaudit
      let status = this.params.status
      let orderid = this.params.orderid
      let auditstatus = this.params.auditstatus
      getinvoicesdetails({
        limit: limit,
        offset: offset,
        channelname: channelname,
        type: type,
        invoicesId: invoicesId,
        startorder: startorder,
        endorder: endorder,
        startapply: startapply,
        endapply: endapply,
        startaudit: startaudit,
        endaudit: endaudit,
        status: status,
        orderid: orderid,
        auditstatus: auditstatus
      }).then((res) => {
        // console.log(res.data)
        this.tableData = res.data
        this.pagination.total = res.Count
      })
    },
    onDownload(params) {
      const {
        startorder,
        endorder,
        startapply,
        endapply,
        startaudit,
        endaudit,
        channelname,
        type,
        invoicesId,
        status,
        orderid,
        auditstatus
      } = this.params
      // if (this.pagination.total > 1000) {
      //   this.$message({
      //     type: 'warning',
      //     message: '总条数过多，请缩小查询范围'
      //   })
      // } else {
      const url = `/api/download/getinvoicesdetails?startorder=${startorder || ''}&endorder=${endorder || ''}&startapply=${startapply || ''}&endapply=${endapply || ''}&startaudit=${startaudit || ''}&endaudit=${endaudit || ''}&channelname=${channelname || ''}&type=${type || 0}&invoicesId=${invoicesId || ''}&status=${status}&auditstatus=${auditstatus}&orderid=${orderid}`
      // console.log(url)
      window.open(url)
      // }
    },
    StatusDate(row, column) {
      var date = row[column.property]
      // console.log(date)
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
.finance5 .vsearch .inputWid {
  width: 120px;
}
.finance5 .vsearch .form-width .el-form-item__content {
  width: 130px;
}
.finance5 .vsearch .form-width1 .el-form-item__content {
  width: 75px;
}
.finance5 .vsearch .form-width2 .el-form-item__content {
  width: 90px;
}
</style>
