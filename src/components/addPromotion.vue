<template>
  <el-dialog :title="title" :visible.sync="dialogFormVisible" size="small">
    <el-form :model="ruleForm" :rules="rules" ref="ruleForm" label-width="80px" class="demo-ruleForm add-promotion-model">
      <el-form-item label="活动分类" prop="PromotionType">
        <el-radio-group v-model="ruleForm.PromotionType">
          <el-radio label="1" :disabled="isChange">延长服务时长</el-radio>
          <el-radio label="2" :disabled="isChange">价格优惠</el-radio>
        </el-radio-group>
      </el-form-item>
      <el-form-item class="add-promotion" label="活动名称" prop="PromotionName">
        <el-input class="promotion-input-width" v-model="ruleForm.PromotionName" :disabled="isChange"></el-input>
      </el-form-item>
      <el-form-item class="add-promotion" label="数量" prop="Num">
        <el-input class="promotion-input-width" v-model="ruleForm.Num"></el-input>
      </el-form-item>
      <el-form-item class="add-promotion" label="开始日期" prop="StartDate">
        <el-date-picker v-model="ruleForm.StartDate" type="date" :clearable="clearable">
        </el-date-picker>
      </el-form-item>
      <el-form-item class="add-promotion" label="结束日期" prop="EndDate">
        <el-date-picker class="inputWiddate" v-model="ruleForm.EndDate" type="date" :clearable="clearable">
        </el-date-picker>
      </el-form-item>
      <div class="promotion-condition">
        <div class="promotion-condition-label">适用条件：</div>
        <div class="promotion-condition-con">
          <div class="promotion-condition-item" v-for="(list, index) in ruleForm.PromotionDetailsEntityList">
            套餐为：
            <el-select class="condition-item-select-width" v-model="list.ServiceMonths" :disabled="isChange">
              <el-option label="季度" :value="3"></el-option>
              <el-option label="半年" :value="6"></el-option>
              <el-option label="一年" :value="12"></el-option>
              <el-option label="两年" :value="24"></el-option>
              <el-option label="三年" :value="36"></el-option>
              <el-option label="零税半年" :value="0"></el-option>
            </el-select>
            时，<span v-if="ruleForm.PromotionType == 1">赠送</span><span v-if="ruleForm.PromotionType == 2">优惠</span>
            <el-input class="condition-item-input-width" v-model="list.PromotionMonths" :disabled="isChange"></el-input>
            <span v-if="ruleForm.PromotionType == 1">个月服务时长。</span><span v-if="ruleForm.PromotionType == 2">个月价钱。</span>
            <el-button v-if="ruleForm.PromotionDetailsEntityList.length > 1" @click="deletePromotionDetail(list)" type="text" size="small">删除</el-button>
          </div>
          <div class="promotion-condition-add">
            <el-button @click="ruleForm.PromotionDetailsEntityList.push({ServiceMonths:''})" type="text" size="small">添加</el-button>
          </div>
        </div>
      </div>
    </el-form>
    <div slot="footer" class="dialog-footer">
      <el-button @click="dialogFormVisible = false">取 消</el-button>
      <el-button type="primary" @click="submitForm('ruleForm')">确 定</el-button>
    </div>
  </el-dialog>
</template>

<script>
import { addpromotion, Updatepromotion, globlepromotionDetail, updategloblepromotionbychannel } from '@/api/api'
export default {
  props: ['title', 'commonPromotion', 'channelid', 'Id', 'IsGloble', 'modify', 'ConfigId'],
  data() {
    return {
      dialogFormVisible: true,
      clearable: false,
      ruleForm: {
        PromotionType: '1',
        StartDate: '',
        EndDate: '',
        PromotionDetailsEntityList: [{
          ServiceMonths: ''
        }],
        IsGloble: ''
      },
      rules: {
        PromotionType: [{
          required: true,
          message: '请选择活动分类',
          trigger: 'change'
        }],
        PromotionName: [{
          required: true,
          message: '请输入活动名称',
          trigger: 'blur'
        }],
        Num: [{
          required: true,
          message: '请输入数量',
          trigger: 'blur'
        }],
        StartDate: [{
          type: 'date',
          required: true,
          message: '请选择开始日期',
          trigger: 'change'
        }],
        EndDate: [{
          type: 'date',
          required: true,
          message: '请选择结束日期',
          trigger: 'change'
        }]
      },
      isChange: false
    }
  },
  mounted() {
    if (this.commonPromotion) {
      this.ruleForm.IsGloble = 1 // 是
    } else {
      this.ruleForm.IsGloble = 0 // 否
      this.ruleForm.ChannelId = this.channelid
    }
    if (this.modify) { // 修改
      this.getgloblepromotion()
      console.log(this.channelid)
      this.ruleForm.ChannelId = this.channelid
      if (this.IsGloble === 1 && this.channelid) {
        this.isChange = true
      }
    }
  },
  methods: {
    getgloblepromotion() {
      let id = this.Id
      globlepromotionDetail({
        id: id
      }).then((res) => {
        if (res.status) {
          console.log(res)
          this.ruleForm = res.data
          this.ruleForm.PromotionType = this.ruleForm.PromotionType + ''
          this.ruleForm.Num = this.ruleForm.Num + ''
          this.ruleForm.StartDate = new Date(this.ruleForm.StartDate)
          this.ruleForm.EndDate = new Date(this.ruleForm.EndDate)
          console.log(this.ruleForm.StartDate)
        }
      })
    },
    deletePromotionDetail(list) {
      var index = this.ruleForm.PromotionDetailsEntityList.indexOf(list)
      if (index !== -1) {
        this.ruleForm.PromotionDetailsEntityList.splice(index, 1)
      }
    },
    submitForm(formName) {
      console.log(this.ruleForm)
      this.$refs[formName].validate((valid) => {
        if (valid) {
          if (this.ruleForm.PromotionDetailsEntityList.length === 1 && !this.ruleForm.PromotionDetailsEntityList[0].PromotionMonths) {
            this.$message({
              message: '请填写活动适用条件',
              type: 'warning'
            })
            return
          }
          console.log(this.modify, this.IsGloble, this.channelid)
          if (this.modify && this.IsGloble === 1 && this.channelid) { // 修改且通用且代理商 代理商修改通用活动
            console.log('aaa')
            this.ruleForm.ChannelId = this.channelid
            this.ruleForm.ConfigId = this.ConfigId
            updategloblepromotionbychannel(this.ruleForm).then(res => {
              if (res.status) {
                this.$message({
                  type: 'success',
                  message: '修改成功!'
                })
                this.$emit('done')
                this.dialogFormVisible = false
              }
            })
          } else if (this.modify) {
            console.log('bbb')
            Updatepromotion(this.ruleForm).then(res => {
              if (res.status) {
                this.$message({
                  type: 'success',
                  message: '修改成功!'
                })
                this.$emit('done')
                this.dialogFormVisible = false
              }
            })
          } else {
            addpromotion(this.ruleForm).then((res) => {
              if (res.status) {
                this.$message({
                  type: 'success',
                  message: '添加成功!'
                })
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
  }
}
</script>

<style>
.add-promotion-model .el-form-item__label {
  padding-right: 6px;
}
.add-promotion {
  width: 50%;
  float: left;
}
.add-promotion .promotion-input-width {
  width: 193px;
}
.promotion-condition {
  clear: both;
}
.promotion-condition .promotion-condition-label::before {
  content: '*';
  color: red;
  padding-right: 4px;
}
.promotion-condition .promotion-condition-con::after {
  content:"";
  display:block;
  height:0;
  clear:both;
  visibility:hidden
}
.promotion-condition .promotion-condition-label {
  padding-bottom: 10px;
}
.promotion-condition .promotion-condition-item {
  padding-left: 25px;
  float: left;
  padding-bottom: 10px;
}
.promotion-condition .promotion-condition-add {
  float: left;
  height: 36px;
  line-height: 36px;
  padding-left: 10px;
}
.promotion-condition .promotion-condition-item .condition-item-select-width .el-input {
  width: 106px;
}
.promotion-condition .promotion-condition-item .condition-item-input-width {
  width: 50px;
  margin: 0 3px;
}
</style>
