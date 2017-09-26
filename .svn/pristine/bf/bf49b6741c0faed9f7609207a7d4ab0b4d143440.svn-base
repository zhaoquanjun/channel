<template>
<div class="partition-child">
  <el-dialog :title="title" :visible.sync="dialogFormVisible" size="small">
    <el-form :model="ruleForm" ref="ruleForm" class="demo-ruleForm" label-width="100px">
      <el-form-item label="大区名称" required>
        <el-input v-model="ruleForm.PartitionName" auto-complete="off" class="moneyWid" :disabled="canChange"></el-input>
      </el-form-item>
      <el-form-item v-if="sign === 'SCAN'" label="管辖省份" required>
        <!-- <el-input v-model="ruleForm.Provinces" auto-complete="off" class="moneyWid" :disabled="canChange"></el-input> -->
        <span class="scan-style">{{ruleForm.Provinces}}</span>
      </el-form-item>
      <el-form-item v-if="sign === 'ADD'" label="管辖省份" required>
        <el-select v-model="ProvincesCode" multiple placeholder="请选择">
          <el-option v-for="item in provinces" :key="item.Code" :label="item.Name" :value="item.Code"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item v-if="sign === 'MODIFY'" label="管辖省份" required>
        <el-select v-model="ProvincesCode" multiple placeholder="请选择">
          <el-option v-for="item in allprovinces" :key="item.Code" :label="item.Name" :value="item.Code"></el-option>
        </el-select>
      </el-form-item>
    </el-form>
    <div slot="footer" class="dialog-footer">
      <el-button v-if="sign != 'SCAN'" @click="dialogFormVisible = false">取 消</el-button>
      <el-button v-if="sign != 'SCAN'" type="primary" @click="submitForm('ruleForm')">保 存</el-button>
      <el-button v-else type="primary" @click="dialogFormVisible = false">关 闭</el-button>
    </div>
  </el-dialog>
</div>
</template>

<script>
import { getProvinceNew, getProvinceModify, addFq, modifyFq } from '@/api/api'
export default {
  props: ['row', 'sign'],
  data: function() {
    return {
      dialogFormVisible: true,
      ruleForm: {
        PartitionName: '',
        Provinceids: ''
      },
      title: '',
      canChange: false,
      provinces: [],
      allprovinces: [],
      ProvincesCode: []
    }
  },
  mounted() {
    if (this.sign === 'SCAN') {
      this.title = '查看大区'
      this.canChange = true
      this.ruleForm = this.row || {}
    } else if (this.sign === 'MODIFY') {
      this.getAllProvince()
      this.title = '修改大区'
      this.canChange = false
      this.ruleForm = {...this.row}
      console.log(this.ruleForm, '修改大区初始值')
      this.ruleForm.Provinceids = this.filterChannelPartitionIdToArr(this.ruleForm.ProvincesCode)
      for (let i in this.ruleForm.Provinceids) {
        this.ruleForm.Provinceids[i] = this.ruleForm.Provinceids[i] + ''
      }
      this.ProvincesCode = this.ruleForm.Provinceids
      console.log(this.ProvincesCode, '把管辖省份字符过滤成数组')
    } else if (this.sign === 'ADD') {
      this.getProvinceList()
      this.title = '添加大区'
      this.canChange = false
    }
  },
  methods: {
    getProvinceList() {
      getProvinceNew().then((res) => {
        console.log(res)
        this.provinces = res.data
      })
    },
    getAllProvince() {
      let id = this.row.Id
      console.log(id)
      getProvinceModify(id).then((res) => {
        console.log(res)
        this.allprovinces = res.data
      })
    },
    filterChannelPartitionIdToArr(arr) {
      if (!arr) {
        arr = []
      } else {
        arr = arr.split(',')
      }
      return arr
    },
    submitForm(formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          for (let i in this.ProvincesCode) {
            this.ProvincesCode[i] = this.ProvincesCode[i] + ''
          }
          console.log(this.ProvincesCode)
          this.ruleForm.Provinceids = this.ProvincesCode.join(',')
          console.log(this.ruleForm)
          // 需要选择省份的时候最后传给后台code字符串 ProvinceName
          if (!this.ruleForm.PartitionName) {
            this.$message({
              message: '请填写大区名称',
              type: 'warning'
            })
          } else if (!this.ruleForm.Provinceids) {
            this.$message({
              message: '请选择管辖省份',
              type: 'warning'
            })
          } else {
            console.log(this.ruleForm)
            if (this.sign === 'ADD') {
              addFq(this.ruleForm).then(res => {
                if (res.status) {
                  this.$message({
                    type: 'success',
                    message: '添加成功!'
                  })
                  this.$emit('done')
                  this.dialogFormVisible = false
                }
              })
            } else if (this.sign === 'MODIFY') {
              modifyFq(this.ruleForm).then(res => {
                if (res.status) {
                  this.$message({
                    type: 'success',
                    message: '修改成功!'
                  })
                  this.$emit('done')
                  this.dialogFormVisible = false
                }
              })
            }
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
.partition-child .el-form-item__content {
  height: 100%;
}
.partition-child .el-form-item__content .el-select {
  width: 100%;
}
.partition-child .scan-style {
  padding: 3px 10px;
  border: 1px solid #d1dbe5;
  background-color: #eef1f6;
  display: inline-block;
  color: #bbb;
  cursor: not-allowed;
}
.partition-child .el-dialog__body {
  padding: 30px 150px 30px 20px;
}
</style>
