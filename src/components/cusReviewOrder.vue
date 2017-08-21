<template>
<div>
  <el-dialog title="预提单" :visible.sync="dialogFormVisible">
    <div>
      <label>销售员：</label>
      <span v-if="postData.OrderId" v-text="postData.SalerName"></span>
      <!-- <select v-if="!postData.OrderId" v-model="postData.SalesId">
          <option value="{{::sale.UserId}}" v-for="sale in sales" v-text="sale.RealName"></option>
        </select> -->
      <span>订单号：{{postData.OrderId}}</span>
      <span>所属公司：{{postData.ChannelName}}</span>
      <span>提单人：{{postData.BillName}}</span>
    </div>
    <div class="customer">
      <div class="header">
        <span class="title">客户信息</span>
      </div>
      <div class="body">
        <table>
          <thead>
            客户基本信息
          </thead>
          <tbody>
            <tr>
              <td class="required">联系人</td>
              <td>
                <span v-text="postData.Customer.Contacts"></span>
              </td>
              <td class="required">手机</td>
              <td>
                <span v-text="postData.Customer.Mobile"></span>
              </td>
            </tr>
            <tr>
              <td class="required">所在城市</td>
              <td>
                <span>{{postData.Customer.CityCode}}</span>
              </td>
              <td class="required">公司性质</td>
              <td>
                <span>{{postData.Customer.AddedValue === 1 ? '小规模' : '一般纳税人'}}</span>
              </td>
            </tr>
            <tr>
              <td class="required">法人</td>
              <td>
                <span v-text="postData.Customer.LegalPerson"></span>
              </td>
              <td class="required">上传法人身份证照片</td>
              <td>
                <img class="img" :src="urlPersonCardPath" alt="">
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
    <div class="customer">
      <div class="header">
        <span class="title">合同信息</span>
      </div>
      <div class="body">
        <table>
          <tbody>
            <tr>
              <td class="required" width="100">合同编号</td>
              <td>
                <span v-text="postData.ContractNO"></span>
              </td>
              <td class="required" width="100">付款方式</td>
              <td>
                <div class="pull-left type">{{postData.PayType}}</div>
                <div class="pull-left type">
                  <span>礼包</span>
                  <span>{{postData.GiftTypeName}}</span>
                  <span>(￥{{postData.GiftPrice}})</span>
                </div>
                <div v-if="postData.IsPromotion" class="pull-left type">{{postData.Promotion.PromotionName}}:{{postData.Promotion.Description}}</div>
                <span class="explain">注:零税指零报税并且零票据。</span>
              </td>
            </tr>
            <tr>
              <td class="required">签订日期</td>
              <td width="120">
                <span>{{postData.ContractDate | formateDate}}</span>
              </td>
              <td class="required">合同金额</td>
              <td>
                <span v-text="postData.ContractAmount"></span>
                <span class="explain">注:合同金额根据所属城市、公司性质和付款方式自动计算，不包含礼包价格。</span>
              </td>
            </tr>
            <tr>
              <td class="required">备注</td>
              <td colspan="3">
                <span v-text="postData.ContractDescription"></span>
              </td>
            </tr>
            <tr>
              <td class="required">合同照片</td>
              <td colspan="3">
                <img class="img" :src="urlContractPath" alt="">
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
    <div class="customer">
      <div class="header">
        <span class="title">提单备注</span>
      </div>
      <div class="body">
        <div>提单特殊备注信息</div>
        <textarea readonly cols="80" v-text="postData.Remark"></textarea>
      </div>
    </div>
    <div slot="footer" class="dialog-footer">
      <el-button type="primary" @click="dialogFormVisible = false">关 闭</el-button>
    </div>
  </el-dialog>
</div>
</template>

<script>
import {
  industry,
  citybychannel,
  cityprice
} from '../api/api'
export default {
  props: ['postData'],
  data() {
    return {
      dialogFormVisible: true,
      citys: '',
      industrys: '',
      prices: '',
      urlPersonCardPath: '',
      urlContractPath: ''
    }
  },
  created() {
    var path = 'http://123.56.31.133:8082'
    this.urlPersonCardPath = path + this.postData.Customer.PersonCardPath
    this.urlContractPath = path + this.postData.ContractPath
    this.getCitybychannel()
    this.getIndustryList()
    this.getCityPrice()
    console.log(this.postData)
  },
  methods: {
    getIndustryList() {
      industry().then(res => {
        this.industrys = res.data
        this.postData.Customer.Industry = this.formateIndustry(this.postData.Customer.Industry)
      })
    },
    getCitybychannel() {
      citybychannel().then(res => {
        this.citys = res.data
        this.postData.Customer.CityCode = this.formateCity(this.postData.Customer.CityCode)
      })
    },
    getCityPrice() {
      var cityCode = this.postData.Customer.CityCode
      cityprice(cityCode).then(res => {
        this.prices = res.data
        this.postData.PayType = this.formatePayType(this.postData.PayType)
      })
    },
    formateCity(val) {
      for (let i in this.citys) {
        if (this.citys[i].CityCode === val) {
          val = this.citys[i].CityName
        }
      }
      return val
    },
    formateIndustry(val) {
      for (let i in this.industrys) {
        if (this.industrys[i].IndustryId === val) {
          val = this.industrys[i].IndustryName
        }
      }
      return val
    },
    formatePayType(val) {
      console.log(val) // 返回有错PayType 没有1的状态
      for (let i in this.prices) {
        // console.log(this.prices[i].Id === Number(val))
        if (this.prices[i].Id === Number(val)) {
          val = this.prices[i].PriceName
        }
      }
      return val
    }
  },
  filters: {
    formateDate(val) {
      return val.substring(0, 10)
    }
  }
}
</script>

<style scoped>
.customer {
  border: 1px solid #ddd;
  margin-top: 12px;
}

.customer .header {
  padding: 6px 12px;
  border-bottom: 1px solid #ddd;
}

.customer .body {
  padding: 12px
}

.title {
  font-size: 16px;
  color: #001D7E;
  font-weight: 700;
}

table {
  width: 100%;
  max-width: 100%;
  margin-bottom: 20px;
  border-spacing: 0;
  border-collapse: collapse;
}

thead {
  display: inline-block;
  background-color: #a1bfd4;
  color: #fff;
  font-size: 14px;
  font-weight: 700;
  padding: 6px 12px;
}

td {
  border: 1px solid #ddd;
  padding: 8px;
  line-height: 14px;
  vertical-align: top;
}

.required::before {
  color: red;
  content: '*';
  padding: 6px;
}

.upload-demo {
  width: 100px;
}

.explain {
  display: inline-block;
  font-size: 12px;
  color: red;
}

.type {
  padding-right: 10px;
}
</style>
