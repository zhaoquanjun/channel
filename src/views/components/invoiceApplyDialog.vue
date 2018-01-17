<template>
  <el-dialog title="发票申请" :visible.sync="dialogFormVisible" size="tiny">
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
      <el-form-item label="发票金额：" class="dialog-inputW" prop="Amount">
        <el-input v-model="ruleForm.Amount" readonly></el-input>
      </el-form-item>
      <el-form-item label="收件地址：" required prop="AddressId">
        <el-select v-model="ruleForm.AddressId" class="dialog-selectW">
          <el-option v-for="item in Address" :key="item.Id" :label="item.Address" :value="item.Id"></el-option>
        </el-select>
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
  address
} from '@/api/api'
export default {
  data() {
    return {
      dialogFormVisible: true,
      ruleForm: {
        Property: '1',
        Category: '1',
        AddressId: ''
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
        }],
        Amount: [{
          required: true,
          message: '请填写发票金额',
          trigger: 'blur'
        }],
        AddressId: [{
          required: true,
          message: '请填写收件地址',
          trigger: 'blur'
        }]
      }
    }
  },
  created() {
    this.getAddress()
  },
  methods: {
    getAddress() {
      address().then(res => {
        if (res.status) {
          this.Address = res.data
          this.ruleForm.AddressId = res.data[0].Id
        }
      })
    },
    submitForm(formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {

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
</style>
