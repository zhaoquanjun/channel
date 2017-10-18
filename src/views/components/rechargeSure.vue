<template>
<div>
  <el-dialog title="确认充值" :visible.sync="dialogFormVisible" size="tiny">
    <div class="content">
      <div class="con">
        <span v-text="rowMsg.ChannelName1"></span>
        <span v-if="rowMsg.ChannelName2"> > {{rowMsg.ChannelName2}}</span>
      </div>
      <div class="con bottom">余额：{{rowMsg.Balance}}</div>
      <el-form :model="ruleForm" ref="ruleForm" :rules="rules" class="demo-ruleForm" label-width="100px">
        <el-form-item label="充值金额" required>
          <el-input v-model="ruleForm.Amount" auto-complete="off" class="moneyWid" :disabled="true"></el-input>
        </el-form-item>
        <el-form-item label="收款编号" prop="collectionnumber">
          <el-input v-model="ruleForm.collectionnumber" auto-complete="off" class="moneyWid" :maxlength="50"></el-input>
        </el-form-item>
        <el-form-item label="审核意见" required>
          <el-input v-model="ruleForm.AuditOpinion" auto-complete="off" class="moneyWid"></el-input>
        </el-form-item>
      </el-form>
    </div>
    <div slot="footer" class="dialog-footer">
      <el-button @click="dialogFormVisible = false">关 闭</el-button>
      <el-button type="primary" @click="submitForm('ruleForm')">确 认</el-button>
    </div>
  </el-dialog>
</div>
</template>

<script>
import {
  rechargePass,
  rechargeListDetail
} from '../../api/api'
export default {
  props: {
    row: {
      type: Object,
      default: null
    }
  },
  data() {
    return {
      dialogFormVisible: true,
      ruleForm: {},
      rowMsg: {},
      rules: {
        collectionnumber: [{
          required: true,
          message: '请输入收款编号',
          trigger: 'blur'
        }, {
          min: 1,
          max: 50,
          message: '长度在 1 到 50 个字符',
          trigger: 'blur'
        }]
      }
    }
  },
  created() {
    this.rowMsg = this.row
    this.getDataList()
  },
  methods: {
    getDataList() {
      var id = this.row.Id
      rechargeListDetail(id).then((res) => {
        this.ruleForm = res.data
        this.ruleForm.AuditOpinion = '同意'
      })
    },
    submitForm(formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          if (!this.ruleForm.AuditOpinion) {
            this.$message({
              message: '请填写审核意见',
              type: 'warning'
            })
          } else {
            this.ruleForm.Status = 2
            console.log(this.ruleForm)
            rechargePass(this.ruleForm).then(res => {
              if (res.status) {
                this.$message({
                  type: 'success',
                  message: '充值成功!'
                })
                this.$emit('done')
                this.dialogFormVisible = false
              }
            })
            // this.dialogFormVisible = false
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
.con {
  padding-left: 28px;
  height: 40px;
  line-height: 30px;
}

.bottom {
  padding-bottom: 50px;
}

.moneyWid {
  width: 200px;
}
</style>
