<template>
<el-form :inline="true" :model="params" class="searchForm">
  <el-form-item label="">
    <el-date-picker v-model="params.starttime" type="date" placeholder="开始日期" :clearable="clearable">
    </el-date-picker>
    <span>-</span>
    <el-date-picker v-model="params.endtime" type="date" placeholder="结束日期" :clearable="clearable">
    </el-date-picker>
  </el-form-item>
  <el-form-item label="大区">
    <el-select v-model="params.partitions" multiple placeholder="全部" @change="getParamsProvince(),getParamsCities()">
      <el-option v-for="item in partitions" :key="item.Id" :label="item.PartitionName" :value="item.Id">
      </el-option>
    </el-select>
  </el-form-item>
  <el-form-item label="省份">
    <el-select v-model="params.provinces" multiple placeholder="全部" @change="getParamsCities()">
      <el-option v-for="item in provinces" :key="item.ProvinceCode" :label="item.ProvinceName" :value="item.ProvinceCode">
      </el-option>
    </el-select>
  </el-form-item>
  <el-form-item label="城市">
    <el-select v-model="params.ccodes" multiple placeholder="全部">
      <el-option v-for="item in cities" :key="item.CityCode" :label="item.CityName" :value="item.CityCode">
      </el-option>
    </el-select>
  </el-form-item>
  <el-form-item label="代理商">
    <el-autocomplete class="inline-input" v-model="params.channelname" :trigger-on-focus="false" :fetch-suggestions="querySearch" placeholder="代理商名称"></el-autocomplete>
  </el-form-item>
  <el-form-item label="代理商是否解约">
    <el-select v-model="params.status">
      <el-option v-for="item in Status" :key="item.status" :label="item.statusName" :value="item.status">
      </el-option>
    </el-select>
  </el-form-item>
  <el-form-item>
    <el-button type="primary" @click="onSearch">查询</el-button>
    <el-button v-if="!show" type="primary" @click="onDownload" :disabled="canClick">导出</el-button>
  </el-form-item>
</el-form>
</template>
<script>
import {
  getPartitions,
  getParamsProvince,
  getParamsCities,
  agents
} from '../api/api'
import ElSelect from '@/components/select.vue'
export default {
  name: 'searchParams',
  props: ['length', 'show', 'reduceSearchItem'],
  data() {
    return {
      Status: [
        {status: '', statusName: '全部'},
        {status: 0, statusName: '是'},
        {status: 1, statusName: '否'}
      ],
      params: {
        starttime: '',
        endtime: '',
        partitions: [],
        provinces: [],
        ccodes: [],
        channelname: '',
        status: ''
      },
      partitions: [],
      provinces: [],
      cities: [],
      clearable: false,
      agents: []
    }
  },
  created() {
    this.getPartitions()
    this.getParamsProvince()
    this.getParamsCities()
    this.Agents()
    var start = this.getNowMonthStartDate()
    var end = this.getNowMonthLastDate()
    this.params.starttime = new Date(new Date(start))
    this.params.endtime = new Date(new Date(end))
    // console.log(this.params.starttime, this.params.endtime)
  },
  computed: {
    canClick: function () {
      if (!this.length) {
        return true
      } else {
        return false
      }
    }
  },
  methods: {
    getNowMonthStartDate() {
      var date = new Date()
      return date.toLocaleString().match(/\d{0,4}\/\d{1,2}\/(\d{1,2})/)[0].replace(/(\d{0,4}\/\d{1,2}\/)\d{1,2}/, '$11')
    },
    getNowMonthLastDate() {
      var date = new Date()
      var nextMonthStartDate = date.toLocaleString().match(/\d{0,4}\/\d{1,2}\/(\d{1,2})/)[0].replace(/(\d{0,4})\/(\d{1,2})\/(\d{1,2})/, function() {
        return parseInt(arguments[2]) === 12 ? (parseInt(arguments[1]) + 1) + '/1/1' : arguments[1] + '/' + (parseInt(arguments[2]) + 1) + '/1'
      })
      return new Date(new Date(nextMonthStartDate).getTime() - 1).toLocaleString().match(/\d{0,4}\/\d{1,2}\/(\d{1,2})/)[0]
    },
    getPartitions() {
      getPartitions().then((res) => {
        this.partitions = res.data
      })
    },
    getParamsProvince() {
      this.params.provinces = []
      const param = {
        ChannelPartitionIds: this.params.partitions.join(',')
      }
      getParamsProvince(param).then((res) => {
        this.provinces = res.data
      })
    },
    getParamsCities() {
      this.params.ccodes = []
      const param = {
        ChannelPartitionIds: this.params.partitions.join(','),
        pcodes: this.params.provinces.join(',')
      }
      getParamsCities(param).then((res) => {
        this.cities = res.data
      })
    },
    onSearch() {
      // console.log(this.params.ccodes, 'this.params.ccodes')
      let {
        starttime,
        endtime,
        // cuttime,
        ccodes,
        channelname,
        status
      } = this.params
      var params = {
        starttime,
        endtime,
        ccodes,
        channelname,
        status
      }
      // console.log(ccodes, 'ccodes')
      // 选择大区省份后下面对应的所有城市
      if ((this.params.partitions.length > 0 || this.params.provinces.length > 0) && ccodes.length === 0) {
        ccodes = this.cities.map(item => item.CityCode)
      }
      // c处理大区没有城市时候需要给后台传递codes 值为0
      if (this.cities.length === 0) {
        params.ccodes = ccodes = 0
      }
      if (ccodes.length !== 0 && this.cities.length > 0) {
        params.ccodes = ccodes.join(',')
      }
      console.log(params, 'params')
      this.$emit('search', params, this.cities)
    },
    onDownload() {
      this.$emit('download')
    },
    Agents() {
      agents().then((res) => {
        this.agents = res.data
        for (let i in this.agents) {
          this.agents[i].value = this.agents[i].ChannelName
        }
        // console.log(this.agents)
      })
    },
    querySearch(queryString, cb) {
      var channels = this.agents
      var results = queryString ? channels.filter(this.createFilter(queryString)) : channels
      cb(results)
    },
    createFilter(queryString) {
      return (channel) => {
        return (channel.value.indexOf(queryString) >= 0)
      }
    }
  },
  components: {
    ElSelect
  }
}
</script>
<!-- Add "scoped" attribute to limit CSS to this component only -->
<style>
.searchForm {
  padding: 6px 12px;
}

.searchForm .el-form-item {
  margin-right: 0;
}

.searchForm .el-input {
  width: 120px;
}

.searchForm .el-select {
  /*width: 180px;*/
  overflow: hidden;
  height: 36px;
}

.searchForm .el-select>.el-input {
  width: 120px;
}

.searchForm .el-select>.el-select__tags {
  max-width: 130px!important;
  height: 34px;
  overflow: hidden;
}

.searchForm .el-select .el-input__inner {
  height: 36px!important;
  overflow: hidden;
}

.searchForm .el-select__tags {
  height: 34px;
}

.searchForm .el-select>.el-input {
  height: 36px;
}
</style>
