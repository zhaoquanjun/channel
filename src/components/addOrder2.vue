<template>
  <div>
    <el-dialog title='订单查看' :visible.sync='dialogFormVisible' size='mini'>
      <div class='container add-order-container'>
        <el-form ref='postData' :model='postData' label-width='180px'>
          <div>
            <p ng-if="postData.OrderId" class="form-control-static">
              销售：{{postData.SalerName}} 订单号：{{postData.OrderId}} 所属公司：{{postData.ChannelName}} 提单员：{{postData.BillName}}
              <span v-if="postData.Category != 1" style="color:red">预提单</span>
              <span v-if="postData.FreChangeOrderId" style="color:red">企业性质变更</span>
            </p>
            <div class='gray-line'></div>

            <div class='add-order-title'>
              <span>基本信息</span>
            </div>

            <div class='custom-tips mb-10'>
              <i class='fa fa-exclamation-circle' aria-hidden='true'></i>
              <span v-if="postData.Category == 2">【温馨提示】支持对二代居民身份证的关键字段识别。上传身份证后，即可自动读取并带出姓名、身份证号等信息。</span>
              <span v-else>【温馨提示】可根据客户在国家企业信息公示系统的链接地址，快速完成工商信息的录入。</span>
            </div>

            <el-row>
              <el-col :span='12'>
                <el-form-item label='公司名称：' required>
                  <el-input class='company-search' v-model='postData.Customer.Name' :readonly="!modify"></el-input>
                  <el-button v-if="modify" type="primary" class="company-alert" @click="getCompanyInfo">同步官方</el-button>
                </el-form-item>
              </el-col>
              <el-col :span='12'>
                <el-form-item label='所在城市：' required>
                  <el-select v-model="postData.Customer.CityCode" placeholder='请选择' :disabled="!modify">
                    <el-option v-for="item in citys" :key="item.CityCode" :label="item.CityName" :value="item.CityCode">
                    </el-option>
                  </el-select>
                </el-form-item>
              </el-col>
            </el-row>

            <el-row>
              <el-col :span='12'>
                <el-form-item label='联系人：' required>
                  <el-input v-model='postData.Customer.Contacts' :readonly="!modify"></el-input>
                </el-form-item>
              </el-col>
              <el-col :span='12'>
                <el-form-item label='手机号：' required>
                  <el-input v-model='postData.Customer.Mobile' :readonly="!modify"></el-input>
                </el-form-item>
              </el-col>
            </el-row>

            <div class='add-order-title'>
              <span>工商信息</span>
            </div>

            <el-row>
              <el-col :span='12'>
                <custom-upload v-model='postData.Customer.PersonCardPath' :uploaded="uploaded1" title='请上传清晰的身份证人像面，图片大小不要超过1M' :disabled="!modify"></custom-upload>
                <custom-upload v-model='postData.Customer.BusinessLicense' title='请上传清晰的营业执照，图片大小不要超过1M' class='mt-30' :disabled="!modify"></custom-upload>
              </el-col>
              <el-col :span='12'>
                <el-form-item label='法人姓名：' required>
                  <el-input v-model='postData.Customer.LegalPerson' :readonly="!modify"></el-input>
                </el-form-item>
                <el-form-item label='法人身份证号：' required>
                  <el-input v-model='postData.Customer.PersonCardID' :readonly="!modify"></el-input>
                </el-form-item>
                <el-form-item label='公司住所：' required>
                  <el-input v-model='postData.Customer.Address' :readonly="!modify"></el-input>
                </el-form-item>
                <el-form-item label='社会统一信用代码：' required>
                  <el-input v-model='postData.Customer.RegNO' :readonly="!modify"></el-input>
                </el-form-item>
                <el-form-item label='营业期限：' required>
                  <el-date-picker width="100" v-model="postData.Customer.RegisterDate" type="date" placeholder="开始日期" :clearable="false" :readonly="!modify">
                  </el-date-picker>
                  <span>-</span>
                  <el-date-picker v-if="postData.Customer.NoDeadLine === 0 || modify" v-model="postData.Customer.BusnissDeadline" type="date" placeholder="结束日期" :clearable="false" :readonly="!modify || ShowBusnissDeadline">
                  </el-date-picker>
                  <el-checkbox v-if="postData.Customer.NoDeadLine === 1 || modify" v-model="checked" :disabled="!modify" @change="BusnissDeadlineCanBeChoose">无限期</el-checkbox>
                </el-form-item>
                <el-form-item label='注册资金：' required>
                  <el-input v-model='postData.Customer.RegisteredCapital' :readonly="!modify"></el-input>
                </el-form-item>
                <el-form-item label='经营范围：' required>
                  <el-input type='textarea' v-model='postData.Customer.BusinessScope' :rows=8 :readonly="!modify"></el-input>
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
                    <el-radio label='1' :disabled="true">小规模</el-radio>
                    <el-radio label='2' :disabled="true">一般纳税人</el-radio>
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
                    <span v-if="postData.IsPromotion" style="color:red">{{postData.Promotion.PromotionName}}</span>
                  </div>
                </el-form-item>
              </el-col>
            </el-row>

            <el-row>
              <el-col :span='12'>
                <el-form-item label='开始账期：' required>
                  <el-date-picker v-if="modify && !postData.FreChangeOrderId && postData.IsChange === 0 && postData.IsChanging === '0'" v-model="postData.ServiceStart" type="month" @change="setServiceEnd" :clearable="false"></el-date-picker>
                  <el-date-picker v-if="modify && postData.FreChangeOrderId && postData.IsChange === 0 && postData.IsChanging === '0'" v-model="postData.ServiceStart" type="month" @change="setServiceEnd" :disabled="postData.Status === 2" :picker-options="pickerOptions" :clearable="false"></el-date-picker>
                  <el-date-picker v-if="modify && (postData.IsChange === 1 || postData.IsChanging === '1')" v-model="postData.ServiceStart" type="month" @change="setServiceEnd" readonly></el-date-picker>
                  <el-date-picker v-if="!modify" v-model="postData.ServiceStart" type="month" readonly></el-date-picker>
                </el-form-item>
              </el-col>
              <el-col :span='12'>
                <el-form-item label='结束账期：' required>
                  <el-date-picker v-model="postData.ServiceEnd" type="month" :readonly="!modify"></el-date-picker>
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

            <el-row>
              <el-col>
                <el-form-item label='合同照片：'>
                  <!-- <div class="img-style" v-for="img in imgs">
                    <img :src="img">
                  </div> -->
                  <div class="file-upload-area">
                    <div v-for="(img, index) in imgs" :class="index == imgs.length - 1 ? 'file-upload-area-button' : 'file-upload-area-img-item'">
                      <img-upl type="5" v-model='imgs[index]' :sign-key="signkey" :isClose="true" :sign-list="index == imgs.length - 1" @input="imgs.push({})" @delete="imgs.splice(index,1)"></img-upl>
                    </div>
                  </div>
                </el-form-item>
              </el-col>
            </el-row>

            <el-form-item label='备注'>
              <el-input type='textarea' v-model='postData.Remark' :readonly="!modify"></el-input>
            </el-form-item>

            <div style='float: right; margin-top: 20px;'>
              <el-button type="primary" @click="dialogFormVisible = false">关闭</el-button>
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
  import Dialog from '@/service/dialog.js'
  import CompanyInfo from '@/views/components/companyInfo'
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
        imgs: [{}],
        ShowBusnissDeadline: true,
        signkey: {}
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
      if (this.postData.Customer.NoDeadLine === 0) {
        this.checked = false
      } else if (this.postData.Customer.NoDeadLine === 1) {
        this.checked = true
      }
      if (this.postData.Customer.BusnissDeadline.substr(0, 4) === '0001') {
        this.postData.Customer.BusnissDeadline = ''
      }
      this.postData.Customer.AddedValue = this.postData.Customer.AddedValue + ''
      this.imgs = this.postData.ContractPath ? this.postData.ContractPath.split(';') : []
      this.getCitybychannel()
      this.getCityPrice()
      this.getChannelGift()
      this.BusnissDeadlineCanBeChoose()
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
      BusnissDeadlineCanBeChoose() { // 判断营业期限是无限期的时候 结束账期不能选择
        if (this.checked) {
          this.postData.Customer.BusnissDeadline = ''
          this.ShowBusnissDeadline = true
        } else {
          this.ShowBusnissDeadline = false
        }
        console.log(this.checked, 'checked')
      },
      getCompanyInfo() { // 同步官方
        Dialog(CompanyInfo, {}).then(res => {
          console.log(res, 'res')
          if (!res) {
            this.$message({
              message: '抱歉，没有检索到企业信息，请重试或手动录入！',
              type: 'warning'
            })
          } else {
            this.postData.Customer.IsSync = 1
            this.postData.Customer.Name = res.CompanyName
            this.postData.Customer.Address = res.Address
            this.postData.Customer.BusinessScope = res.BusinessScope
            this.postData.Customer.BusnissDeadline = new Date(res.BusnissDeadline)
            if (this.postData.Customer.LegalPerson && this.postData.Customer.LegalPerson !== res.LegalPerson) {
              this.postData.Customer.LegalPerson = res.LegalPerson
              this.postData.Customer.PersonCardID = ''
            } else {
              this.postData.Customer.LegalPerson = res.LegalPerson
            }
            this.postData.Customer.RegNO = res.RegNO
            this.postData.Customer.RegisterDate = new Date(res.RegisterDate)
            this.postData.Customer.RegisteredCapital = res.RegisteredCapital
          }
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
      setServiceEnd() {
        console.log('aaa')
        if (this.postData.FreChangeOrderId) {
          this.setContractAmount()
        }
        const _ = window._
        if (!this.postData.ServiceStart) return
        if (!this.postData.PayType) return
        if (this.postData.FreChangeOrderId) return
        console.log(this.postData)
        var payType = _.find(this.allprices, item => {
          return item.Id === +this.postData.PayType
        })
        if (!payType) return
        console.log(payType, 'payType')
        let addMonth = payType.ServiceMonths
        let giftAndPromotionMonth = 0
        console.log(this.allgifts, 'this.allgifts')
        var res = _.filter(this.allgifts, {
          'AddedValue': +this.postData.Customer.AddedValue,
          'GiftTypeId': +this.postData.GiftTypeId
        })
        console.log(res, 'res')
        // const gift = _.find(this.gifts, item => {
        //   return item.GiftTypeId === +this.postData.GiftTypeId
        // })
        // console.log(gift, 'gift')
        if (res && res[0]) {
          // addMonth = addMonth + gift.MonthNum
          giftAndPromotionMonth = giftAndPromotionMonth + res[0].MonthNum
        }
        if (this.postData.Promotion && this.postData.IsPromotion && this.postData.Promotion.PromotionType === 1) {
          // addMonth += promotionMap[this.postData.IsPromotion].serviceFn()
          var p = this.postData.Promotion.PromotionDetailsEntityList
          for (let i in p) {
            if (p[i].ServiceMonths === 0 && payType.IsZero === 1) {
              giftAndPromotionMonth += p[i].PromotionMonths
            }
            if (p[i].ServiceMonths === addMonth && payType.IsZero !== 1) {
              // addMonth += p[i].PromotionMonths
              giftAndPromotionMonth += p[i].PromotionMonths
              // break
            }
          }
        }
        console.log(giftAndPromotionMonth, 'giftAndPromotionMonth')
        addMonth += giftAndPromotionMonth
        console.log(addMonth, 'addMonth')
        const date = new Date(this.postData.ServiceStart)
        const enddate = new Date(date.setMonth(date.getMonth() + addMonth - 1))

        this.postData.ServiceEnd = enddate.format('yyyy-MM')
      },
      rules (postData) {
        if (!postData.Customer.Name) {
          this.$message({
            message: '请填写公司名称',
            type: 'warning'
          })
          return
        }
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
        if (!postData.Customer.Address) {
          this.$message({
            message: '请填写公司住所',
            type: 'warning'
          })
          return
        }
        if (!postData.Customer.LocalTaxNO) {
          this.$message({
            message: '请填写社会统一信用代码',
            type: 'warning'
          })
          return
        }
        if (!postData.Customer.NoDeadLine && !postData.Customer.BusnissDeadline) {
          this.$message({
            message: '请填写营业期限',
            type: 'warning'
          })
          return
        }
        if (!postData.Customer.RegisteredCapital) {
          this.$message({
            message: '请填写注册资金',
            type: 'warning'
          })
          return
        }
        if (!postData.Customer.BusinessScope) {
          this.$message({
            message: '请填写经验范围',
            type: 'warning'
          })
          return
        }
        if (!postData.Customer.BusinessLicense) {
          this.$message({
            message: '请上传营业执照',
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
            if (this.postData.Customer.IsSync && this.postData.Customer.LegalPerson && this.postData.Customer.LegalPerson === res.data.LegalPerson) {
              this.postData.Customer.PersonCardID = res.data.PersonCardID
            } else if (this.postData.Customer.IsSync && this.postData.Customer.LegalPerson && this.postData.Customer.LegalPerson !== res.data.LegalPerson) {
              this.$message({
                message: '身份证上的法人姓名与营业执照上的法人不符',
                type: 'warning'
              })
            } else {
              this.postData.Customer.LegalPerson = res.data.LegalPerson
              this.postData.Customer.PersonCardID = res.data.PersonCardID
            }
          } else if (res.status && !res.data) {
            this.postData.Customer.PersonCardPath = ''
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
<style scoped>
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
</style>
