<template>
<el-dialog title="导入任务" :visible.sync="dialogFormVisible" size="tiny">
  <div class="upload-task">
    <el-upload
      class="upload-area"
      ref="upload"
      accept="application/vnd.ms-excel	application/x-excel, application/vnd.openxmlformats-officedocument.spreadsheetml.sheet,"
      action="/api/addexceltask"
      :on-change="handleChange"
      :show-file-list="false"
      :auto-upload="false">
      <el-button type="primary">选择文件</el-button>
      <span>{{filename}}</span>
      <!-- <div class="task-btn">
        <el-button @click="dialogFormVisible = false">取 消</el-button>
        <el-button type="primary" @click="startUploadTask">确 定</el-button>
      </div> -->
    </el-upload>
  </div>
  <div slot="footer" class="dialog-footer">
    <el-button @click="dialogFormVisible = false">取 消</el-button>
    <el-button type="primary" @click="startUploadTask">确 定</el-button>
  </div>
</el-dialog>
</template>

<script>
export default {
  data() {
    return {
      dialogFormVisible: true,
      filename: '未选择文件',
      file: ''
    }
  },
  methods: {
    handleChange(file, fileList) {
      console.log(file, fileList)
      this.filename = file.name
      this.file = file
    },
    startUploadTask() {
      if (!this.file) {
        this.$message.error('请选择文件')
        return false
      }
      var formData = new FormData()
      var uploadUrl = '/api/addexceltask'
      console.log(this.file)
      formData.append('file', this.file.raw)
      console.log(formData)
      $.ajax({
        url: uploadUrl,
        type: 'POST',
        data: formData,
        processData: false,
        contentType: false
      }).then((res) => {
        console.log(res)
        if (res.status) {
          if (res.data) {
            var str = '以下代理商名称有误，请检查文件' + res.data
            this.$confirm(str, '导入失败', {
              // confirmButtonText: '确定',
              cancelButtonText: '确定',
              type: 'warning'
            }).then(() => {
              this.dialogFormVisible = false
            })
          } else {
            this.$message.success('导入成功！')
            this.dialogFormVisible = false
          }
        } else {
          this.$message.error('导入失败,请重试！')
        }
      })
    }
  }
}
</script>

<style lang="stylus">
.upload-task
  margin: 20px 0
  .upload-area .el-upload
    width: 100%;
    text-align: left;
  .upload-area .task-btn
    margin-top: 30px
    width: 100%
    text-align: right
</style>
