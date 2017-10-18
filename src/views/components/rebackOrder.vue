<template>
  <el-dialog title="确认退单" :visible.sync="dialogFormVisible" size="tiny">
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
    <el-form :model="ruleForm" ref="ruleForm" label-width="110px" class="demo-ruleForm reback-form">
      <el-form-item label="退款详情：" required>
        <div class="serve-month">
          已服务<input class="input-serveMonth" v-bind:class="isView ? 'readonly-class' : ''" type="number" v-model="ruleForm.ServedMonths" :disabled="isView">个月，可退款
          <input class="input-serveMonth" v-bind:class="isView ? 'readonly-class' : ''" type="number" v-model="ruleForm.BackMonths" :disabled="isView">个月
        </div>
      </el-form-item>
      <el-form-item label="剩余服务费：" required>
        <el-input v-model="ruleForm.SurplusAmount" @blur="getBackAmount" :disabled="isView"></el-input>
      </el-form-item>
      <el-form-item label="扣除返点：" required>
        <el-input v-model="ruleForm.RebateAmount"  @blur="getBackAmount" :disabled="isView"></el-input>
      </el-form-item>
      <el-form-item v-if="showCommissionAmount" label="一代提成：" required>
        <el-input v-model="ruleForm.CommissionAmount" :disabled="isView"></el-input>
      </el-form-item>
      <el-form-item label="退款金额：">
        <el-input v-model="ruleForm.BackAmount" :disabled="true"></el-input>
      </el-form-item>
      <el-form-item label="退款原因：">
        <el-select v-model="ruleForm.BackReason" class="reason-select" :disabled="isView">
          <el-option v-for="reason in backReason" :key="reason.name" :label="reason.name" :value="reason.name"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="备注：">
        <el-input type="textarea" v-model="ruleForm.Remark" :disabled="isView"></el-input>
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
      ruleForm: {},
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
        if (!this.isView) {
          this.ruleForm.BackReason = '信息填写错误，退单重提'
        }
      })
    },
    getBackAmount() {
      this.ruleForm.BackAmount = (this.ruleForm.SurplusAmount || 0) - (this.ruleForm.RebateAmount || 0)
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
          for (let i in this.backReason) {
            if (this.backReason[i].id === this.ruleForm.BackReason) {
              this.ruleForm.BackReason = this.backReason[i].name
            }
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
.reback-order .title {
  height: 30px;
  line-height: 30px;
  font-size: 14px;
}
.reback-order .title .lable-title {
  color: #ccc;
  width: 100px;
  display: inline-block;
  text-align: right;
  vertical-align: middle;
}
.title-border {
  padding: 10px 0 10px 10px;
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
  border: 1px solid #8391a5;
  background-color: #fff;
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
  color: #ccc;
}
.reback-form .el-input {
  width: 100px;
}
.reback-form .reason-select .el-input {
  width: 260px;
}
</style>
