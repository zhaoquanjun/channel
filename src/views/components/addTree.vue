<template>
<div>
  <el-dialog :title="title" :visible.sync="dialogFormVisible">
    <el-form :model="ruleForm" :rules="rules" class="demo-ruleForm" ref="ruleForm" label-width="100px">
      <el-form-item label="机构名称" prop="name">
        <el-input v-model="ruleForm.name" auto-complete="off"></el-input>
      </el-form-item>
      <el-form-item label="机构描述" prop="pwd">
        <el-input v-model="ruleForm.desc" auto-complete="off"></el-input>
      </el-form-item>
    </el-form>
    <div slot="footer" class="dialog-footer">
      <el-button @click="dialogFormVisible = false">取 消</el-button>
      <el-button v-if="sign === 'MODIFY'" type="primary" @click="submitForm('ruleForm')">修 改</el-button>
      <el-button v-if="sign === 'ADD'" type="primary" @click="submitForm('ruleForm')">新 增</el-button>
    </div>
  </el-dialog>
</div>
</template>

<script>
import bus from '../../bus.js'
export default {
  props: ['title', 'name', 'desc', 'sign'],
  data() {
    return {
      dialogFormVisible: true,
      ruleForm: {
        name: '',
        desc: ''
      },
      rules: {
        name: [{
          required: true,
          message: '请输入机构名称',
          trigger: 'blur'
        }]
      }
    }
  },
  created() {
    if (this.name) { // 判断是修改还是新增
      this.ruleForm.name = this.name
      this.ruleForm.desc = this.desc
      return false
    }
  },
  methods: {
    submitForm(formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          // 像父组件传递机构名称和机构描述
          bus.$emit('change-tree', this.ruleForm)
          bus.$off('change-tree')
          this.dialogFormVisible = false
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
