<template>
  <el-dialog title="上传文件" :visible.sync="dialogTableVisible" size="small">
    <div class="file-uploader">
      <el-form :model="ruleForm" class="demo-ruleForm" ref="ruleForm" label-width="85px">
        <el-form-item label="可见范围：" prop="PartitionName">
          <el-input type="text" v-model="ruleForm.VisualRange"></el-input>
        </el-form-item>
      </el-form>
      <el-upload
        class="upload-area"
        :auto-upload="true">
        <el-button type="primary" @click="addFile">添加文件</el-button>
        <span class="file-declare">单个文件最大4M，支持word、excel、ppt、pdf格式</span>
        <el-table :data="fileLists">
          <el-table-column property="fileName" label="文件名" min-width="150"></el-table-column>
          <el-table-column property="fileSize" label="大小" width="80"></el-table-column>
          <el-table-column label="操作" width="80">
            <template scope="scope">
              <el-button @click="deleteFile(scope.row)" type="text" size="small">删除</el-button>
            </template>
          </el-table-column>
          <el-table-column label="状态" width="80">
            <template scope="scope">
              <span><i class="el-icon-check"></i></span>
              <span><i class="el-icon-close"></i></span>
              <span><i class="el-icon-loading"></i></span>
            </template>
          </el-table-column>
        </el-table>
        <el-button @click="dialogTableVisible = false">关 闭</el-button>
        <el-button type="primary" @click="submitForm">上 传</el-button>
      </el-upload>
    </div>
  </el-dialog>
</template>

<script>
export default {
  data() {
    return {
      dialogTableVisible: true,
      ruleForm: {
        VisualRange: ''
      },
      fileLists: [
        {fileName: 'aaaaaaa', fileSize: '22M', status: 1},
        {fileName: 'aaaaaaa', fileSize: '22M', status: 1},
        {fileName: 'aaaaaaa', fileSize: '22M', status: 1}
      ]
    }
  },
  methods: {
    addFile() {
      console.log('添加文件')
    },
    submitForm() {
      console.log('上传')
    }
  }
}
</script>

<style lang="stylus">
.file-uploader
  .el-form-item__label
    text-align: left
  .file-declare
    padding-left: 10px
    color: #ccc
  .upload-area
    .el-upload
      width: 100%
</style>
