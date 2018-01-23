<template>
  <el-dialog title="充值申请" :visible.sync="dialogFormVisible" size="small">
    <el-form :model='ruleForm' class="demo-ruleForm recharge-dialog" label-width="100px">
      <el-form-item label="充值金额" required>
        <el-button class="btn btn-amount" :class="{'el-icon-check': rAmount == 5000}" @click="rAmount = 5000">5000</el-button>
        <el-button class="btn btn-amount" :class="{'el-icon-check': rAmount == 10000}" @click="rAmount = 10000">10000</el-button>
        <el-button class="btn btn-amount" :class="{'el-icon-check': rAmount != 5000 && rAmount != 10000}" @click="rAmount = 0">更多</el-button>
        <input class="input-style" v-show="rAmount!= 5000 && rAmount!=10000" v-model="rAmount" type="text" @change="rAmount = Math.round(rAmount*100)/100 || ''">
      </el-form-item>
      <el-form-item label="付款明细" required>
        <el-table :data="rlist" border style="width: 100%" :summary-method="getSummaries" show-summary v-table-sum>
          <el-table-column prop="AccountOfPayment" label="付款账户" min-width="200"></el-table-column>
          <el-table-column prop="PayTime" label="付款时间" min-width="120">
            <template scope="scope">
              <el-date-picker v-model="scope.PayTime" type="date" :clearable="clearable"></el-date-picker>
            </template>
          </el-table-column>
          <el-table-column prop="Amount" label="付款金额(元)" min-width="120" align="right">
            <template scope="scope">
              <el-input v-model="scope.Amount" placeholder="请输入内容"></el-input>
            </template>
          </el-table-column>
          <el-table-column label="操作" min-width="120" align="right">
            <template scope="scope">
              <i class="el-icon-close" v-if="scope.$index > 0 && rlist.length > 1" @click.native.prevent="deleteRow(scope.$index, rlist)"></i>
              <i class="el-icon-plus" v-if="scope.$index+1 == rlist.length" @click="rlist.push({})"></i>
            </template>
          </el-table-column>
        </el-table>
      </el-form-item>
    </el-form>
    <div slot="footer" class="dialog-footer">
      <el-button @click="dialogFormVisible = false">取 消</el-button>
      <el-button type="primary" @click="submitForm('ruleForm')">确 定</el-button>
    </div>
  </el-dialog>
</template>

<script>
import {
  addprepai,
  putprepai
} from '@/api/api'
export default {
  props: ['row'],
  data() {
    return {
      dialogFormVisible: true,
      clearable: false,
      rAmount: 5000,
      rlist: [{}],
      ruleForm: {
        Amount: '',
        PhotoPath: '',
        PrepayDetails: [],
        Remark: '',
        Status: ''
      }
    }
  },
  methods: {
    getSummaries(param) {
      const sums = ['付款金额合计', '-', '-', this.ruleForm.Amount]
      return sums
    },
    submitForm(formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          console.log(this.ruleForm, 'ruleForm')
          // if (!this.ruleForm.Amount) {
          //   this.$message.error('请选择未开发票订单！')
          //   return
          // }
          if (this.row && this.row.Id) {
            putprepai(this.ruleForm).then(res => {
              if (res.status) {
                this.$message.info('修改成功!')
                this.$emit('done')
                this.dialogFormVisible = false
              }
            })
          } else {
            addprepai(this.ruleForm).then(res => {
              if (res.status) {
                this.$message.info('开票成功!')
                this.$emit('done')
                this.dialogFormVisible = false
              }
            })
          }
        } else {
          return false
        }
      })
    }
  }
}
</script>

<style lang='stylus' scoped>
.recharge-dialog
  .btn-amount
    border: 1px solid #ccc;
    background: #fff;
    padding: 6px 24px;
    border-radius: 4px;
    cursor: pointer;
    border-color: #1a9bfc;
    color: #1a9bfc;
    position: relative;
    font-size: 14px;
  .el-icon-check::before
    position: absolute;
    right: 2px;
    bottom: 2px;
  .input-style
    border: 1px solid #ccc;
    padding: 6px 24px;
    border-radius: 4px;
</style>
