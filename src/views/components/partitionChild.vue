<template>
<div class="partition-child">
  <el-dialog :title="title" :visible.sync="dialogFormVisible" size="tiny">
    <el-form :model="ruleForm" ref="ruleForm" class="demo-ruleForm" label-width="100px">
      <el-form-item label="大区名称" required>
        <el-input v-model="ruleForm.PartitionName" auto-complete="off" class="moneyWid" :disabled="canChange"></el-input>
      </el-form-item>
      <el-form-item v-if="sign === 'SCAN'" label="管辖省份" required>
        <el-input v-model="ruleForm.ChannelPartition" auto-complete="off" class="moneyWid" :disabled="canChange"></el-input>
      </el-form-item>
      <el-form-item v-if="sign != 'SCAN'" label="管辖省份" required>
        <el-select v-model="ruleForm.ChannelPartition" multiple placeholder="全部">
          <el-option v-for="item in provinces" :key="item.Code" :label="item.Name" :value="item.Code"></el-option>
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
import { getProvince } from '@/api/api'
export default {
  props: ['row', 'sign'],
  data: function() {
    return {
      dialogFormVisible: true,
      ruleForm: {
        PartitionName: '',
        ProvinceName: []
      },
      title: '',
      canChange: false,
      provinces: []
    }
  },
  created() {
    if (this.sign === 'SCAN') {
      this.title = '查看大区'
      this.canChange = true
    } else if (this.sign === 'MODIFY') {
      this.title = '修改大区'
      this.canChange = false
      this.getProvinceList()
    } else if (this.sign === 'ADD') {
      this.title = '添加大区'
      this.canChange = false
      this.getProvinceList()
    }
    this.ruleForm = this.row || {}
  },
  methods: {
    getProvinceList() {
      getProvince().then((res) => {
        console.log(res.data)
        this.provinces = res.data
      })
    },
    submitForm(formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          // 需要选择省份的时候最后传给后台code字符串 ProvinceName
          if (!this.ruleForm.PartitionName) {
            this.$message({
              message: '请填写大区名称',
              type: 'warning'
            })
          } else if (!this.ruleForm.ProvinceName) {
            this.$message({
              message: '请选择管辖省份',
              type: 'warning'
            })
          } else {
            console.log(this.ruleForm)
            // rechargePass(this.ruleForm).then(res => {
            //   if (res.status) {
            //     this.$message({
            //       type: 'success',
            //       message: '添加成功!'
            //     })
            //     this.$emit('done')
            //     this.dialogFormVisible = false
            //   }
            // })
          }
        } else {
          return false
        }
      })
    }
  }
}
</script>

<style scoped>
</style>
