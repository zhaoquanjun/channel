<template>
  <div class="add-order-zc">
    <el-dialog title='订单查看' :visible.sync='dialogFormVisible' size='mini'>
      <div class='container add-order-container'>
        <el-form ref='postData' :model='postData' label-width='180px'>
          <div>
            <p ng-if="postData.OrderId" class="form-control-static">
              销售：{{postData.SalerName}} 订单号：{{postData.OrderId}} 所属公司：{{postData.ChannelName}} 提单员：{{postData.BillName}}
              <span style="color:red">预提单</span>
            </p>
            <div class='gray-line'></div>

            <div class='add-order-title'>
              <span>基本信息</span>
            </div>

            <div class='custom-tips mb-10'>
              <i class='fa fa-exclamation-circle' aria-hidden='true'></i>
              <span>【温馨提示】支持对二代居民身份证的关键字段识别。上传身份证后，即可自动读取并带出姓名、身份证号等信息。</span>
            </div>
            <el-row>
              <el-col :span='12'>
                <custom-upload v-model='postData.Customer.PersonCardPath' :uploaded="uploaded1" title='请上传清晰的身份证人像面，图片大小不要超过1M' :disabled="!modify"></custom-upload>
              </el-col>
              <el-col :span='12'>
                <el-form-item label='所在城市：' required>
                  <el-select v-model="postData.Customer.CityCode" placeholder='请选择' :disabled="!modify">
                    <el-option v-for="item in citys" :key="item.CityCode" :label="item.CityName" :value="item.CityCode">
                    </el-option>
                  </el-select>
                </el-form-item>
                <el-form-item label='法人姓名：' required>
                  <el-input v-model='postData.Customer.LegalPerson' :readonly="!modify" :maxlength="20"></el-input>
                </el-form-item>
                <el-form-item label='法人身份证号：' required>
                  <el-input v-model='postData.Customer.PersonCardID' :readonly="!modify" :maxlength="18"></el-input>
                </el-form-item>
                <el-form-item label='联系人：' required>
                  <el-input v-model='postData.Customer.Contacts' :readonly="!modify" :maxlength="10"></el-input>
                </el-form-item>
                <el-form-item label='手机号：' required>
                  <el-input v-model='postData.Customer.Mobile' :readonly="!modify" :maxlength="11"></el-input>
                </el-form-item>
              </el-col>
            </el-row>

            <div class='add-order-title'>
              <span>合同信息</span>
            </div>

            <el-row>
              <el-col :span='12'>
                <el-form-item label='合同编号：' required>
                  <el-input v-model='postData.ContractNO' :readonly="!modify"></el-input>
                </el-form-item>
              </el-col>
              <el-col :span='12'>
                <el-form-item label='纳税人类别：' prop='name'>
                  <el-radio-group v-model="postData.Customer.AddedValue">
                    <el-radio class="radio-style-bg" label='1' :disabled="true">小规模</el-radio>
                    <el-radio class="radio-style-bg" label='2' :disabled="true">一般纳税人</el-radio>
                  </el-radio-group>
                </el-form-item>
              </el-col>
            </el-row>

            <el-row>
              <el-col>
                <el-form-item v-if="postData.FreChangeOrderId" label='套餐类型：' prop='name'>
                  <div class="price-type">产品变更</div>
                </el-form-item>
                <el-form-item v-else label='套餐类型：' required>
                  <div>
                    <span class="price-type">
                      {{prices.PriceName}}
                    </span>
                    <span v-if="postData.GiftTypeName">{{postData.GiftTypeName + '(￥' + postData.GiftPrice + ')'}}</span>
                    <el-checkbox v-if="postData.IsPromotion" v-model="ischecked" disabled></el-checkbox>
                    <span v-if="postData.IsPromotion" style="color:red">{{postData.Promotion.PromotionName}}</span>
                  </div>
                </el-form-item>
              </el-col>
            </el-row>
            <el-row>
              <el-col>
                <el-form-item label='合同金额：' required>
                  <el-input v-model='postData.ContractAmount' readonly></el-input>
                </el-form-item>
                <div style="padding-left:180px;color:red;margin-top: -10px;margin-bottom: 10px;">注:合同金额根据所属城市、公司性质和付款方式自动计算，不包含礼包价格。</div>
              </el-col>
            </el-row>

            <el-row v-if="modify">
              <el-col>
                <el-form-item label='合同照片：' class="contract-style">
                  <div class="file-upload-area">
                    <div v-for="(img, index) in imgs" :class="index == imgs.length - 1 ? 'file-upload-area-button' : 'file-upload-area-img-item'">
                      <img-upl type="5" v-model='imgs[index]' :sign-key="signkey" :isClose="true" :sign-list="index == imgs.length - 1" @input="imgs.push({})" @delete="imgs.splice(index,1)"></img-upl>
                    </div>
                  </div>
                </el-form-item>
              </el-col>
            </el-row>
            <el-row v-if="!modify">
              <el-col>
                <el-form-item label='合同照片：' class="contract-style">
                  <div class="img-style" v-for="item in imgs">
                    <img-upl :key="item" :value='item' :readonly='true'></img-upl>
                  </div>
                  <div class="contract-button">
                    <el-button type="primary button-upload" name="button">点击上传</el-button>
                  </div>
                </el-form-item>
              </el-col>
            </el-row>
            <el-form-item label='备注'>
              <el-input type='textarea' v-model='postData.Remark' :readonly="!modify"></el-input>
            </el-form-item>

            <div v-if="postData.Status === 3" class='add-order-title'>
              <span>拒审原因</span>
            </div>
            <el-row v-if="postData.Status === 3">
              <el-col>
                <el-form-item label='驳回原因：'>
                  <el-input type='textarea' v-model='postData.BackReason' :readonly="true"></el-input>
                </el-form-item>
              </el-col>
            </el-row>
            <div style='float: right; margin-top: 20px;'>
              <el-button @click="dialogFormVisible = false">关闭</el-button>
              <el-button v-if="modify" type='primary' @click="submitForm('postData')">保存</el-button>
            </div>

          </div>
        </el-form>
      </div>
    </el-dialog>
  </div>
</template>
<script>
  import {
    citybychannel,
    cityprice,
    getpersoncardbypath,
    modifyOrders,
    getChannelGift,
    urlsignkey
} from '../api/api'
  import customUpload from '@/components/customUpload'
  import ImageUploader from '@/components/imageUploader.vue'
  export default {
    props: ['postData', 'modify', 'channelid'],
    data () {
      return {
        dialogFormVisible: true,
        citys: '',
        checked: true, // 营业时间无限期是否
        prices: {},
        allprices: [],
        imgs: [],
        ShowBusnissDeadline: true,
        signkey: {},
        ischecked: true
      }
    },
    watch: {
      'path': function () {
        console.log(arguments)
      }
    },
    components: {
      customUpload,
      imgUpl: ImageUploader
    },
    mounted () {
      this.postData.Customer.AddedValue = this.postData.Customer.AddedValue + ''
      console.log(this.postData.ContractPath, 'this.postData.ContractPath')
      if (this.modify) {
        if (this.postData.ContractPath) {
          var path = this.postData.ContractPath.split(';')
          path.push({})
          this.imgs = path
        } else {
          this.imgs = [{}]
        }
      } else {
        this.imgs = this.postData.ContractPath ? this.postData.ContractPath.split(';') : []
      }
      // this.imgs.push({})
      console.log(this.imgs, 'imgs')
      this.getCitybychannel()
      this.getCityPrice()
      this.getChannelGift()
      // this.BusnissDeadlineCanBeChoose()
      this.getsignkey()
    },
    methods: {
      getChannelGift() {
        const addedvalue = this.postData.Customer.AddedValue
        getChannelGift({
          ChannelId: this.postData.ChannelId
        }).then(res => {
          const _ = window._
          this.allgifts = res.data
          this.gifts = _.filter(res.data, item => item.AddedValue === addedvalue)
        })
      },
      getCitybychannel() {
        citybychannel().then(res => {
          this.citys = res.data
        })
      },
      getCityPrice() {
        const _ = window._
        var cityCode = this.postData.Customer.CityCode
        var channelid = this.channelid
        var ischeck = 1
        cityprice(cityCode, channelid, ischeck).then(res => {
          console.log(res, 'res')
          this.allprices = res.data
          if (this.postData.FreChangeOrderId) return
          const price = _.find(res.data, { Id: +this.postData.PayType })
          console.log(price)
          this.prices = price
          console.log()
        })
      },
      setContractAmount() {
        if (this.postData.FreChangeOrderId) { // 企业性质变更时候重新根据开始账期结算合同金额差额
          console.log('bb')
          var datestart = new Date(this.postData.ServiceStart)
          var dateend = new Date(this.postData.ServiceEnd)
          if (datestart.getTime() > dateend.getTime()) {
            alert('开始账期不能超过结束账期')
            this.postData.ContractAmount = 0
            return
          }
          console.log(dateend, datestart, 'month')
          var startMonth = (dateend.getYear() - datestart.getYear()) * 12 + ((dateend.getMonth() - datestart.getMonth()) + 1)
          // var startMonth = (dateend.getMonth() - datestart.getMonth()) + 1
          console.log(startMonth, 'startMonth')
          this.postData.ContractAmount = (400 - 200) * startMonth
          console.log(this.postData.ContractAmount)
        }
      },
      rules (postData) {
        if (!postData.Customer.Contacts) {
          this.$message({
            message: '请填写联系人',
            type: 'warning'
          })
          return
        }
        if (!postData.Customer.Mobile) {
          this.$message({
            message: '请填写手机号',
            type: 'warning'
          })
          return
        }
        if (!postData.Customer.LegalPerson) {
          this.$message({
            message: '请填写法人姓名',
            type: 'warning'
          })
          return
        }
        if (!postData.Customer.PersonCardID) {
          this.$message({
            message: '请填写法人身份证号',
            type: 'warning'
          })
          return
        }
        if (!postData.Customer.PersonCardPath) {
          this.$message({
            message: '请上传法人身份证',
            type: 'warning'
          })
          return
        }
        if (!postData.ContractNO) {
          this.$message({
            message: '请填写合同编号',
            type: 'warning'
          })
          return
        }
      },
      submitForm (formName) {
        this.$refs[formName].validate((valid) => {
          if (valid) {
            console.log(this.postData)
            this.rules(this.postData)
            if (this.imgs.length === 1) {
              this.postData.ContractPath = ''
            } else if (this.imgs.length > 1) {
              this.imgs.pop()
              this.postData.ContractPath = this.imgs.join(';')
            }
            this.postData = window._.extend(this.postData, this.postData.Customer)
            modifyOrders(this.postData.OrderId, this.postData).then(res => {
              if (res.status) {
                this.$message.info('保存成功!')
                this.dialogFormVisible = false
                this.$emit('done')
              } else {
                this.$message.error(res.message)
              }
            })
          } else {
            return false
          }
        })
      },
      uploaded1 () {
        console.log(this.postData.Customer.PersonCardPath)
        var path = this.postData.Customer.PersonCardPath
        getpersoncardbypath(path).then(res => {
          console.log(res)
          if (res.status && res.data) {
            this.postData.Customer.LegalPerson = res.data.LegalPerson
            this.postData.Customer.PersonCardID = res.data.PersonCardID
          } else if (res.status && !res.data) {
            // this.postData.Customer.PersonCardPath = ''
            this.$message({
              message: '请上传清晰的身份证人像面',
              type: 'warning'
            })
          }
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
      }
    }
  }
</script>
<style lang='stylus' scoped>
  .container
    width: 1100px
    margin-bottom: 20px
    overflow: hidden
    .company-search
      width: auto !important
      .company-alert
        float: left
    .gray-line
      height: 1px
      width: 100%
      background-color: #ccc
    .add-order-title
      height: 22px
      line-height: 22px
      margin: 14px 0px
      &:after
        float: left
        width: 5px
        height: 100%
        background-color: #1a9bfc
        content: ''
        margin-right: 8px
      span
        font-size: 16px
        color: black
    .custom-tips
      padding: 8px 0px
      line-height: 36px
      width: 100%
      background-color: #f3fafa
      color: #1b9bfc
      font-size: 14px
      padding: 0px 10px
    .price-type
      display: inline-block
      background-color: #fff
      border-color: #1b9bfc
      border-radius: 4px;
      color: #1f2d3d
      cursor: pointer
      width: 80px
      text-align: center
      height: 34px
      line-height: 34px
      background: #20a0ff
    .img-style
      width: 110px
      height: 85px
      line-height: 85px
      float: left
      line-height: 75px
      text-align: center
      position: relative
      margin: 0 5px
      img
        width: 100px
        height: 75px
  .mb-10
    margin-bottom: 10px
  .mt-30
    margin-top: 30px
</style>
<style lang='stylus'>
  .add-order-container
  .el-date-editor.el-input
    width: 120px
    form
      input, textarea
        width: 300px
      input:nth-child(2)
        width: 120px
    .company-search
      input
        width: 220px
      .el-input-group__append
        width: 80px
        text-align: center
        background-color: #1a9bfc
        color: white
        border: none
        cursor: pointer
</style>
<style>
.add-order-zc .file-upload-area {
  overflow: hidden;
  float: left;
  width: 100%;
}
.add-order-zc .file-upload-area-img-item {
  float: left;
  width: 120px;
  height: 70px;
  padding: 10px 10px 10px 0;
}

.add-order-zc .file-upload-area-button {
  clear: both;
}
.add-order-zc .contract-button {
  clear: both;
}
.add-order-zc .contract-button .el-button--primary {
  height: 30px;
  padding: 5px 10px;
  font-size: 12px;
  cursor: not-allowed;
}
.add-order-zc .contract-style .el-form-item__content {
  height: auto;
}
.add-order-zc .radio-style-bg .el-radio__input.is-disabled.is-checked .el-radio__inner {
  border-color: #20a0ff;
  background: #20a0ff;
}
</style>
