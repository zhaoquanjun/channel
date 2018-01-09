<template >
<div>
  <el-dialog :title="title" :visible.sync="dialogFormVisible" size="tiny">
    <el-form :model="ruleForm" :rules="rules" class="demo-ruleForm" ref="ruleForm" label-width="100px">
      <el-form-item v-if="sign == 'FANDIAN'" :label="label" prop="num">
        <el-input type="number" v-model="ruleForm.num"></el-input>
      </el-form-item>
      <el-form-item v-else :label="label" prop="desc">
        <el-input type="textarea" v-model="ruleForm.desc"></el-input>
      </el-form-item>
    </el-form>
    <div slot="footer" class="dialog-footer">
      <el-button @click="dialogFormVisible = false">关 闭</el-button>
      <el-button type="primary" @click="submitForm('ruleForm')">保 存</el-button>
    </div>
  </el-dialog>
</div>
</template>

<script>
import {
  pass,
  backO,
  guaqiSearch,
  operateInvoice,
  confirmback,
  rechargeRefuse,
  rechargeListDetail
} from '../api/api'
import bus from '../bus'
export default {
  props: {
    row: {
      type: Object,
      default: null
    },
    sign: {
      type: String,
      default: null
    },
    Id: {
      type: String,
      default: null
    },
    title: {
      type: String,
      default: '驳回'
    },
    item: {
      type: Object,
      default: null
    },
    label: {
      type: String,
      default: '原因'
    }
  },
  data() {
    return {
      dialogFormVisible: true,
      ruleForm: {
        desc: '',
        num: ''
      },
      rules: {
        desc: [{
          required: true,
          message: '请填写原因',
          trigger: 'blur'
        }]
      },
      rechargeDetails: {}
    }
  },
  created() {
    if (this.sign === 'FANDIAN') {
      // console.log(this.row.RewardsMoney)
      this.ruleForm.num = this.row.RewardsMoney
    }
    if (this.sign === 'GUAQI') {
      this.ruleForm.desc = '退单'
    }
    if (this.sign === 'STOPGUAQI') {
      this.ruleForm.desc = '解挂'
    }
  },
  methods: {
    submitForm(formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          switch (this.sign) {
            case 'REFUSEAGENT':
              var item = {
                ChannelId: this.row.ChannelId,
                Desc: this.ruleForm.desc,
                status: 3
              }
              pass(this.row.ChannelId, item).then((res) => {
                if (res.status) {
                  this.$message({
                    type: 'success',
                    message: '代理商审核驳回成功'
                  })
                  // bus.$emit('refuse-agent-success')
                  this.$emit('done')
                  this.dialogFormVisible = false
                }
              }) // 代理商审核通过和驳回是一个接口 传递参数不同
              break
            case 'REVIEW':
              this.item.BackReason = this.ruleForm.desc
              backO(this.item).then((res) => {
                if (res.status) {
                  this.$message({
                    type: 'success',
                    message: '拒绝提单成功'
                  })
                  bus.$emit('refuse-review-success')
                  this.dialogFormVisible = false
                }
              }) // 订单审核
              break
            case 'GUAQI':
              this.item.Description = this.ruleForm.desc
              guaqiSearch(this.item).then((res) => {
                if (res.status) {
                  this.$message({
                    type: 'success',
                    message: '挂起成功!'
                  })
                  bus.$emit('gq-success')
                  this.dialogFormVisible = false
                }
              }) // 订单查询挂起
              break
            case 'STOPGUAQI':
              this.item.Description = this.ruleForm.desc
              guaqiSearch(this.item).then((res) => {
                if (res.status) {
                  this.$message({
                    type: 'success',
                    message: '解挂成功!'
                  })
                  bus.$emit('gq-stop')
                  this.dialogFormVisible = false
                }
              }) // 订单查询解除挂起
              break
            case 'INVOICE':
              var invoiceId = this.Id
              this.item.AuditMsg = this.ruleForm.desc
              operateInvoice(invoiceId, this.item).then((res) => {
                if (res.status) {
                  this.$message({
                    type: 'success',
                    message: '驳回成功!'
                  })
                  bus.$emit('rejec-success')
                  this.dialogFormVisible = false
                }
              })
              break
            case 'FANDIAN':
              this.row.RewardsMoney = this.ruleForm.num
              confirmback(this.row).then((res) => {
                if (res.status) {
                  this.$message({
                    type: 'success',
                    message: '返点成功!'
                  })
                  this.$emit('done')
                  // bus.$emit('fd-success')
                  this.dialogFormVisible = false
                }
              })
              break
            case 'RECHARGE':
              var id = this.row.Id
              rechargeListDetail(id).then((res) => {
                this.rechargeDetails = res.data
                this.rechargeDetails.AuditOpinion = this.ruleForm.desc
                this.rechargeDetails.Status = 3
                console.log(this.rechargeDetails)
                rechargeRefuse(this.rechargeDetails).then((res) => {
                  if (res.status) {
                    this.$emit('done')
                    this.dialogFormVisible = false
                  }
                })
              })
              break
          }
        } else {
          return false
        }
      })
    }
  }
}
</script>

<style scoped>
</style>
