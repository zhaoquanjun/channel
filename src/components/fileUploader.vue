<template>
  <el-dialog title="上传文件" :visible.sync="dialogTableVisible" size="small">
    <div class="file-uploader">
      <el-form :model="ruleForm" class="demo-ruleForm" ref="ruleForm" label-width="85px">
        <el-form-item label="可见范围：">
          <noticemodel :top="false"></noticemodel>
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
              <span v-if="scope.row.showIcon === 2"><i class="el-icon-check"></i></span>
              <span v-if="scope.row.showIcon === 3"><i class="el-icon-close"></i></span>
              <span v-if="scope.row.showIcon === 1"><i class="el-icon-loading"></i></span>
            </template>
          </el-table-column>
        </el-table>
        <div class="btn">
          <el-button @click="dialogTableVisible = false">取 消</el-button>
          <el-button v-if="!isloading" type="primary" @click="submitUpload">上 传</el-button>
          <el-button v-else type="primary" @click="submitUpload" :loading="true">上传中...</el-button>
        </div>
      </el-upload>
    </div>
  </el-dialog>
</template>

<script>
import { insertdoc } from '@/api/api'
import Noticemodel from '@/components/noticeRound.vue'
import router from '@/router'
import bus from '@/bus'
export default {
  props: ['uploadSign'],
  data() {
    return {
      dialogTableVisible: true,
      ruleForm: {
        CenterRoles: '',
        ChannelRoles: ''
      },
      fileList: [],
      canDelete: false,
      isloading: false
    }
  },
  created() {
    bus.$on('selectedRound', (selectdObj) => {
      console.log(selectdObj, 'selectdObj')
      this.ruleForm.CenterRoles = selectdObj.CenterRoles
      this.ruleForm.ChannelRoles = selectdObj.ChannelRoles
    })
  },
  methods: {
    handleChange(file, fileList) {
      this.handleFileSize(fileList)
      this.fileList = fileList
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
          this.$message.error('文件大小超过限制，请删除大于4M的文件！')
          return false
        }
      }
      var _self = this
      if (this.fileList.length === 0) return
      this.canDelete = true
      this.isloading = true
      var count = 0
      this.fileList.forEach((item, i) => {
        this.fileList[i].showIcon = 1
        _self.$ossUploader(this.fileList[i].raw, 5).then(res => {
          console.log(res)
          count += 1
          if (res.status === 200) {
            this.fileList[i].FilePath = res.sourceUrl
            this.fileList[i].showIcon = 2
            console.log(this.fileList[i], 'this.fileList[i]')
            this.filterPostData(this.fileList[i])
            // var lastList = []
            // lastList[0] = this.fileList[i]
            if (count === this.fileList.length) {
              this.addFile(this.fileList)
            }
            // this.addFile(lastList, this.fileList.length)
          } else {
            this.fileList[i].showIcon = 3
          }
        })
      })
      this.fileList = $.extend(true, [], this.fileList)
      console.log(this.fileList, 'this.fileList')
      // setTimeout(() => {
      // this.dialogTableVisible = false
      // }, 1000)
    },
    filterPostData(list) {
      list.FileName = list.name
      list.FileSize = list.filesize
      list.CenterRoles = this.ruleForm.CenterRoles
      list.ChannelRoles = this.ruleForm.ChannelRoles
      delete list.filesize
      delete list.name
      delete list.percentage
      delete list.raw
      delete list.showIcon
      delete list.size
      delete list.status
      delete list.uid
      delete list.url
    },
    addFile(list) {
      console.log(list, '提交list')
      insertdoc(list).then((res) => {
        console.log(res)
        if (res.status) {
          var obj = {
            title: '文档列表',
            category: 1
          }
          console.log(this.uploadSign)
          if (this.uploadSign) {
            this.$emit('done')
            this.dialogTableVisible = false
          } else {
            router.push({name: 'Filelist', query: obj})
            this.dialogTableVisible = false
          }
        }
      })
    }
  },
  components: {
    noticemodel: Noticemodel
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
      text-align: left
    .el-table
      margin: 20px 0
      tr
        text-align: center;
    .btn
      float: right
      margin: 10px 0 20px
</style>
