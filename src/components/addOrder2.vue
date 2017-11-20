<template>
  <div>
    <el-dialog title='订单查看' :visible.sync='dialogFormVisible' size='mini'>
      <div class='container add-order-container'>
        <el-form ref='postData' :rules='rules' :model='postData' label-width='180px'>
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
                <el-form-item label='所在城市：'>
                  <el-select v-model="postData.Customer.CityCode" placeholder='请选择' :disabled="!modify">
                    <el-option v-for="item in citys" :key="item.CityCode" :label="item.CityName" :value="item.CityCode">
                    </el-option>
                  </el-select>
                </el-form-item>
              </el-col>
            </el-row>

            <el-row>
              <el-col :span='12'>
                <el-form-item label='联系人：'>
                  <el-input v-model='postData.Customer.Contacts' :readonly="!modify"></el-input>
                </el-form-item>
              </el-col>
              <el-col :span='12'>
                <el-form-item label='手机号：'>
                  <el-input v-model='postData.Customer.Mobile' :readonly="!modify"></el-input>
                </el-form-item>
              </el-col>
            </el-row>

            <div class='add-order-title'>
              <span>工商信息</span>
            </div>

            <el-row>
              <el-col :span='12'>
                <custom-upload v-model='postData.Customer.PersonCardPath' :uploaded="uploaded" title='请上传清晰的身份证人像面，图片大小不要超过1M' :disabled="!modify"></custom-upload>
                <custom-upload v-model='postData.Customer.BusinessLicense' :uploaded="uploaded" title='请上传清晰的营业执照，图片大小不要超过1M' class='mt-30' :disabled="!modify"></custom-upload>
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
                  <el-date-picker width="100" v-model="postData.Customer.RegisterDate" type="date" placeholder="开始日期" :readonly="!modify">
                  </el-date-picker>
                  <span>-</span>
                  <el-date-picker v-if="postData.Customer.NoDeadLine === 0" v-model="postData.Customer.BusnissDeadline" type="date" placeholder="结束日期" :readonly="!modify">
                  </el-date-picker>
                  <el-checkbox v-if="postData.Customer.NoDeadLine === 1" v-model="checked" :disabled="!modify">无限期</el-checkbox>
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
                    <el-radio label='1' :disabled="!modify">小规模</el-radio>
                    <el-radio label='2' :disabled="!modify">一般纳税人</el-radio>
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
                  <el-input v-model='postData.ContractAmount' :readonly="!modify"></el-input>
                </el-form-item>
                <div style="padding-left:180px;color:red;margin-top: -10px;margin-bottom: 10px;">注:合同金额根据所属城市、公司性质和付款方式自动计算，不包含礼包价格。</div>
              </el-col>
            </el-row>

            <el-row>
              <el-col>
                <el-form-item label='合同照片：'>
                  <div class="img-style" v-for="img in imgs">
                    <img :src="img">
                  </div>
                </el-form-item>
              </el-col>
            </el-row>

            <el-form-item label='备注'>
              <el-input type='textarea' v-model='postData.Remark' :readonly="!modify"></el-input>
            </el-form-item>

            <div style='float: right; margin-top: 20px;'>
              <el-button type="primary" @click="dialogFormVisible = false">关闭</el-button>
              <el-button v-if="modify" type='primary' @click="submitForm('form')">保存</el-button>
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
    cityprice
    // getChannelGift,
    // modifyOrders,
    // urlsignkey
} from '../api/api'
  import customUpload from '@/components/customUpload'
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
        rules: {
          name: [
            { required: true, message: '请输入活动名称', trigger: 'blur' },
            { min: 3, max: 5, message: '长度在 3 到 5 个字符', trigger: 'blur' }
          ],
          region: [
            { required: true, message: '请选择活动区域', trigger: 'change' }
          ],
          date1: [
            { type: 'date', required: true, message: '请选择日期', trigger: 'change' }
          ],
          date2: [
            { type: 'date', required: true, message: '请选择时间', trigger: 'change' }
          ],
          type: [
            { type: 'array', required: true, message: '请至少选择一个活动性质', trigger: 'change' }
          ],
          resource: [
            { required: true, message: '请选择活动资源', trigger: 'change' }
          ],
          desc: [
            { required: true, message: '请填写活动形式', trigger: 'blur' }
          ]
        }
      }
    },
    watch: {
      'path': function () {
        console.log(arguments)
      }
    },
    components: {
      customUpload
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
    },
    methods: {
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
      submitForm (formName) {
        this.$refs[formName].validate((valid) => {
          if (valid) {
            alert('submit!')
          } else {
            console.log('error submit!!')
            return false
          }
        })
      },
      uploaded () {
        // alert('上传完毕')
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
