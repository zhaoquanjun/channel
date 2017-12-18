<template>
  <div class="info-list">
    <h3 class="vheader">
      {{title}}
      <span class="back-last" @click="goBackHome"><<返回首页</span>
    </h3>
    <div v-if="+category === 1" class="vsearch">
      <el-form ref="params" :inline="true" :model="params" label-width="80px">
        <el-form-item label="">
          <el-input placeholder="搜索公告标题" v-model="params.title"></el-input>
        </el-form-item>
        <el-form-item label="">
          <el-select v-model="params.type " clearable placeholder="全部公告">
            <el-option v-for="data in types" :key="data.type" :label="data.name" :value="data.type">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="fetchData">查询</el-button>
        </el-form-item>
      </el-form>
    </div>
    <el-table v-if="+category === 1" :data="tableData" border style="width: 100%" @cell-click="sacnColumnDetail">
      <el-table-column prop="Title" label="公告标题" min-width="150">
        <template scope="scope">
          <span :style="{color: scope.row.IsOverdue ? '#ccc' : '', borderColor: scope.row.IsOverdue ? '#ccc' : ''}" class="data-sign" v-if="scope.row.IsNew">新</span>
          <span :style="{color: scope.row.IsOverdue ? '#ccc' : ''}">{{scope.row.Title}}</span>
        </template>
      </el-table-column>
      <el-table-column prop="" label="公告范围" min-width="150">
        <template scope="scope">
          <span :style="{color: scope.row.IsOverdue ? '#ccc' : ''}">{{scope.row.CenterRoleNames}}</span>
          <span :style="{color: scope.row.IsOverdue ? '#ccc' : ''}" v-if="scope.row.ChannelRoleNames">;</span>
          <span :style="{color: scope.row.IsOverdue ? '#ccc' : ''}" :title="scope.row.CenterRoleNames + ';' +scope.row.ChannelRoleNames">{{scope.row.ChannelRoleNames}}</span>
        </template>
      </el-table-column>
      <el-table-column prop="" label="发布日期" width="120">
        <template scope="scope">
          <span :style="{color: scope.row.IsOverdue ? '#ccc' : ''}">{{scope.row.CreateDate}}</span>
        </template>
      </el-table-column>
      <el-table-column label="操作" width="120">
        <template scope="scope">
          <el-button v-if="!scope.row.IsOverdue" @click="reback(scope.row)" type="text" size="small">撤回</el-button>
        </template>
      </el-table-column>
    </el-table>
    <div v-if="+category !== 1" class="other-style">
      <div class="list-item-other" v-for="list in tableData">
        <span class="data-sign" v-if="list.IsNew">新</span>
        <span class="detail-item" @click="goDetail(list.id)">{{list.Title}}</span>
        <span class="date-float">{{list.CreateDate}}</span>
      </div>
    </div>
    <el-pagination @size-change="handleSizeChange" @current-change="handleCurrentChange" :current-page="pagination.currentPage" :page-sizes="[10, 20, 30]" :page-size="pagination.pageSize" layout="total, sizes, prev, pager, next, jumper" :total="pagination.total"
      style="text-align:center; margin:20px;">
    </el-pagination>
  </div>
</template>

<script>
import {
  getnoticelist,
  deletenotice
} from '@/api/api'
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
        type: 0,
        name: '全部公告'
      }, {
        type: 1,
        name: '正在发布'
      }, {
        type: 2,
        name: '过期公告'
      }],
      title: '',
      category: '',
      params: {
        title: '',
        type: 0
      }
    }
  },
  mounted() {
    this.title = this.$route.query.title
    this.category = this.$route.query.category
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
      getnoticelist({
        limit: limit,
        offset: offset,
        title: this.params.title,
        type: this.params.type
      }).then((res) => {
        this.tableData = res.data
        this.pagination.total = res.Count
      })
    },
    reback(row) {
      var str = '确定撤回公告吗？撤回后，发布方和接收方都将不再显示该公告。'
      this.$confirm(str, '撤回公告', {
        confirmButtonText: '确定撤回',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        deletenotice(row.id).then(res => {
          if (res.status) {
            this.$message({
              type: 'success',
              message: '撤回公告成功！'
            })
            this.fetchData()
          }
        })
      }).catch(() => {})
    },
    sacnColumnDetail(row, column, cell) {
      var obj = {
        id: row.id
      }
      if (cell.cellIndex === 0) {
        this.$router.push({name: 'NoticeDetail', query: obj})
      } else {
        return
      }
    },
    goDetail(id) {
      var obj = {
        id: id
      }
      this.$router.push({name: 'NoticeDetail', query: obj})
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
.info-list
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
    cursor: pointer
  .list-item
    height: 30px
    line-height: 30px
    margin: 10px 25px
    border-bottom: 1px solid #ccc
  .el-table__body tr td:nth-child(1) .cell:hover
    cursor: pointer
    color: #1b9bfc
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
