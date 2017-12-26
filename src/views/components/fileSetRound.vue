<template>
  <el-dialog title="设置可见范围" :visible.sync="dialogFormVisible" size="small">
    <el-form :model="ruleForm" class="demo-ruleForm" ref="ruleForm" label-width="120px">
      <el-form-item label="可见范围：" required>
        <noticemodel></noticemodel>
      </el-form-item>
    </el-form>
    <div slot="footer" class="dialog-footer">
      <el-button @click="dialogFormVisible = false">取 消</el-button>
      <el-button type="primary" @click="submitForm('ruleForm')">确 定</el-button>
    </div>
  </el-dialog>
</template>

<script>
import { updateDocScope } from '@/api/api'
import Noticemodel from '@/components/noticeRound.vue'
import bus from '@/bus'
export default {
  props: ['row'],
  data() {
    return {
      dialogFormVisible: true,
      ruleForm: {}
    }
  },
  created() {
    console.log(this.row)
    this.ruleForm = this.row
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
          if (this.ruleForm.CenterRoles === '' && this.ruleForm.ChannelRoles === '') {
            this.$message({
              message: '请设置可见范围',
              type: 'warning'
            })
            return
          }
          updateDocScope(this.ruleForm.CenterRoles, this.ruleForm.ChannelRoles, this.row.Id).then((res) => {
            if (res.status) {
              this.$message({
                type: 'success',
                message: '设置成功'
              })
              this.$emit('done')
              this.dialogFormVisible = false
            }
          })
        } else {
          return false
        }
      })
    }
  },
  components: {
    noticemodel: Noticemodel
  }
}
</script>

<style lang="stylus" scoped>
</style>
