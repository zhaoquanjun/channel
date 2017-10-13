<template>
<div class="charge-type">
  <h3 class="vheader">充值类型设置</h3>
  <div class="charge-con">
    <el-form :inline="true">
      <el-form-item label="">
        <el-input v-model="record"></el-input>
      </el-form-item>
      <el-form-item>
        <el-button @click="addRecord" type="primary">添加</el-button>
      </el-form-item>
    </el-form>
    <div class="con-item" v-for="record in records">
      <el-input v-model="record.recordName" :disabled="record.isModify"></el-input>
      <el-button v-if="!record.showSave" @click="modify(record)" type="text" size="small">修改</el-button>
      <el-button v-else @click="save(record)" type="text" size="small">保存</el-button>
      <el-button @click="deleteItem(record)" type="text" size="small">删除</el-button>
    </div>
  </div>
</div>
</template>

<script>
export default {
  data() {
    return {
      record: '',
      records: [{
        id: '1',
        recordName: '广告补贴',
        isModify: true,
        showSave: false
      }, {
        id: '2',
        recordName: '广告补贴',
        isModify: true,
        showSave: false
      }, {
        id: '3',
        recordName: '广告补贴',
        isModify: true,
        showSave: false
      }]
    }
  },
  created() {
    // this.fetchData()
  },
  methods: {
    fetchData() {
      // getRecordList().then(res => {
      //   if (res.status) {
      //     this.records = res.data
      //   }
      // })
    },
    addRecord() {
      if (!this.record) {
        this.$message({
          message: '请输入充值类型',
          type: 'warning'
        })
      } else {
        // addChargeType(this.record).then(res => {
        //   if (res.status) {
        //     this.$message({
        //       type: 'success',
        //       message: '添加成功!'
        //     })
        //     this.fetchData()
        //   }
        // })
      }
      // alert('新增')
    },
    modify(record) {
      record.isModify = false
      record.showSave = true
    },
    save(record) {
      // modifyChargeType(this.record).then(res => {
      //   if (res.status) {
      //     this.$message({
      //       type: 'success',
      //       message: '修改成功!'
      //     })
      //     this.fetchData()
      //   }
      // })
    },
    deleteItem(record) {
      var str = '确认删除"' + record.recordName + '"吗？'
      this.$confirm(str, '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        // deleteChargeType(this.record.id).then(res => {
        //   if (res.status) {
        //     this.$message({
        //       type: 'success',
        //       message: '删除成功!'
        //     })
        //     this.fetchData()
        //   }
        // })
        console.log('aa')
      }).catch(() => {})
    }
  }
}
</script>

<style scoped>
.charge-type .charge-con {
  width: 400px;
  margin: 10px 30px;
}
.charge-type .charge-con .con-item {
  margin: 10px 0;
}
.charge-type .charge-con .con-item .el-input {
  margin-right: 10px;
}
.charge-type .el-input {
  width: 200px;
}
</style>
