<template>
<div class="promotion-child">
  <div class="vsearch">
    <el-form ref="params" :inline="true" :model="params">
      <el-form-item label="活动名称">
        <el-input v-model="params.name"></el-input>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="fetchData">查询</el-button>
        <el-button @click="addPromotion" type="primary">添加活动</el-button>
      </el-form-item>
    </el-form>
  </div>
  <el-table :data="tableData" border style="width: 100%">
    <el-table-column prop="PromotionName" label="活动名称" min-width="120"></el-table-column>
    <el-table-column prop="Num" label="数量"></el-table-column>
    <el-table-column prop="StartDate" label="开始日期" :formatter="StatusStartDate"></el-table-column>
    <el-table-column prop="EndDate" label="结束日期" :formatter="StatusDate"></el-table-column>
    <el-table-column label="操作" >
      <template scope="scope">
        <el-button @click="updateItem(scope.row)" type="text" size="small">修改</el-button>
        <el-button @click="deleteItem(scope.row)" type="text" size="small">删除</el-button>
      </template>
    </el-table-column>
  </el-table>
</div>
</template>

<script>
import { getgloblepromotionlist, getchannelpromotionlist, deletepromotion, deletechannelpromotion } from '@/api/api'
import Dialog from '@/service/dialog.js'
import AddPromotion from '@/components/addPromotion'
export default {
  props: ['commonPromotion', 'id'],
  data() {
    return {
      params: {
        name: ''
      },
      tableData: []
    }
  },
  created() {
    this.fetchData()
    console.log(this.id)
  },
  methods: {
    fetchData() {
      let name = this.params.name
      if (this.commonPromotion) {
        getgloblepromotionlist({
          name: name
        }).then((res) => {
          console.log(res)
          this.tableData = res.data
          for (let i in this.tableData) {
            this.tableData[i].value = this.tableData[i].PromotionName
          }
        })
      } else {
        let channelid = this.id
        getchannelpromotionlist({
          name: name,
          channelid: channelid
        }).then((res) => {
          this.tableData = res.data
          for (let i in this.tableData) {
            this.tableData[i].value = this.tableData[i].PromotionName
          }
        })
      }
    },
    addPromotion() {
      var channelid = this.id
      Dialog(AddPromotion, {
        title: '添加活动',
        commonPromotion: this.commonPromotion,
        channelid: channelid,
        modify: false
      }).then(res => this.fetchData())
    },
    updateItem(row) {
      // var Id = row.Id ? row.Id : row.ConfigId
      var channelid = row.ChannelId
      Dialog(AddPromotion, {
        title: '修改活动',
        commonPromotion: this.commonPromotion,
        IsGloble: row.IsGloble,
        Id: row.Id,
        ConfigId: row.ConfigId,
        channelid: channelid,
        modify: true
      }).then(res => this.fetchData())
    },
    deleteItem(row) {
      console.log(row.ConfigId, row.IsGloble === 1) // 代理商活动且是通用
      this.$confirm('确认删除该活动吗？', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        if (row.ConfigId && row.IsGloble === 1) {
          deletechannelpromotion(row.ConfigId).then(res => {
            if (res.status) {
              this.$message({
                type: 'success',
                message: '删除成功!'
              })
              this.fetchData()
            }
          })
        } else {
          deletepromotion(row.Id).then(res => {
            if (res.status) {
              this.$message({
                type: 'success',
                message: '删除成功!'
              })
              this.fetchData()
            }
          })
        }
      }).catch(() => {})
    },
    StatusStartDate(row) {
      var date = row.StartDate
      return date.substring(0, 10)
    },
    StatusDate(row) {
      var date = row.EndDate
      return date.substring(0, 10)
    }
  }
}
</script>

<style scoped>
</style>
