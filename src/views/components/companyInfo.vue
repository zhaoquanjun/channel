<template>
<div>
  <el-dialog title="同步官方" :visible.sync="dialogFormVisible" size="small">
    <el-form :model="ruleForm" :rules="rules" class="demo-ruleForm" ref="ruleForm" label-width="0px">
      <el-form-item label="" prop="path">
        <el-input type="text" v-model="ruleForm.path" placeholder="请输入该公司在国家企业信息公示系统的链接地址"></el-input>
        <span class="href-style">打开链接：</span>
        <a class="href-style" href="http://www.gsxt.gov.cn/index.html" target="view_window">http://www.gsxt.gov.cn/index.html</a>
      </el-form-item>
    </el-form>
    <div slot="footer" class="dialog-footer">
      <el-button @click="dialogFormVisible = false">取 消</el-button>
      <el-button type="primary" @click="submitForm('ruleForm')">同步更新</el-button>
    </div>
  </el-dialog>
</div>
</template>

<script>
import {
  getcustomerupdatebygs
} from '../../api/api'

export default {
  data() {
    return {
      dialogFormVisible: true,
      ruleForm: {
        path: ''
      },
      rules: {
        path: [{
          required: true,
          message: '请输入该公司在国家企业信息公示系统的链接地址',
          trigger: 'blur'
        }]
      }
    }
  },
  methods: {
    submitForm(formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          getcustomerupdatebygs(this.ruleForm.path).then((res) => {
            if (res.status) {
              // console.log(this)
              if (res.data) {
                var companyData = res.data
                console.log(companyData, 'companyData')
                this.$emit('done', companyData)
                this.dialogFormVisible = false
              } else {
                this.$emit('done')
                this.dialogFormVisible = false
              }
            }
          })
        } else {
          return false
        }
      })
    }
  }
}
</script>

<style scoped>
.href-style {
  color: #20a0ff;
}
</style>
