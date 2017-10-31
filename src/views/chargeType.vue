<template>
<div class="charge-type">
  <h3 class="vheader">充值类型设置</h3>
  <div class="charge-con">
    <div class="con-item" v-for="record in records">
      <el-input :class="{active : record.isModify}" v-model="record.RechargeName" :disabled="record.isModify"></el-input>
      <el-button v-if="!record.showSave" @click="modify(record)" type="text" size="small">修改</el-button>
      <el-button v-else @click="save(record)" type="text" size="small">保存</el-button>
      <el-button @click="deleteItem(record)" type="text" size="small">删除</el-button>
    </div>
    <div class="charge-border"></div>
    <el-form :inline="true">
      <el-form-item label="">
        <el-input v-model="record"></el-input>
      </el-form-item>
      <el-form-item>
        <el-button @click="addRecord" type="primary">添加</el-button>
      </el-form-item>
    </el-form>
  </div>
</div>
</template>

<script>
import { allRechargeType, addNewRechargeType, updateRechargeType, deleteRechargeType } from '@/api/api'
export default {
  data() {
    return {
      record: '',
      records: []
    }
  },
  created() {
    this.fetchData()
  },
  methods: {
    fetchData() {
      allRechargeType().then(res => {
        if (res.status) {
          for (let i in res.data) {
            res.data[i].isModify = true
            res.data[i].showSave = false
          }
          this.records = res.data
        }
      })
    },
    addRecord() {
      if (!this.record) {
        this.$message({
          message: '请输入充值类型',
          type: 'warning'
        })
      } else {
        this.record = this.record.replace(/\s/g, '')
        // console.log(this.record)
        addNewRechargeType(this.record).then(res => {
          if (res.status) {
            this.$message({
              type: 'success',
              message: '添加成功!'
            })
            this.record = ''
            this.fetchData()
          }
        })
      }
    },
    modify(record) {
      record.isModify = false
      record.showSave = true
    },
    save(record) {
      if (!record.RechargeName) {
        this.$message({
          message: '请输入充值类型',
          type: 'warning'
        })
      } else {
        record.RechargeName = record.RechargeName.replace(/\s/g, '')
        updateRechargeType(record.RechargeName, record.Id).then(res => {
          if (res.status) {
            this.$message({
              type: 'success',
              message: '修改成功!'
            })
            this.fetchData()
          }
        })
      }
    },
    deleteItem(record) {
      var str = '确认删除"' + record.RechargeName + '"吗？'
      this.$confirm(str, '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        deleteRechargeType(record.Id).then(res => {
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

<style>
.charge-type .charge-con {
  wIdth: 400px;
  margin: 10px 30px;
}
.charge-type .charge-con .con-item {
  margin: 10px 0;
}
.charge-type .charge-con .con-item .el-input {
  margin-right: 10px;
}
.charge-type .el-input {
  wIdth: 200px;
}
.charge-type .charge-con .con-item .active .el-input__inner{
  border: none;
  background: #fff;
  color: #1f2d3d;
}
.charge-type .charge-con .charge-border {
  width: 100%;
  height: 1px;
  background: #1f2d3d;
  margin-bottom: 20px;
}
</style>
