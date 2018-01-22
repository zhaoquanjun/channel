<template>
  <el-dialog title="添加地址" :visible.sync="dialogFormVisible" size="tiny">
    <el-form :model="ruleForm" :rules="rules" ref="ruleForm" label-width="132px" class="demo-ruleForm new-address-dialog">
      <el-form-item class="dialog-inputW" label="名称：" prop="Name">
        <el-input v-model="ruleForm.Name"></el-input>
      </el-form-item>
      <el-form-item label="省市：" required>
        <el-select v-model="ruleForm.ProvinceCode" class="dialog-selectW" @change="curCities">
          <el-option v-for="item in provinces" :key="item.Code" :label="item.Name" :value="item.Code"></el-option>
        </el-select>
        <el-select v-model="ruleForm.CityCode" class="dialog-selectW">
          <el-option v-for="item in cities" :key="item.Code" :label="item.Name" :value="item.Code"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item class="dialog-inputW" label="地址：" prop="Address">
        <el-input v-model="ruleForm.Address"></el-input>
      </el-form-item>
      <el-form-item class="dialog-inputW" label="收件人：" prop="Receiver">
        <el-input v-model="ruleForm.Receiver"></el-input>
      </el-form-item>
      <el-form-item class="dialog-inputW" label="联系电话：" prop="Mobile">
        <el-input v-model="ruleForm.Mobile"></el-input>
      </el-form-item>
    </el-form>
    <div slot="footer" class="dialog-footer">
      <el-button @click="dialogFormVisible = false">取 消</el-button>
      <el-button type="primary" @click="submitForm('ruleForm')">确 定</el-button>
    </div>
  </el-dialog>
</template>

<script>
import {
  getProvince,
  getcurCities,
  addAddress,
  updataAddress
} from '@/api/api'
export default {
  props: ['row'],
  data() {
    return {
      dialogFormVisible: true,
      ruleForm: {
        ProvinceCode: '',
        CityCode: ''
      },
      provinces: [],
      cities: [],
      allCities: [],
      rules: {
        Name: [{
          required: true,
          message: '请填写发票名称',
          trigger: 'blur'
        }],
        Address: [{
          required: true,
          message: '请填写地址',
          trigger: 'blur'
        }],
        Receiver: [{
          required: true,
          message: '请填写收件人',
          trigger: 'blur'
        }],
        Mobile: [{
          required: true,
          message: '请填写联系电话',
          trigger: 'blur'
        }]
      }
    }
  },
  created() {
    if (this.row) {
      this.ruleForm = $.extend(true, {}, this.row)
      this.curCities(this.ruleForm.ProvinceCode)
    }
    this.getParamsProvince()
  },
  methods: {
    getParamsProvince() {
      getProvince().then((res) => {
        this.provinces = res.data
        if (!this.row) {
          this.ruleForm.ProvinceCode = res.data[0].Code
          this.curCities(this.ruleForm.ProvinceCode)
        }
      })
    },
    curCities(val) {
      getcurCities(val).then((res) => {
        this.cities = res.data
        if (!this.row || (this.row.ProvinceCode && this.row.ProvinceCode !== this.ruleForm.ProvinceCode)) {
          this.ruleForm.CityCode = res.data[0].Code
        }
      })
    },
    submitForm(formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          if (this.row) {
            updataAddress(this.ruleForm.Id, this.ruleForm).then(res => {
              if (res.status) {
                this.$message.info('修改成功!')
                this.$emit('done')
                this.dialogFormVisible = false
              }
            })
          } else {
            addAddress(this.ruleForm).then(res => {
              if (res.status) {
                this.$message.info('新增成功!')
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

<style lang='stylus' scoped>
.new-address-dialog
  .dialog-inputW
    width: 86%;
  .dialog-selectW
    width: 40%;
</style>
