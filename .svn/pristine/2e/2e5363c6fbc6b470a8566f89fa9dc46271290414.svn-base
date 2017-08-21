<template>
<div>
  <h2 class="text-center">零申报订单占比</h2>
  <SearchParams :length="tableData.length" @search="onSearch" @download="onDownload"></SearchParams>
  <chart :options="chartData" ref="echarts"></chart>
  <el-table :data="tableData" border style="width: 100%" :summary-method="getSummaries" show-summary v-table-sum>
    <el-table-column prop="Months" label="月" :formatter="monthFormatter">
    </el-table-column width="80">
    <el-table-column prop="PartitionName" label="大区" width="120">
    </el-table-column>
    <el-table-column prop="ProvinceName" label="省份" width="120">
    </el-table-column>
    <el-table-column prop="CityName" label="城市" width="120">
    </el-table-column>
    <el-table-column prop="ChannelName1" label="一级代理商" width="200">
    </el-table-column>
    <el-table-column prop="ChannelName2" label="二级代理商" width="200">
    </el-table-column>
    <el-table-column prop="ZeroOrderNum" label="零申报订单数量" width="140">
    </el-table-column>
    <el-table-column prop="OrderNum" label="总订单数量" width="140">
    </el-table-column>
    <el-table-column prop="ZeroOrderRate" label="占比" width="140">
    </el-table-column>
  </el-table>
  <el-pagination @size-change="handleSizeChange" @current-change="handleCurrentChange" :current-page="pagination.currentPage" :page-sizes="[10, 20, 30]" :page-size="pagination.pageSize" layout="total, sizes, prev, pager, next, jumper" :total="pagination.total"
    style="text-align:center; margin:20px;">
  </el-pagination>
</div>
</template>
<script>
import SearchParams from '@/components/searchParamsYearMonth.vue'
import ECharts from 'vue-echarts/components/ECharts'
import 'echarts/lib/chart/bar'
import 'echarts/lib/chart/line'
import 'echarts/lib/component/tooltip'
import 'echarts/lib/component/polar'
import 'echarts/lib/component/geo'
import 'echarts/lib/component/legend'
import 'echarts/lib/component/title'
import 'echarts/lib/component/visualMap'

import {
  getZeroToAll,
  getZeroToAllChart
} from '../../api/api'

export default {
  name: 'StatisConversionTab1',
  data: function () {
    return {
      tableData: [],
      pagination: {
        total: 0,
        pageSize: 10,
        currentPage: 1
      },
      params: {},
      total: {},
      chartData: {
        color: ['#3398DB'],
        tooltip: {
          show: true,
          trigger: 'axis',
          axisPointer: {
            type: 'cross',
            snap: 'true'
          },
          formatter: '{b0}<br/>{a0}: {c0}<br />{a1}: {c1}<br />{a2}: {c2}%'
        },
        grid: {
          left: '3%',
          right: '4%',
          containLabel: true
        },
        legend: {
          show: true,
          bottom: '5%',
          selectedMode: false,
          data: ['总订单数', '零申报', '占比']
        },
        xAxis: [{
          type: 'category',
          data: [], // 存放x周坐标
          axisTick: {
            alignWithLabel: true
          }
        }],
        yAxis: [{
          type: 'value',
          name: '订单量',
          position: 'left'
        }, {
          type: 'value',
          name: '占比',
          min: 0,
          max: 100,
          position: 'right',
          axisLabel: {
            formatter: '{value}%'
          }
        }],
        series: [{
          name: '总订单数',
          type: 'bar',
          barMaxWidth: 25,
          data: [] // 存放总订单数
        }, {
          name: '零申报',
          type: 'bar',
          barMaxWidth: 25,
          barGap: '-100%',
          itemStyle: {
            normal: {
              color: 'red'
            }
          },
          data: [] // 存放申报数据
        }, {
          name: '占比',
          type: 'line',
          yAxisIndex: 1,
          data: [] // 存放百分比
        }]
      }
    }
  },
  methods: {
    onSearch(params) {
      if (params) {
        this.params = params
      }
      this.getTableData()
      this.getChartData()
    },
    getTableData() {
      let limit = this.pagination.pageSize
      let offset = (this.pagination.currentPage - 1) * limit
      this.params.limit = limit
      this.params.offset = offset
      getZeroToAll(this.params).then(res => {
        this.pagination.total = res.Count
        this.tableData = res.data.DataInfo
        this.total = res.data.Total[0]
      })
    },
    getChartData() {
      getZeroToAllChart(this.params).then(res => {
        var data = res.data // 当查询的是
        var monthArr = []
        if (!this.params.months) {
          for (var i = 1; i <= 12; i++) {
            monthArr.push(i)
          }
        } else {
          var months = this.params.months
          monthArr = months.split(',')
        }
        window._.each(monthArr, function (item) {
          if (!window._.find(data, { Months: +item })) {
            data.push({
              Months: +item,
              ZeroOrderNum: 0,
              OrderNum: 0,
              ZeroOrderRate: 0
            })
          }
        })
        data = window._.sortBy(data, 'Months')
        let chartOptions = JSON.parse(JSON.stringify(this.chartData)) // 赋值图标配置给变量
        chartOptions.xAxis[0].data = data.map(item => {
          return item.Months + '月'
        })
        console.log(chartOptions.xAxis[0].data, 'X轴月份展示')
        chartOptions.series[1].data = data.map(item => item.ZeroOrderNum)
        chartOptions.series[0].data = data.map(item => item.OrderNum)
        chartOptions.series[2].data = data.map(item => parseFloat(item.ZeroOrderRate))
        this.$refs.echarts.clear()
        this.chartData = chartOptions
      })
    },
    handleSizeChange(val) {
      this.pagination.pageSize = val
      this.getTableData()
    },
    handleCurrentChange(val) {
      this.pagination.currentPage = val
      this.getTableData()
    },
    getSummaries({
      columns,
      data
    }) {
      const sums = ['合计', '-', '-', '-', '-', '-', this.total.zeroNum, this.total.allNum, this.total.allRate]
      return sums
    },
    monthFormatter(row, column) {
      return row[column.property] + '月'
    },
    onDownload(params) {
      const {
        year,
        months,
        ccodes,
        channelname
      } = params
      const url = `/api/download/zerotoall?year=${year || ''}&months=${months || ''}&ccodes=${ccodes || ''}&channelname=${channelname || ''}`
      // console.log(url)
      window.open(url)
    }
  },
  components: {
    SearchParams,
    chart: ECharts
  }
}
</script>
<style scoped>
.echarts {
  height: 300px;
  width: 800px;
}
</style>
