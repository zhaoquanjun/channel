<template>
  <el-dialog title="创建公告" :visible.sync="dialogFormVisible" size="small">
    <div class="make-notice">
      <el-form :model="ruleForm" class="demo-ruleForm" ref="ruleForm" :rules="rules" label-width="120px">
        <el-form-item label="标题：" prop="Title">
          <el-input type="text" v-model="ruleForm.Title" :maxlength="50"></el-input>
        </el-form-item>
        <el-form-item label="正文：" required>
          <pre><el-input class="notice-textarea" type="textarea" v-model="ruleForm.Text" :rows=12 :maxlength="1000"></el-input></pre>
          <span class="notice-text">{{ruleForm.Text.length}}/1000</span>
        </el-form-item>
        <el-form-item label="公告范围：" required>
          <noticemodel></noticemodel>
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
import Noticemodel from '@/components/noticeRound.vue'
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
          { min: 3, max: 50, message: '长度在 3 到 5 个字符', trigger: 'blur' }
        ],
        EndDate: [
          { type: 'date', required: true, message: '请选择公告截止日期', trigger: 'change' }
        ]
      }
    }
  },
  components: {
    noticemodel: Noticemodel
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
