<template>
<div class="partition">
  <h3 class="vheader">大区管理</h3>
  <div class="vsearch">
    <el-form ref="params" :inline="true" :model="params">
      <el-form-item label="大区">
        <el-autocomplete class="inline-input" v-model="params.partitionName" :trigger-on-focus="false" :fetch-suggestions="querySearch"></el-autocomplete>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="fetchData">查询</el-button>
        <el-button type="primary" @click="addPartition()">添加分区</el-button>
      </el-form-item>
    </el-form>
  </div>
  <el-table :data="tableData" border style="width: 100%">
    <el-table-column type="index" width="80" label="序号"></el-table-column>
    <el-table-column prop="PartitionName" width="150" label="大区"></el-table-column>
    <el-table-column prop="ProvinceName" label="管辖省份"></el-table-column>
    <el-table-column label="操作" align="center" width="200">
      <template scope="scope">
        <el-button @click="scan(scope.row)" type="text" size="small">查看</el-button>
        <el-button @click="modify(scope.row)" type="text" size="small">修改</el-button>
      </template>
    </el-table-column>
  </el-table>
</div>
</template>

<script>
import {
  getPartitions
  // getPartitionsList
} from '@/api/api'
import Dialog from '../service/dialog.js'
import partitionChild from './components/partitionChild'
export default {
  data: function() {
    return {
      pagination: {
        total: 0,
        pageSize: 10,
        currentPage: 1
      },
      tableData: [
        {'PartitionName': '华北大区', 'ProvinceName': '河北省,河南省'},
        {'PartitionName': '华北大区', 'ProvinceName': '河北省,河南省,辽宁省'}
      ],
      params: {
        partitionName: ''
      },
      partitions: []
    }
  },
  created() {
    this.getPartitions()
    this.fetchData()
  },
  methods: {
    fetchData() {
      let limit = this.pagination.pageSize
      let offset = (this.pagination.currentPage - 1) * limit
      let partitionId = this.handlepartitionsSearch(this.params.partitionName) || 0
      console.log(limit, offset, partitionId)
      // getPartitionsList({
      //   limit: limit,
      //   offset: offset,
      //   partitionId: partitionId
      // }).then((res) => {
      //   this.tableData = res.data
      //   this.pagination.total = res.Count
      // })
    },
    getPartitions() {
      getPartitions().then((res) => {
        this.partitions = res.data
        for (let i in this.partitions) {
          this.partitions[i].Id = this.partitions[i].Id + ''
          this.partitions[i].value = this.partitions[i].PartitionName
        }
      })
    },
    scan(row) {
      console.log(row)
      Dialog(partitionChild, {
        row: row,
        sign: 'SCAN'
      })
    },
    modify(row) {
      console.log(row)
      Dialog(partitionChild, {
        row: row,
        sign: 'MODIFY'
      })
    },
    handlepartitionsSearch(param) { // 处理查询时要传给后台大区ID
      for (let i in this.partitions) {
        console.log(this.partitions[i].PartitionName, param, this.partitions[i].PartitionName === param)
        if (this.partitions[i].PartitionName === param) {
          return this.partitions[i].Id
        }
      }
    },
    querySearch(queryString, cb) {
      var partitions = this.partitions
      var results = queryString ? partitions.filter(this.createFilter(queryString)) : partitions
      cb(results)
    },
    createFilter(queryString) {
      return (partition) => {
        return (partition.value.indexOf(queryString) >= 0)
      }
    }
  }
}
</script>

<style scoped>
</style>
