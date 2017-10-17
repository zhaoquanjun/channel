<template>
<el-dialog title="充值金额" :visible.sync="dialogFormVisible" size="tiny">
  <div class="content">
    <div class="con">
      <span v-text="data.ChannelName1"ss></span>
      <span v-if="data.ChannelName2"> > {{data.ChannelName2}}</span>
    </div>
    <div class="con bottom">余额：{{data.Balance}}</div>
    <el-form :model="ruleForm" :rules="rules" class="demo-ruleForm" ref="ruleForm" label-width="100px">
      <el-form-item label="充值类型" prop="Type">
        <el-select v-model="ruleForm.type" placeholder="请选择">
          <el-option v-for="type in chargeType" :key="type.id" :label="type.name" :value="type.id">
          </el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="充值金额" prop="Amount">
        <el-input v-model="ruleForm.Amount" auto-complete="off" class="moneyWid"></el-input>
      </el-form-item>
      <el-form-item label="上传附件" required>
        <div class="file-upload-area">
          <div v-for="(img, index) in ruleForm.imgs" :class="index == ruleForm.imgs.length - 1 ? 'file-upload-area-button' : 'file-upload-area-img-item'">
            <img-upl type="5" v-model='ruleForm.imgs[index]' :sign-key="signkey" :isClose="true" :sign-list="index == ruleForm.imgs.length - 1" @input="ruleForm.imgs.push({})" @delete="ruleForm.imgs.splice(index,1)"></img-upl>
          </div>
        </div>
        <!-- <img-upl type="5" v-model='ruleForm.imgs' :sign-key="signkey" :sign-list="true"></img-upl> -->
      </el-form-item>
      <el-form-item label="备注">
        <el-input type="textarea" v-model="ruleForm.desc"></el-input>
      </el-form-item>
    </el-form>
  </div>
  <div slot="footer" class="dialog-footer">
    <el-button @click="dialogFormVisible = false">关 闭</el-button>
    <el-button type="primary" @click="submitForm('ruleForm')">充 值</el-button>
  </div>
</el-dialog>
</template>

<script>
import {
  finance,
  urlsignkey
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
        Amount: '',
        type: '',
        desc: '',
        imgs: [{}]
      },
      rules: {
        Amount: [{
          required: true,
          message: '请输入充值金额',
          trigger: 'blur'
        }],
        Type: [{
          required: true,
          message: '请选择充值类型',
          trigger: 'blur'
        }]
      },
      data: {
        ChannelName1: '',
        ChannelName2: '',
        Balance: ''
      },
      chargeType: [{
        id: 1,
        name: '广告费'
      }, {
        id: 2,
        name: '服务费'
      }, {
        id: 3,
        name: '卫生费'
      }]
    }
  },
  mounted() {
    this.data = this.row
    this.getsignkey()
  },
  methods: {
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
          let amount = this.ruleForm.Amount
          let channelname1 = this.data.ChannelName1
          let channelname2 = this.data.ChannelName2
          if (channelname2) {
            channelname1 = `${channelname1} > ${channelname2}`
          }
          var str = `您确认为 ${channelname1} 充值 ${amount}元？`
          let ChannelId = this.row.ChannelId
          this.ruleForm.ChannelId = ChannelId
          this.$confirm(str, '充值提示', {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            type: 'warning'
          }).then(() => {
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

<style scoped>
.con {
  padding-left: 28px;
  height: 30px;
  line-height: 30px;
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
  padding: 10px;
}

.file-upload-area-button {
  clear: both;
}
</style>
