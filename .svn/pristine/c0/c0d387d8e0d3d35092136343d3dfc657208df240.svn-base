<template>
<div>
  <el-dialog title="增加分区" :visible.sync="dialogFormVisible">
    <el-form :model="ruleForm" :rules="rules" class="demo-ruleForm" ref="ruleForm" label-width="100px">
      <el-form-item label="分区名称" prop="PartitionName">
        <el-input type="text" v-model="ruleForm.PartitionName"></el-input>
      </el-form-item>
    </el-form>
    <div slot="footer" class="dialog-footer">
      <el-button @click="dialogFormVisible = false">关 闭</el-button>
      <el-button type="primary" @click="submitForm('ruleForm')">添 加</el-button>
    </div>
  </el-dialog>
</div>
</template>

<script>
import {
  addFq
} from '../../api/api'
import bus from '../../bus.js'
export default {
  data() {
    return {
      dialogFormVisible: true,
      ruleForm: {
        PartitionName: ''
      },
      rules: {
        PartitionName: [{
          required: true,
          message: '请填写分区名称',
          trigger: 'blur'
        }]
      }
    }
  },
  methods: {
    submitForm(formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          addFq(this.ruleForm).then((res) => {
            if (res.status) {
              bus.$emit('add-fq')
            }
          })
          this.dialogFormVisible = false
        } else {
          // console.log('error submit!!')
          return false
        }
      })
    }
  }
}
</script>

<style scoped>
</style>
