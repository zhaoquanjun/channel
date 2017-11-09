<template>
  <el-dialog title="确认退单" :visible.sync="dialogFormVisible" size="small">
    <div class="reback-order reback-order-one">
      <div class="title">
        <span class="lable-title">订单编号：</span>
        <span>{{ruleForm.OrderId}}</span>
      </div>
      <div class="title">
        <span class="lable-title">公司名称：</span>
        <span>{{ruleForm.CustomerName}}</span>
      </div>
    </div>
    <div class="title-border clearfix">
      <span>支付信息</span>
      <i></i>
    </div>
    <div class="reback-order reback-order-two">
      <div class="title">
        <span class="lable-title">订单总金额：</span>
        <span>{{'￥' + ruleForm.TotalAmount}}</span>
      </div>
      <div class="title">
        <span class="lable-title">实付金额：</span>
        <span style="color:red">{{'￥' + ruleForm.PayAmount}}</span>
      </div>
    </div>
    <div class="title-border clearfix">
      <span>退款信息</span>
      <i></i>
    </div>
    <el-form :model="ruleForm" ref="ruleForm" label-width="132px" class="demo-ruleForm reback-form">
      <el-form-item label="退款详情：" required>
        <div class="serve-month">
          已服务<input class="input-serveMonth" type="number" v-model="ruleForm.ServedMonths" :readonly="isView">个月，可退款
          <input class="input-serveMonth" type="number" v-model="ruleForm.BackMonths" :readonly="isView">个月
        </div>
      </el-form-item>
      <el-form-item label="剩余服务费：" required>
        <el-input v-model="ruleForm.SurplusAmount" @blur="getBackAmount" :readonly="isView"></el-input>
      </el-form-item>
      <el-form-item label="扣除返点：" required>
        <el-input v-model="ruleForm.RebateAmount"  @blur="getBackAmount" :readonly="isView"></el-input>
      </el-form-item>
      <el-form-item v-if="showCommissionAmount" label="一代提成：" required>
        <el-input v-model="ruleForm.CommissionAmount" :readonly="isView" @blur="getBackAmount"></el-input>
      </el-form-item>
      <el-form-item v-if="showCommissionAmount" label="退款金额：">
        <el-input v-model="ruleForm.BackAmount" readonly></el-input>
        <span v-if="!isView" style="color: red">（剩余服务费-扣除返点+一代提成=退款金额）</span>
      </el-form-item>
      <el-form-item v-if="!showCommissionAmount" label="退款金额：">
        <el-input v-model="ruleForm.BackAmount" readonly></el-input>
        <span v-if="!isView" style="color: red">（剩余服务费-扣除返点=退款金额）</span>
      </el-form-item>
      <el-form-item label="退款原因：" required>
        <el-select v-model="ruleForm.BackReason" class="reason-select" :disabled="isView">
          <el-option v-for="reason in backReason" :key="reason.name" :label="reason.name" :value="reason.name"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="备注：">
        <el-input type="textarea" size="small" v-model="ruleForm.Remark" :readonly="isView"></el-input>
      </el-form-item>
    </el-form>
    <div v-if="isView" slot="footer" class="dialog-footer">
      <el-button type="primary" @click="dialogFormVisible = false">关 闭</el-button>
    </div>
    <div v-else slot="footer" class="dialog-footer">
      <el-button @click="dialogFormVisible = false">取 消</el-button>
      <el-button type="primary" @click="submitForm('ruleForm')">确认退单</el-button>
    </div>
  </el-dialog>
</template>

<script>
import { chargebackorderList, chargebackorder } from '@/api/api.js'
export default {
  props: ['isView', 'orderid', 'showCommissionAmount'],
  data() {
    return {
      dialogFormVisible: true,
      params: {},
      ruleForm: {
        BackAmount: ''
      },
      backReason: [
        {name: '信息填写错误，退单重提'},
        {name: '账目问题，无法做账'},
        {name: '重复提单'},
        {name: '客户找了其他代账公司或专职财务'},
        {name: '客户公司注销'},
        {name: '客户不打算再继续合作'},
        {name: '其他原因'}
      ]
    }
  },
  created() {
    this.params.orderid = this.orderid
    // 退单0 查看1
    if (!this.isView) {
      this.params.ischeck = 0
    } else {
      this.params.ischeck = 1
    }
    this.getchargebackorder()
  },
  methods: {
    getchargebackorder() {
      chargebackorderList(this.params).then((res) => {
        this.ruleForm = res.data
        // if (!this.isView) {
        //   this.ruleForm.BackReason = '信息填写错误，退单重提'
        // }
      })
    },
    getBackAmount() {
      if (this.showCommissionAmount) {
        // console.log(this.ruleForm.CommissionAmount, 'this.ruleForm.CommissionAmount')
        this.ruleForm.BackAmount = (parseFloat(this.ruleForm.SurplusAmount) || 0) - (parseFloat(this.ruleForm.RebateAmount) || 0) + (parseFloat(this.ruleForm.CommissionAmount) || 0)
      } else {
        this.ruleForm.BackAmount = this.ruleForm.SurplusAmount - this.ruleForm.RebateAmount || 0
      }
    },
    submitForm(formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          if (!this.ruleForm.ServedMonths) {
            this.$message({
              message: '请填写服务月份',
              type: 'warning'
            })
            return
          }
          if (!this.ruleForm.BackMonths) {
            this.$message({
              message: '请填写可退款月份',
              type: 'warning'
            })
            return
          }
          if (!this.ruleForm.SurplusAmount) {
            this.$message({
              message: '请填写剩余服务费',
              type: 'warning'
            })
            return
          }
          if (!this.ruleForm.RebateAmount) {
            this.$message({
              message: '请填写返点金额',
              type: 'warning'
            })
            return
          }
          if (!this.ruleForm.CommissionAmount && this.showCommissionAmount) {
            this.$message({
              message: '请填写一代提成金额',
              type: 'warning'
            })
            return
          }
          if (!this.ruleForm.BackReason) {
            this.$message({
              message: '选择退款原因',
              type: 'warning'
            })
            return
          }
          for (let i in this.backReason) {
            if (this.backReason[i].id === this.ruleForm.BackReason) {
              this.ruleForm.BackReason = this.backReason[i].name
            }
          }
          if (!this.ruleForm.BackAmount) {
            this.ruleForm.BackAmount = 0
          }
          console.log(this.ruleForm)
          chargebackorder(this.ruleForm).then(res => {
            if (res.status) {
              this.$message({
                type: 'success',
                message: '退单成功!'
              })
              this.$emit('done')
              this.dialogFormVisible = false
            }
          })
        } else {
          return false
        }
      })
    }
  }
}
</script>

<style>
.el-dialog__footer {
  padding: 5px 20px 20px;
}
.el-dialog__body {
  padding: 15px 20px 10px;
}
.reback-order .title {
  height: 30px;
  line-height: 30px;
  font-size: 14px;
}
.el-form-item {
  margin-bottom: 15px;
}
.reback-order .title .lable-title {
  color: #a3a3a3;
  width: 120px;
  display: inline-block;
  text-align: right;
  vertical-align: middle;
  margin-right: 6px;
}
.title-border {
  padding: 10px 0 10px 20px;
}
.title-border span {
  float: left;
}
.title-border i {
  height: 1px;
  border-bottom: 1px solid #ccc;
  float: left;
  width: 80%;
  padding-top: 7px;
  margin-left: 10px;
}
.serve-month .input-serveMonth {
  width: 50px;
  border-radius: 4px;
  color: #1f2d3d;
  padding: 3px 10px;
  margin: 0 3px;
  height: 36px;
  font-size: 14px;
  border: 1px solid #8391a5;
  background-color: #fff;
  -moz-appearance: textfield;
}
.serve-month .readonly-class {
  background-color: #eef1f6;
  border-color: #d1dbe5;
  color: #bbb;
  cursor: not-allowed;
}
input::-webkit-outer-spin-button,
input::-webkit-inner-spin-button {
   -webkit-appearance: none !important;
   margin: 0;
}
.reback-form .el-form-item__label {
  color: #a3a3a3;
}
.reback-form .el-input {
  width: 100px;
}
.reback-form .reason-select .el-input.is-disabled .el-input__inner{
  background-color: #fff;
  border-color: #8391a5;
  color: #1f2d3d;
}
.reback-form .reason-select .el-input {
  width: 260px;
}
.reback-form .el-textarea__inner {
 width: 80%;
}
</style>
