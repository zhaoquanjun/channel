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
        ref="upload"
        accept="application/msword, application/vnd.openxmlformats-officedocument.wordprocessingml.document, application/vnd.ms-excel	application/x-excel, application/vnd.openxmlformats-officedocument.spreadsheetml.sheet, application/vnd.ms-powerpoint, application/vnd.openxmlformats-officedocument.presentationml.presentation, application/pdf"
        action=""
        :on-change="handleChange"
        :show-file-list="false"
        :auto-upload="false"
        :multiple="true">
        <el-button slot="trigger" type="primary">添加文件</el-button>
        <span class="file-declare">单个文件最大4M，支持word、excel、ppt、pdf格式</span>
        <el-table :data="fileList">
          <el-table-column property="name" label="文件名" min-width="150"></el-table-column>
          <el-table-column property="filesize" label="大小" width="80"></el-table-column>
          <el-table-column label="操作" width="80">
            <template scope="scope">
              <el-button @click="deleteFile(scope.row)" type="text" size="small" :disabled="canDelete">删除</el-button>
            </template>
          </el-table-column>
          <el-table-column label="状态" width="80">
            <template scope="scope">
              <span>{{scope.row.showIcon}}a</span>
              <span v-if="scope.row.showIcon === 2"><i class="el-icon-check"></i></span>
              <span v-if="scope.row.showIcon === 3"><i class="el-icon-close"></i></span>
              <span v-if="scope.row.showIcon === 1"><i class="el-icon-loading"></i></span>
            </template>
          </el-table-column>
        </el-table>
        <el-button @click="dialogTableVisible = false">关 闭</el-button>
        <el-button v-if="!isloading" type="primary" @click="submitUpload">上 传</el-button>
        <el-button v-else type="primary" @click="submitUpload" :loading="true">上传中...</el-button>
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
      fileList: [],
      canDelete: false,
      isloading: false
    }
  },
  methods: {
    handleChange(file, fileList) {
      // console.log(file, fileList)
      // var list = fileList
      this.handleFileSize(fileList)
      this.fileList = fileList
      // console.log(this.fileList)
    },
    handleFileSize(list) {
      for (var i in list) {
        var size = list[i].size
        var a = size / 1024
        // console.log(a)
        if (a < 1) {
          size = 1 + 'K'
        } else if (a > 1 && a < 1024) {
          size = a.toFixed(0) + 'K'
        } else {
          a = a / 1024
          size = a.toFixed(1) + 'M'
        }
        list[i].filesize = size
        list[i].showIcon = 0
      }
    },
    deleteFile(row) {
      // console.log(row)
      window._.remove(this.fileList, (item) => {
        // console.log(item.name, row.name, item.name === row.name)
        return item.name === row.name
      })
      // console.log(this.fileList, 'this.fileList')
      this.fileList = $.extend(true, [], this.fileList)
    },
    submitUpload() {
      for (var j in this.fileList) {
        var fileSize = this.fileList[j].size / 1024 / 1024
        if (fileSize > 4) {
          this.$message.error('上传文件大小不能超过4M！请删除大小超过4M的文件后再上传！')
          return false
        }
      }
      var _self = this
      if (this.fileList.length === 0) return
      this.canDelete = true
      this.isloading = true
      this.fileList.forEach((item, i) => {
        this.fileList[i].showIcon = 1
        _self.$ossUploader(this.fileList[i].raw, 5).then(res => {
          if (res.status === 200) {
            this.fileList[i].url = res.sourceUrl
            this.fileList[i].showIcon = 2
          } else {
            this.fileList[i].showIcon = 3
          }
        })
      })
      this.fileList = $.extend(true, [], this.fileList)
      console.log(this.fileList, 'this.fileList')
      // setTimeout(() => {
      this.dialogTableVisible = false
      // }, 1000)
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
      text-align: left
    .el-table
      margin: 20px 0
</style>
