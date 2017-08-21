<template>
<div>
  <el-dialog :title="title" :visible.sync="dialogTableVisible" size="small">
    <el-table :data="tasks">
      <el-table-column property="Name" label="月份"></el-table-column>
      <el-table-column property="TaskNumMonth" label="目标数"></el-table-column>
      <el-table-column property="CompleteNum" label="完成数"></el-table-column>
      <el-table-column property="GoalRate" label="完成比率" width="100"></el-table-column>
      <el-table-column property="RebatesRatio" label="返点比率" width="100"></el-table-column>
      <el-table-column property="RewardsMoney" label="返点金额" width="100"></el-table-column>
      <el-table-column label="操作">
        <template scope="scope">
            <el-button v-if="scope.row.access" @click="fetch(scope.row)" type="text" size="small">计算</el-button>
            <el-button v-if="scope.row.RebatesRatio && scope.row.fdStatus < 2" @click="set(scope.row.fd)" type="text" size="small">返点</el-button>
          </template>
      </el-table-column>
    </el-table>
    <div slot="footer" class="dialog-footer">
      <el-button type="primary" @click="dialogTableVisible = false">关 闭</el-button>
    </div>
  </el-dialog>
</div>
</template>

<script>
import {
  fetch,
  fdSalestask,
  fdRewardnotes
} from '../../api/api'
import Dialog from '../../service/dialog.js'
import Refuse from '../../components/refuse.vue'
// import bus from '../../bus'
export default {
  props: ['channelId'],
  data() {
    return {
      title: '',
      dialogTableVisible: true,
      id: '',
      tasks: null,
      currYear: ''
    }
  },
  created() {
    this.id = this.channelId
    var year = new Date()
    this.currYear = year.getFullYear()
    this.title = `代理商任务设置(${this.currYear}年)`
    this.fandian()
  },
  methods: {
    set(fd) { // 返点传递参数是 row.fd
      console.log(fd + '返点')
      Dialog(Refuse, {
        row: fd,
        sign: 'FANDIAN',
        title: '代理商返点确认',
        label: '返点金额'
      }).then(() => {
        this.fandian()
      })
    },
    fetch(row) { // 新组成表数据
      // console.log(row + '计算')
      var item = {
        ChannelId: row.ChannelId,
        YearMonth: row.TaskMonth.substr(0, 7)
      }
      fetch(item).then((res) => { // 成功够重新执行父组件的fdR()函数
        if (res.status) {
          this.fdR()
          // bus.$emit('fetch-success')
        }
      })
    },
    fandian() {
      // 点击两次数据请求 ==> 两次数据请求结果合并成一个新表 然后传递给弹出层
      var year = new Date()
      var currYear = year.getFullYear()
      var item = {
        channelId: this.id,
        currYear: currYear
      }
      fdSalestask(item).then(res => {
        window._.each(res.data, function(item) {
          item.Name = (+item.TaskMonth.split('-')[1]) + '月'
          if (parseInt(item.TaskMonth.split('-')[1]) > year.getMonth() + 1) {
            item.access = false
          } else {
            item.access = true
          }
        })
        this.tasks = res.data
        console.log(this.tasks, 'this.tasks')
        this.fdR()
      })
      // bus.$on('fetch-success', () => {
      //   this.fdR()
      // })
      // bus.$on('fd-success', () => {
      //   this.fandian()
      // })
    },
    fdR() { // 返点保存及弹框数据获取列表1
      var year = new Date()
      var currYear = year.getFullYear()
      var item = {
        channelId: this.id,
        currYear: currYear
      }
      fdRewardnotes(item).then(res => {
        var curTasks = this.tasks
        // console.log(this.tasks)
        window._.each(res.data, function(item) {
          // console.log(curTasks)
          var fd = window._.find(curTasks, {
            TaskMonth: item.YearMonth
          })
          if (fd) {
            var month = +fd.TaskMonth.split('-')[1]
            if (month % 3 > 0) {
              fd.CompleteNum = item.MonthCompleteNum
              fd.GoalRate = item.MonthGoalRate
              fd.RewardsMoney = item.RewardsMoney
              fd.RebatesRatio = item.MonthRebatesRatio
              fd.fdStatus = item.Status
            } else {
              fd.CompleteNum = item.QuarterCompleteNum
              fd.GoalRate = item.QuarterGoalRate
              fd.RewardsMoney = item.RewardsMoney
              fd.RebatesRatio = item.QuarterRebatesRatio
              fd.fdStatus = item.Status
            }
            fd.access = false
            fd.fd = item // fd是最终合并成功的表 并把值赋值给curTasks
          }
        })
        this.tasks = curTasks
      })
    }
  }
}
</script>

<style scoped>
</style>
