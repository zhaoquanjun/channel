<template>
  <el-dialog title="选择未开发票订单" :visible.sync="dialogTableVisible" size="large">
    <div class="vsearch">
      <el-form ref="params" :inline="true" :model="params">
        <el-form-item label="订单时间">
          <el-date-picker v-model="params.starttime" type="date" :clearable="clearable" placeholder="开始日期">
          </el-date-picker>
          <span>-</span>
          <el-date-picker v-model="params.endtime" type="date" :clearable="clearable" placeholder="结束日期">
          </el-date-picker>
        </el-form-item>
        <el-form-item label="公司名称/法人">
          <el-input v-model="params.name"></el-input>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="onSearch">查询</el-button>
        </el-form-item>
      </el-form>
    </div>
    <el-table :data="tableData" tooltip-effect="dark" style="width: 100%" @selection-change="handleSelectionChange">
      <el-table-column type="selection"></el-table-column>
      <el-table-column label="公司名称" prop="Name" width="250"></el-table-column>
      <el-table-column label="法人" prop="LegalPerson"></el-table-column>
      <el-table-column label="合同号" prop="ContractNO"></el-table-column>
      <el-table-column label="提单金额" prop="ContractAmount"></el-table-column>
      <el-table-column label="可开金额" prop="BLAmount"></el-table-column>
      <el-table-column label="订单日期" prop="CreateDate" :formatter="StatusDate"></el-table-column>
    </el-table>
    <div slot="footer" class="dialog-footer">
      <el-button @click="dialogTableVisible = false">取 消</el-button>
      <el-button type="primary" @click="submitForm('ruleForm')">确 定</el-button>
    </div>
  </el-dialog>
</template>

<script>
import {
  getneworders
} from '@/api/api'
export default {
  props: ['invoiceorderParams'],
  data() {
    return {
      dialogTableVisible: true,
      params: {
        starttime: '',
        endtime: '',
        name: ''
      },
      clearable: false,
      tableData: [],
      selectedRows: []
    }
  },
  created() {
    this.onSearch()
    console.log(this.invoiceorderParams, 'invoiceorderParams orderselect')
  },
  methods: {
    onSearch() {
      this.params.invoiceId = this.invoiceorderParams.invoiceId
      getneworders(this.params).then(res => {
        console.log(res, 'res')
        if (res.status) {
          this.tableData = res.data
        }
      })
    },
    handleSelectionChange(val) {
      this.selectedRows = $.extend(true, [], val)
    },
    StatusDate(row) {
      var date = row.CreateDate
      return date.substring(0, 10)
    },
    submitForm() {
      console.log(this.selectedRows, 'this.selectedRows')
      const selectedRows = this.selectedRows
      if (selectedRows.length === 0) {
        this.$message.error('请选择未开发票订单！')
        return
      }
      let amount = window._.reduce(selectedRows, (r, t) => {
        r = r + t.BLAmount
        return r
      }, 0)
      if (amount > this.invoiceorderParams.balance) {
        this.$message.error('发票金额不允许超出' + this.invoiceorderParams.balance + '!')
        return
      }
      this.$emit('done', {
        amount: amount,
        orderIds: window._.map(selectedRows, (t) => {
          return "'" + t.OrderId + "'"
        }).join(',')
      })
      this.dialogTableVisible = false
    }
  }
}
</script>

<style lang='stylus' scoped>
</style>
