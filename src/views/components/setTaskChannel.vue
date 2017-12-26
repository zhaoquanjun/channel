<template>
<el-dialog title="代理商任务设置" :visible.sync="dialogFormVisible" size="small">
  <div class="set-task-channel">
    <el-form class="inline" label-width="50px">
      <el-form-item class="year-select" label="年份">
        <el-select v-model="year" @change="setTaskcuryear">
          <el-option v-for="item in years" :key="item" :label="item" :value="item">
          </el-option>
        </el-select>
      </el-form-item>
      <el-form-item  v-for="(salestask, index) in salestask" :key="index" :label="salestask.Name">
        <el-input class="inputW" v-model="salestask.TaskNumMonth"></el-input>
      </el-form-item>
    </el-form>
    <div slot="footer" class="dialog-footer">
      <el-button @click="dialogFormVisible = false">取 消</el-button>
      <el-button type="primary" @click="submitForm">确 定</el-button>
    </div>
  </div>
</el-dialog>
</template>

<script>
import {
  saveTask,
  saveTaskPost,
  setTask
} from '../../api/api'
export default {
  // props: ['year', 'salestask', 'length'],
  props: ['channelId'],
  data() {
    return {
      dialogFormVisible: true,
      year: '',
      years: [2017, 2018],
      length: '',
      data: [],
      salestask: []
    }
  },
  created() {
    this.year = new Date().getFullYear()
    console.log(this.channelId)
    this.setTaskcuryear()
  },
  methods: {
    setTaskcuryear() {
      console.log(this.year, 'this.year')
      var year = this.year
      this.data = []
      for (var i = 1; i < 13; i++) {
        this.data.push({
          Id: i,
          ChannelId: this.channelId,
          TaskMonth: [year, i, '1'].join('-'),
          TaskNumMonth: 0
        })
      }
      var item = {
        channelId: this.channelId,
        currYear: year
      }
      setTask(item).then((res) => {
        this.length = res.data.length
        if (res.data.length > 0) {
          window._.each(res.data, (item) => {
            // console.log(item.TaskMonth, 'TaskMonth')
            item.Name = (+item.TaskMonth.split('-')[1]) + '月'
          })
          this.salestask = res.data
        } else {
          window._.each(this.data, (item) => {
            item.Name = item.Id + '月'
          })
          this.salestask = this.data
        }
      })
    },
    submitForm() {
      if (this.length) {
        saveTask(this.salestask).then(res => {
          if (res.status) {
            this.$message({
              type: 'success',
              message: '保存成功!'
            })
            this.dialogFormVisible = false
          }
        }).catch(() => {})
      } else {
        saveTaskPost(this.salestask).then(res => {
          if (res.status) {
            this.$message({
              type: 'success',
              message: '保存成功!'
            })
            this.dialogFormVisible = false
          }
        }).catch(() => {})
      }
    }
  }
}
</script>

<style>
.inline {
  width: 100%;
  display: inline-block;
}
.set-task-channel .inline .el-form-item {
  width: 50%;
  float: left;
}
.set-task-channel .inline .year-select {
  width: 100%;
}
.set-task-channel .inline .year-select .el-input__inner {
  width: 100px;
}
.setW {
  width: 40%;
}
.set-task-channel .dialog-footer {
  text-align: right;
}
</style>
