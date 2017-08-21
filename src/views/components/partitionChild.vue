<template>
<div class="partition-child">
  <el-dialog :title="title" :visible.sync="dialogFormVisible" size="tiny">
    <el-form :model="ruleForm" class="demo-ruleForm" label-width="100px">
      <el-form-item label="大区名称" required>
        <el-input v-model="ruleForm.PartitionName" auto-complete="off" class="moneyWid" :disabled="canChange"></el-input>
      </el-form-item>
      <el-form-item label="管辖省份" required>
        <el-input v-model="ruleForm.ProvinceName" auto-complete="off" class="moneyWid" :disabled="canChange"></el-input>
      </el-form-item>
    </el-form>
    <div slot="footer" class="dialog-footer">
      <el-button v-if="sign === 'SCAN'" @click="dialogFormVisible = false">取 消</el-button>
      <el-button v-if="sign === 'SCAN'" type="primary" @click="submitForm('ruleForm')">保 存</el-button>
      <el-button v-if="sign === 'MODIFY'" type="primary" @click="dialogFormVisible = false">关 闭</el-button>
    </div>
  </el-dialog>
</div>
</template>

<script>
export default {
  props: ['row', 'sign'],
  data: function() {
    return {
      dialogFormVisible: true,
      ruleForm: '',
      title: '',
      canChange: false
    }
  },
  created() {
    if (this.sign === 'SCAN') {
      this.title = '查看大区'
      this.canChange = true
    } else if (this.sign === 'MODIFY') {
      this.title = '修改大区'
      this.canChange = false
    }
    this.ruleForm = this.row
  }
}
</script>

<style scoped>
</style>
