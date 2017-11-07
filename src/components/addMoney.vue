<template>
<el-dialog title="充值" :visible.sync="dialogFormVisible" size="small">
  <div class="content">
    <div class="con">
      <span v-text="data.ChannelName1"ss></span>
      <span v-if="data.ChannelName2"> > {{data.ChannelName2}}</span>
    </div>
    <div class="con bottom">余额：{{data.Balance}}</div>
    <el-form :model="ruleForm" :rules="rules" class="demo-ruleForm form" ref="ruleForm" label-width="100px">
      <el-form-item label="充值类型" required>
        <el-select v-model="ruleForm.rechargetypeid" placeholder="请选择" class="moneyWid">
          <el-option v-for="type in chargeType" :key="type.Id" :label="type.RechargeName" :value="type.Id">
          </el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="充值金额" prop="amount">
        <el-input v-model="ruleForm.amount" auto-complete="off" class="moneyWid" ref="add-money-amount"></el-input>
      </el-form-item>
      <el-form-item label="上传附件" required>
        <div class="file-upload-area">
          <div v-for="(img, index) in ruleForm.photopaths" :class="index == ruleForm.photopaths.length - 1 ? 'file-upload-area-button' : 'file-upload-area-img-item'">
            <img-upl type="5" v-model='ruleForm.photopaths[index]' :sign-key="signkey" :isClose="true" :sign-list="index == ruleForm.photopaths.length - 1" @input="ruleForm.photopaths.push({})" @delete="ruleForm.photopaths.splice(index,1)"></img-upl>
          </div>
        </div>
        <!-- <img-upl type="5" v-model='ruleForm.imgs' :sign-key="signkey" :sign-list="true"></img-upl> -->
      </el-form-item>
      <el-form-item label="备注" class="textarea-width">
        <el-input type="textarea" v-model="ruleForm.Remark"></el-input>
      </el-form-item>
    </el-form>
  </div>
  <div slot="footer" class="dialog-footer">
    <el-button @click="dialogFormVisible = false">取 消</el-button>
    <el-button type="primary" @click="submitForm('ruleForm')">确 定</el-button>
  </div>
</el-dialog>
</template>

<script>
import {
  finance,
  urlsignkey,
  allRechargeType
} from '../api/api'
import ImageUploader from '@/components/imageUploader.vue'
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
      signkey: {},
      ruleForm: {
        amount: '',
        rechargetypeid: '',
        Remark: '',
        photopaths: [{}]
      },
      rules: {
        amount: [{
          required: true,
          message: '请输入充值金额',
          trigger: 'blur'
        }]
      },
      data: {
        ChannelName1: '',
        ChannelName2: '',
        Balance: ''
      },
      chargeType: []
    }
  },
  mounted() {
    this.data = this.row
    this.getsignkey()
    this.getchargeTypelist()
  },
  watch: {
    ruleForm: {
      handler: function (val, oldVal) {
        if (/\.\d{2,}/.test(val.amount)) {
          setTimeout(() => {
            val.amount = (parseInt(val.amount * 100) / 100) + '' || ''
          }, 0)
        }
      },
      deep: true
    }
  },
  methods: {
    getchargeTypelist() {
      allRechargeType().then((res) => {
        console.log(res)
        this.chargeType = res.data
      })
    },
    getsignkey() {
      urlsignkey().then((res) => {
        delete res.data.Filename
        delete res.data.key
        delete res.data.callback
        delete res.data.expire
        delete res.data.Host
        this.signkey = res.data
      })
    },
    submitForm(formName) {
      console.log(this.ruleForm)
      this.$refs[formName].validate((valid) => {
        if (valid) {
          if (!this.ruleForm.rechargetypeid) {
            this.$message({
              message: '请选择充值类型',
              type: 'warning'
            })
            return
          }
          console.log(Number(this.ruleForm.amount))
          if (!Number(this.ruleForm.amount) || /。/.test(this.ruleForm.amount)) {
            this.$message({
              message: '充值金额只能是数字',
              type: 'warning'
            })
            return
          }
          if (this.ruleForm.photopaths.length === 1) {
            this.$message({
              message: '请上传附件',
              type: 'warning'
            })
            return
          }
          var amount = this.ruleForm.amount
          let channelname1 = this.data.ChannelName1
          let channelname2 = this.data.ChannelName2
          if (channelname2) {
            channelname1 = `${channelname1} > ${channelname2}`
          }
          var str = `您确认为 ${channelname1} 充值 ${amount}元？`
          this.ruleForm.channelid = this.row.ChannelId
          this.$confirm(str, '充值提示', {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            type: 'warning'
          }).then(() => {
            // const path = this.ruleForm.photopathss.join(',')
            this.ruleForm.photopaths.pop()
            console.log(this.ruleForm)
            finance(this.ruleForm).then(res => {
              if (res.status) {
                this.$message({
                  type: 'success',
                  message: '充值成功!'
                })
                this.$emit('done')
                this.dialogFormVisible = false
              }
            })
          })
        } else {
          return false
        }
      })
    }
  },
  components: {
    imgUpl: ImageUploader
  }
}
</script>

<style>
.con {
  padding-left: 32px;
  height: 35px;
  line-height: 30px;
}
.bottom {
 margin-bottom: 25px;
}
.moneyWid {
  width: 217px;
}

.file-upload-area {
  overflow: hidden;
}
.file-upload-area-img-item {
  float: left;
  width: 120px;
  height: 70px;
  padding: 10px 10px 10px 0;
}

.file-upload-area-button {
  clear: both;
}

.textarea-width .el-textarea__inner {
  width: 450px;
}
</style>
