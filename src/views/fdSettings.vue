<template>
<div>
  <h3 class="vheader">返点设置</h3>
  <div class="vsearch">
    <el-form ref="params" :inline="true" :model="params" label-width="120px">
      <el-form-item label="最低达成率(%)">
        <el-input v-model="params.LowRate"></el-input>
      </el-form-item>
      <el-form-item label="最高达成率(%)">
        <el-input v-model="params.HeighRate"></el-input>
      </el-form-item>
      <el-form-item label="返点(%)">
        <el-input v-model="params.RebatesRatio"></el-input>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="add">增加设置</el-button>
      </el-form-item>
    </el-form>
  </div>
  <el-table :data="tableData" border style="width: 100%">
    <el-table-column prop="LowRate" :formatter="data1Format" label="最低达成率(≥)">
    </el-table-column>
    <el-table-column prop="HeighRate" :formatter="data2Format" label="最高达成率(<)">
    </el-table-column>
    <el-table-column prop="RebatesRatio" :formatter="data3Format" label="返点">
    </el-table-column>
    <el-table-column label="操作">
      <template scope="scope">
          <el-button @click="deleteItem(scope.row)" type="text" size="small">删除</el-button>
        </template>
    </el-table-column>
  </el-table>
</div>
</template>

<script>
import {
  codereward,
  addCodereward,
  deleteItem
} from '../api/api'
export default {
  data() {
    return {
      params: {
        LowRate: '',
        HeighRate: '',
        RebatesRatio: ''
      },
      tableData: []
    }
  },
  created() {
    this.fetchData()
  },
  methods: {
    fetchData() {
      codereward().then((res) => {
        this.tableData = res.data
      })
    },
    add() {
      let item = {
        HeighRate: this.params.HeighRate,
        LowRate: this.params.LowRate,
        RebatesRatio: this.params.RebatesRatio
      }
      addCodereward(item).then(() => {
        this.fetchData()
      })
    },
    data1Format(row, column) {
      // console.log(row, column)
      var LowRate = row.LowRate + '%'
      return LowRate
    },
    data2Format(row) {
      var HeighRate = row.HeighRate + '%'
      return HeighRate
    },
    data3Format(row) {
      var RebatesRatio = row.RebatesRatio + '%'
      return RebatesRatio
    },
    deleteItem(row) {
      this.$confirm('您确定要删除?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        deleteItem(row.Id).then(res => {
          if (res.status) {
            this.$message({
              type: 'success',
              message: '删除成功!'
            })
            this.fetchData()
          }
        })
      }).catch(() => {})
    }
  }
}
</script>

<style scoped>
</style>
