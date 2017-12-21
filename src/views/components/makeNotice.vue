<template>
  <el-dialog title="创建公告" :visible.sync="dialogFormVisible" size="small">
    <div class="make-notice">
      <el-form :model="ruleForm" class="demo-ruleForm" ref="ruleForm" :rules="rules" label-width="120px">
        <el-form-item label="标题：" prop="Title">
          <el-input type="text" v-model="ruleForm.Title" :maxlength="50"></el-input>
        </el-form-item>
        <el-form-item label="正文：" required>
          <pre><el-input class="notice-textarea" type="textarea" v-model="ruleForm.Text" :rows=12 :maxlength="1000"></el-input></pre>
          <span v-if="+ruleForm.Text.length !== 1000" class="notice-text">{{ruleForm.Text.length}}/1000</span>
          <span v-if="+ruleForm.Text.length === 1000" class="notice-text"><span style="color: red">{{ruleForm.Text.length}}</span>/1000</span>
        </el-form-item>
        <el-form-item label="公告范围：" required>
          <noticemodel :top="true"></noticemodel>
        </el-form-item>
        <el-form-item label='公告截止到：' prop="EndDate">
          <el-date-picker v-model="ruleForm.EndDate" type="date" placeholder="开始日期" :clearable="false"></el-date-picker>
        </el-form-item>
      </el-form>
    </div>
    <div slot="footer" class="dialog-footer">
      <el-button @click="dialogFormVisible = false">取 消</el-button>
      <el-button type="primary" @click="submitForm('ruleForm')">发 布</el-button>
    </div>
  </el-dialog>
</template>

<script>
import { insertnotice } from '@/api/api'
import Noticemodel from '@/components/noticeRound.vue'
import bus from '@/bus'
// import router from '@/router'
export default {
  data() {
    return {
      dialogFormVisible: true,
      ruleForm: {
        Title: '',
        Text: '',
        CenterRoles: '',
        ChannelRoles: '',
        EndDate: ''
      },
      rules: {
        Title: [
          { required: true, message: '请输入公告标题', trigger: 'blur' },
          { min: 1, max: 50, message: '长度最多50个字符', trigger: 'blur' }
        ],
        EndDate: [
          { type: 'date', required: true, message: '请选择公告截止日期', trigger: 'change' }
        ]
      }
    }
  },
  components: {
    noticemodel: Noticemodel
  },
  created() {
    bus.$on('selectedRound', (selectdObj) => {
      console.log(selectdObj, 'selectdObj')
      this.ruleForm.CenterRoles = selectdObj.CenterRoles
      this.ruleForm.ChannelRoles = selectdObj.ChannelRoles
    })
  },
  methods: {
    submitForm(formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          console.log(this.ruleForm, 'ruleForm')
          if (!this.ruleForm.Text) {
            this.$message({
              message: '请填写公告正文',
              type: 'warning'
            })
            return
          }
          if (this.ruleForm.CenterRoles === '' && this.ruleForm.CenterRoles === '') {
            this.$message({
              message: '请设置可见范围',
              type: 'warning'
            })
            return
          }
          insertnotice(this.ruleForm).then((res) => {
            if (res.status) {
              this.$message({
                type: 'success',
                message: '发布成功'
              })
              // var obj = {
              //   title: '公告管理',
              //   category: 1
              // }
              // router.push({name: 'InfoList', query: obj})
              this.$emit('done')
              this.dialogFormVisible = false
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

<style lang="stylus">
.make-notice
  .notice-textarea.el-textarea
    border: 1px solid #bfcbd9
    border-radius: 4px
    .el-textarea__inner
      margin-bottom: 20px
      border-bottom: none
  .notice-text
    position: absolute
    right: 30px
    top: 268px
</style>
