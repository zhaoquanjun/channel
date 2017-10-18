<template>
<div>
  <h3 class="vheader">财务统计</h3>
  <el-tabs type="card" :value="activeName">
    <el-tab-pane label="充值明细表" name="tab1">
      <Tab1 :agents="agents"></Tab1>
    </el-tab-pane>
    <el-tab-pane label="支付明细表" name="tab2">
      <Tab2 :agents="agents"></Tab2>
    </el-tab-pane>
    <el-tab-pane label="代理商当前余额表" name="tab3">
      <Tab3 :agents="agents"></Tab3>
    </el-tab-pane>
    <el-tab-pane label="返点明细表" name="tab4">
      <Tab4 :agents="agents"></Tab4>
    </el-tab-pane>
    <el-tab-pane label="发票明细清单" name="tab5">
      <Tab5 :agents="agents"></Tab5>
    </el-tab-pane>
    <el-tab-pane label="扣减一代提成表" name="tab6">
      <Tab6 :agents="agents"></Tab6>
    </el-tab-pane>
  </el-tabs>
</div>
</template>

<script>
import { agents } from '@/api/api'
import StatisFinance1 from '@/views/components/statisFinance1'
import StatisFinance2 from '@/views/components/statisFinance2'
import StatisFinance3 from '@/views/components/statisFinance3'
import StatisFinance4 from '@/views/components/statisFinance4'
import StatisFinance5 from '@/views/components/statisFinance5'
import StatisFinance6 from '@/views/components/statisFinance6'
export default {
  data: function() {
    return {
      activeName: 'tab1',
      agents: []
    }
  },
  components: {
    Tab1: StatisFinance1,
    Tab2: StatisFinance2,
    Tab3: StatisFinance3,
    Tab4: StatisFinance4,
    Tab5: StatisFinance5,
    Tab6: StatisFinance6
  },
  created() {
    this.Agents()
  },
  methods: {
    Agents() {
      agents().then((res) => {
        this.agents = res.data
        for (let i in this.agents) {
          this.agents[i].value = this.agents[i].ChannelName
        }
        // console.log(this.agents)
      })
    }
  }
}
</script>

<style scoped>
</style>
