<template>
  <el-dialog title="发票申请" :visible.sync="dialogFormVisible" size="small">
    <el-form :model="ruleForm" :rules="rules" ref="ruleForm" label-width="132px" class="demo-ruleForm invoice-apply-dialog">
      <div class="title">
        <span class="lable-title">申请类型：</span>
        <span>非预借发票</span>
      </div>
      <div class="title">
        <span class="lable-title">发票项目：</span>
        <span>服务费</span>
      </div>
      <el-form-item class="dialog-inputW" label="发票抬头：" prop="Title">
        <el-input v-model="ruleForm.Title"></el-input>
      </el-form-item>
      <el-form-item label="发票性质：" required>
        <el-radio-group v-model="ruleForm.Property">
          <el-radio label="1">企业</el-radio>
          <el-radio label="2">个人</el-radio>
        </el-radio-group>
      </el-form-item>
      <el-form-item label="发票类型：" required>
        <el-radio-group v-model="ruleForm.Category">
          <el-radio label="1">专票</el-radio>
          <el-radio label="2">普票</el-radio>
        </el-radio-group>
      </el-form-item>
      <el-form-item v-if="ruleForm.Category === '1'" class="dialog-inputW" label="开户银行：" prop="DepositBank">
        <el-input v-model="ruleForm.DepositBank"></el-input>
      </el-form-item>
      <el-form-item v-if="ruleForm.Category === '1'" class="dialog-inputW" label="对公账户：" prop="BankNo">
        <el-input v-model="ruleForm.BankNo"></el-input>
      </el-form-item>
      <el-form-item label="税号：" class="dialog-inputW" prop="InvoiceNumber">
        <el-input v-model="ruleForm.InvoiceNumber"></el-input>
      </el-form-item>
      <el-form-item label="发票金额：" class="dialog-inputW" required>
        <el-input v-model="ruleForm.Amount" readonly></el-input>
      </el-form-item>
      <div class="choose-order" @click="chooseOrder">
        选择订单
      </div>
      <el-form-item label="收件地址：" required prop="AddressId">
        <el-select v-model="ruleForm.AddressId" class="dialog-selectW">
          <el-option v-for="item in Address" :key="item.Id" :label="item.Address" :value="item.Id"></el-option>
        </el-select>
      </el-form-item>
      <div class="add-address" @click="newAddress">+</div>
    </el-form>
    <div slot="footer" class="dialog-footer">
      <el-button @click="dialogFormVisible = false">取 消</el-button>
      <el-button type="primary" @click="submitForm('ruleForm')">确 定</el-button>
    </div>
  </el-dialog>
</template>

<script>
import {
  address,
  addinvoice,
  viewInvoice,
  putinvoice
} from '@/api/api'
import Dialog from '@/service/dialog.js'
import InvoiceSelectOrder from '@/views/components/invoiceSelectOrder'
import NewAddress from '@/components/newAddress'
export default {
  props: ['invoiceorderParams'],
  data() {
    return {
      dialogFormVisible: true,
      ruleForm: {
        Property: '1',
        Category: '1',
        AddressId: '',
        OrderIds: ''
      },
      Address: [],
      rules: {
        Title: [{
          required: true,
          message: '请填写发票抬头',
          trigger: 'blur'
        }],
        DepositBank: [{
          required: true,
          message: '请填写开户银行',
          trigger: 'blur'
        }],
        BankNo: [{
          required: true,
          message: '请填写对公账号',
          trigger: 'blur'
        }],
        InvoiceNumber: [{
          required: true,
          message: '请填写税号',
          trigger: 'blur'
        }]
      }
    }
  },
  created() {
    this.getAddress()
    console.log(this.invoiceorderParams, 'this.invoiceorderParams')
    if (this.invoiceorderParams.invoiceId) {
      this.getinvoicesdetails()
    }
  },
  methods: {
    getAddress() {
      address().then(res => {
        if (res.status) {
          this.Address = res.data
          if (!this.invoiceorderParams.invoiceId) {
            this.ruleForm.AddressId = res.data[0].Id
          }
        }
      })
    },
    getinvoicesdetails() {
      let invoiceId = this.invoiceorderParams.invoiceId
      viewInvoice(invoiceId).then(res => {
        this.ruleForm = res.data
        this.ruleForm.Property = res.data.Property + ''
        this.ruleForm.Category = res.data.Category + ''
      })
    },
    chooseOrder() {
      Dialog(InvoiceSelectOrder, {
        invoiceorderParams: this.invoiceorderParams
      }).then(res => {
        console.log(res, 'selected res')
        console.log(this, 'this')
        this.ruleForm.Amount = res.amount
        this.ruleForm.OrderIds = res.orderIds
        this.ruleForm = $.extend(true, {}, this.ruleForm)
      })
    },
    newAddress() {
      Dialog(NewAddress).then(() => {
        this.getAddress()
      })
    },
    submitForm(formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          console.log(this.ruleForm, 'ruleForm')
          if (!this.ruleForm.Amount) {
            this.$message.error('请选择未开发票订单！')
            return
          }
          if (this.invoiceorderParams.invoiceId) {
            putinvoice(this.ruleForm).then(res => {
              if (res.status) {
                this.$message.info('修改成功!')
                this.$emit('done')
                this.dialogFormVisible = false
              }
            })
          } else {
            addinvoice(this.ruleForm).then(res => {
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
.invoice-apply-dialog
  .title
    height: 35px;
    line-height: 30px;
    font-size: 14px;
    .lable-title
      width: 120px;
      display: inline-block;
      text-align: right;
      vertical-align: middle;
      margin-right: 6px;
  .dialog-inputW
    width: 80%;
  .dialog-selectW
    width: 74%;
  .choose-order
    position: absolute;
    bottom: 146px;
    right: 70px;
    color: #1b9bfc;
    cursor: pointer;
  .add-address
    position: absolute;
    bottom: 87px;
    right: 90px;
    border: 1px solid #8391a5;
    border-radius: 4px;
    width: 34px;
    height: 34px;
    line-height: 34px;
    text-align: center;
    cursor: pointer;
</style>
