<template>
  <el-dialog title="充值申请" :visible.sync="dialogFormVisible" size="small">
    <el-form :model='ruleForm' ref="ruleForm" class="demo-ruleForm recharge-dialog" label-width="100px">
      <el-form-item v-if="!isReadOnly" label="充值金额：" required>
        <el-button class="btn btn-amount" :class="{'el-icon-check': rAmount == 5000}" @click="rAmount = 5000">5000</el-button>
        <el-button class="btn btn-amount" :class="{'el-icon-check': rAmount == 10000}" @click="rAmount = 10000">10000</el-button>
        <el-button class="btn btn-amount" :class="{'el-icon-check': rAmount != 5000 && rAmount != 10000}" @click="rAmount = 0">更多</el-button>
        <input class="input-style" v-show="rAmount!= 5000 && rAmount!=10000" v-model="rAmount" type="text" @change="rAmount = Math.round(rAmount*100)/100 || ''">
      </el-form-item>
      <el-form-item v-if="isReadOnly" label="充值金额：" required>
        <span>{{ruleForm.Amount}}元</span>
      </el-form-item>
      <el-form-item label="付款明细：" required>
        <table class="table">
          <thead>
            <tr>
              <th style="width: 35%">*付款账户</th>
              <th>*付款时间</th>
              <th>*付款金额（元）</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="rg in rlist">
              <td>
                <el-input type="text" class="item-input" v-model="rg.AccountOfPayment" placeholder="付款账户不要填写空格" :readonly="isReadOnly"></el-input>
              </td>
              <td>
                <el-date-picker class="item-date" v-model="rg.PayTime" type="date" :clearable="clearable" :readonly="isReadOnly"></el-date-picker>
              </td>
              <td>
                <el-input type="text" v-model="rg.Amount" @change="rg.Amount = Math.round(rg.Amount*100)/100 || ''" @blur="reduceList(rlist)" :readonly="isReadOnly"></el-input>
              </td>
              <td v-if="!isReadOnly" class="operate-td">
                <el-button v-if="rlist.length > 1" @click="deleteItem(rg)" type="text" size="small">删除</el-button>
              </td>
            </tr>
            <div v-if="!isReadOnly" class="item-add">
               <el-button @click="rlist.push({PayTime:''})" type="text" size="small">添加</el-button>
            </div>
            <tr>
              <td colspan="2" class="text-center" style="border-top: none;">付款金额合计</td>
              <td class="text-left" style="border-top: none; padding-left: 10px">{{Amount}}</td>
            </tr>
          </tbody>
        </table>
      </el-form-item>
      <el-form-item label="付款凭证：" required>
        <div v-if="isReadOnly" class="file-upload-area-img-item" v-for="item in imgs">
          <img-upl :key="item" :value='item' :readonly='true'></img-upl>
        </div>
        <div v-if="!isReadOnly" class="file-upload-area">
          <div v-for="(img, index) in imgs" :class="index == imgs.length - 1 ? 'file-upload-area-button' : 'file-upload-area-img-item'">
            <img-upl type="5" v-model='imgs[index]' :sign-key="signkey" :isClose="true" :sign-list="index == imgs.length - 1" @input="imgs.push({})" @delete="imgs.splice(index,1)"></img-upl>
          </div>
        </div>
      </el-form-item>
      <el-form-item label="备注：">
        <el-input type='textarea' v-model='ruleForm.Remark' :rows=3 :readonly="isReadOnly"></el-input>
      </el-form-item>
    </el-form>
    <div slot="footer" class="dialog-footer">
      <el-button v-if="!isReadOnly" @click="dialogFormVisible = false">取 消</el-button>
      <el-button v-if="!isReadOnly" type="primary" @click="submitForm('ruleForm')">确 定</el-button>
      <el-button v-if="isReadOnly" type="primary"@click="dialogFormVisible = false">关 闭</el-button>
    </div>
  </el-dialog>
</template>

<script>
import {
  addprepai,
  putprepai,
  urlsignkey,
  getprepaiId
} from '@/api/api'
import ImageUploader from '@/components/imageUploader.vue'
export default {
  props: ['row', 'isReadOnly'],
  data() {
    return {
      dialogFormVisible: true,
      clearable: false,
      rAmount: 5000,
      Amount: '',
      rlist: [{
        PayTime: ''
      }],
      imgs: [{}],
      signkey: {},
      ruleForm: {
        Amount: '',
        PhotoPath: [],
        PrepayDetails: [],
        Remark: '',
        Status: ''
      }
    }
  },
  created() {
    if (this.row && this.row.Id) { // 修改
      this.modifyprepai()
    }
    this.getsignkey()
  },
  methods: {
    modifyprepai() {
      getprepaiId(this.row.Id).then(res => {
        if (res.status) {
          this.ruleForm = $.extend(true, {}, res.data)
          this.rAmount = this.ruleForm.Amount
          this.rlist = this.ruleForm.PrepayDetails
          this.imgs = JSON.parse(this.ruleForm.PhotoPath)
          if (this.isReadOnly) {
            this.imgs.pop()
          }
          this.reduceList(this.rlist)
        }
      })
    },
    deleteItem(rg) {
      var index = this.rlist.indexOf(rg)
      if (index !== -1) {
        this.rlist.splice(index, 1)
      }
      this.reduceList(this.rlist)
    },
    reduceList(rlist) {
      this.Amount = rlist.reduce(function(r, t) {
        return r + (t.Amount || 0)
      }, 0) || 0
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
      this.$refs[formName].validate((valid) => {
        if (valid) {
          if (this.rAmount < 0 || isNaN(this.rAmount)) {
            this.$message.error('充值金额不正确！')
            return
          }
          if (this.rAmount < 5000) {
            this.$message.error('充值金额最少为5000元！')
            return
          }
          var avalid = true
          var invalidMsg = ''
          var amount = 0
          window._.each(this.rlist, (item) => {
            if (!avalid) return
            if (!item.AccountOfPayment) {
              avalid = false
              invalidMsg = '付款账户必须填写!'
            } else if (!item.PayTime) {
              avalid = false
              invalidMsg = '付款时间必须填写!'
            } else if (isNaN(item.Amount) || !item.Amount) {
              avalid = false
              invalidMsg = '款金额必须填写,并且为大于零的数字!'
            } else {
              amount += Number(item.Amount)
            }
          })
          if (!avalid) {
            this.$message.error(invalidMsg)
            return
          }
          if (this.imgs.length === 1) {
            this.$message.error('请上传充值图片!')
            return
          }
          if (amount !== this.rAmount) {
            this.$message.error('充值金额与付款金额合计不相等！')
            return
          }
          this.ruleForm.Amount = this.rAmount
          this.ruleForm.PrepayDetails = this.rlist
          this.ruleForm.PhotoPath = JSON.stringify(this.imgs)
          if (this.row && this.row.Id) {
            putprepai(this.ruleForm).then(res => {
              if (res.status) {
                this.$message.info('修改成功!')
                this.$emit('done')
                this.dialogFormVisible = false
              }
            })
          } else {
            this.ruleForm.Status = 1
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
  },
  components: {
    imgUpl: ImageUploader
  }
}
</script>

<style lang='stylus'>
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
  .table
    border-spacing: 0;
    border-collapse: collapse;
    thead tr th
      border: 1px solid #8391a5;
      width: 25%;
    tbody
      td
        border: 1px solid #8391a5;
      .operate-td
        border: none;
        padding-left: 10px;
      .el-input__inner
        border-radius: 0;
        border: none;
    .item-date
      width: 100%;
      input
        text-align: center;
    .item-add
      position: absolute;
      left: 92%;
      bottom: 42px;
  .file-upload-area-img-item
    float: left;
    width: 120px;
    height: 70px;
    padding: 10px 10px 10px 0;
  .file-upload-area-button
      clear: both;
</style>
