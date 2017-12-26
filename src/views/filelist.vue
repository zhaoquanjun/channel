<template>
  <div class="file-list">
    <h3 class="vheader">
      {{title}}
      <span class="back-last" @click="goBackHome"><<返回首页</span>
    </h3>
    <div class="vsearch">
      <el-form ref="params" :inline="true" :model="params" label-width="80px">
        <el-form-item label="">
          <el-input placeholder="搜索文件名" v-model="params.filename"></el-input>
        </el-form-item>
        <el-form-item label="">
          <el-select v-model="params.type " clearable placeholder="按上传日期倒序">
            <el-option v-for="data in types" :key="data.type" :label="data.name" :value="data.type">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="fetchData">查询</el-button>
        </el-form-item>
        <el-form-item class="uploader-file-btn" v-if="category === 1">
          <el-button type="primary" @click="uploaderFile">上传文件</el-button>
        </el-form-item>
      </el-form>
    </div>
    <el-table :data="tableData" style="width: 100%">
      <el-table-column prop="FileName" label="文件名" min-width="180"></el-table-column>
      <el-table-column v-if="category === 1" prop="" label="可见范围" min-width="180">
        <template scope="scope">
          <div v-if="scope.row.ChannelRoleNames && scope.row.CenterRoleNames" :title="scope.row.CenterRoleNames + '；' +scope.row.ChannelRoleNames">
            <span>{{scope.row.CenterRoleNames}}</span>
            <span>；</span>
            <span>{{scope.row.ChannelRoleNames}}</span>
          </div>
          <div v-if="!scope.row.ChannelRoleNames && scope.row.CenterRoleNames" :title="scope.row.CenterRoleNames">
            <span>{{scope.row.CenterRoleNames}}</span>
          </div>
          <div v-if="scope.row.ChannelRoleNames && !scope.row.CenterRoleNames" :title="scope.row.ChannelRoleNames">
            <span>{{scope.row.ChannelRoleNames}}</span>
          </div>
        </template>
      </el-table-column>
      <el-table-column prop="FileSize" label="大小" width="80"></el-table-column>
      <el-table-column prop="CreateDate" label="上传日期" width="120"></el-table-column>
      <el-table-column v-if="category === 1" label="操作" width="250">
        <template scope="scope">
          <el-button @click="download(scope.row)" type="text" size="small">下载</el-button>
          <el-button v-if="!scope.row.IsOften" @click="setOften(scope.row)" type="text" size="small">设为常用</el-button>
          <el-button v-if="scope.row.IsOften" @click="setOften(scope.row)" type="text" size="small">取消常用</el-button>
          <el-button @click="setRound(scope.row)" type="text" size="small">设置可见范围</el-button>
          <el-button @click="deleteItem(scope.row)" type="text" size="small">删除</el-button>
        </template>
      </el-table-column>
      <el-table-column v-if="category === 0" label="操作" width="100">
        <template scope="scope">
          <el-button @click="download(scope.row)" type="text" size="small">下载</el-button>
        </template>
      </el-table-column>
    </el-table>
    <el-pagination @size-change="handleSizeChange" @current-change="handleCurrentChange" :current-page="pagination.currentPage" :page-sizes="[10, 20, 30]" :page-size="pagination.pageSize" layout="total, sizes, prev, pager, next, jumper" :total="pagination.total"
      style="text-align:center; margin:20px;">
    </el-pagination>
  </div>
</template>

<script>
import {
  getdoclist,
  updatedocisoften,
  deletedoc
} from '@/api/api'
import Dialog from '@/service/dialog.js'
import FileSetRound from '@/views/components/fileSetRound'
import FileUploader from '@/components/fileUploader'
export default {
  data() {
    return {
      pagination: {
        total: 0,
        pageSize: 10,
        currentPage: 1
      },
      tableData: [],
      types: [{
        type: 1,
        name: '按上传日期倒序'
      }, {
        type: 2,
        name: '按文件名称升序'
      }],
      title: '',
      category: '',
      params: {
        filename: '',
        type: 1 // type 0 管理员首页 type 1 时间排序 type2 名称排序
      }
    }
  },
  mounted() {
    this.title = this.$route.query.title
    this.category = +this.$route.query.category
    console.log(this.category, typeof (this.category))
  },
  created() {
    this.fetchData()
  },
  methods: {
    goBackHome() {
      this.$router.push({name: 'Main'})
    },
    fetchData() {
      let limit = this.pagination.pageSize
      let offset = (this.pagination.currentPage - 1) * limit
      getdoclist({
        limit: limit,
        offset: offset,
        filename: this.params.filename,
        type: this.params.type
      }).then((res) => {
        this.tableData = res.data
        this.pagination.total = res.Count
      })
    },
    uploaderFile() {
      Dialog(FileUploader, {
        uploadSign: true
      }).then(() => {
        this.fetchData()
      })
    },
    download(row) {
      // var url = row.FilePath
      var id = row.Id
      // var url = 'https://pilipa.oss-cn-beijing.aliyuncs.com/FileUploads/File/201712/4BSQQ6wTeh.pptx'
      var url = 'api/doc/downloadfile?id=' + id
      window.open(url)
    },
    setOften(row) {
      console.log(row)
      var isoften = row.IsOften ? 0 : 1
      updatedocisoften(isoften, row.Id).then((res) => {
        if (res.status) {
          if (row.IsOften) {
            this.$message({
              type: 'success',
              message: '取消常用'
            })
          } else {
            this.$message({
              type: 'success',
              message: '已设为常用'
            })
          }
          this.fetchData()
        }
      })
    },
    setRound(row) {
      Dialog(FileSetRound, {
        row: row
      }).then(() => {
        this.fetchData()
      })
    },
    deleteItem(row) {
      var str = '确定删除文件吗？删除后，发布方和接收方都将不再显示该文件。'
      this.$confirm(str, '删除文件', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        deletedoc(row.Id).then(res => {
          if (res.status) {
            this.$message({
              type: 'success',
              message: '删除成功!'
            })
            this.fetchData()
          }
        })
      }).catch(() => {})
    },
    handleSizeChange(val) {
      this.pagination.pageSize = val
      this.fetchData()
    },
    handleCurrentChange(val) {
      this.pagination.currentPage = val
      this.fetchData()
    }
  }
}
</script>

<style lang="stylus">
.file-list
  .vheader
    border-bottom: none
    margin-bottom: 20px
  .back-last
    font-size: 12px
    font-weight: normal
    padding-left: 10px
    cursor: pointer
    &:hover
      color: #1b9bfc
  .data-sign
    font-size: 12px
    color: red
    border: 1px solid red
  .el-table .cell
    overflow: hidden
    white-space: nowrap
    text-overflow: ellipsis
    text-align: center
    div
      overflow: hidden
      white-space: nowrap
      text-overflow: ellipsis
      cursor: pointer
  .list-item
    height: 30px
    line-height: 30px
    margin: 10px 25px
    border-bottom: 1px solid #ccc
  .other-style
    .list-item-other
      padding: 15px 25px
      border-bottom: 1px solid #ccc
      clear: both
      overflow: hidden
      .detail-item:hover
        color: #1b9bfc
        cursor: pointer
      .data-sign
        font-size: 14px
        border-radius: 4px
      .date-float
        float: right
        color: #969696
      span
        float: left
</style>
