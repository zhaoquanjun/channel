<template>
<el-form :inline="true" :model="params" class="searchForm">
  <el-form-item label="年">
    <el-select v-model="params.year" placeholder="请选择" clearable>
      <el-option v-for="item in years" :key="item" :label="item" :value="item">
      </el-option>
    </el-select>
  </el-form-item>
  <el-form-item v-if="!onlyOneMonth" label="月">
    <el-select v-model="params.months" multiple placeholder="全部">
      <el-option v-for="item in months" :key="item" :label="item" :value="item">
      </el-option>
    </el-select>
  </el-form-item>
  <el-form-item v-if="onlyOneMonth" label="到期月份">
    <el-select v-model="params.months" placeholder="全部">
      <el-option v-for="item in months" :key="item" :label="item" :value="item">
      </el-option>
    </el-select>
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
    <el-input placeholder="代理商名称" v-model="params.channelname"></el-input>
  </el-form-item>
  <el-form-item>
    <el-button v-if="!onlyOneMonth" type="primary" @click="onSearch">查询</el-button>
    <el-button v-if="onlyOneMonth" type="primary" @click="onSearch">查询</el-button>
    <el-button type="primary" @click="onDownload" :disabled="canClick">导出</el-button>
  </el-form-item>
</el-form>
</template>
<script>
import {
  getPartitions,
  getParamsProvince,
  getParamsCities
} from '../api/api'
export default {
  name: 'searchParams',
  props: ['length', 'onlyOneMonth'],
  data() {
    return {
      params: {
        year: 2017,
        months: '',
        partitions: [],
        provinces: [],
        ccodes: [],
        channelname: ''
      },
      partitions: [],
      provinces: [],
      cities: [],
      years: [2017, 2016],
      months: ['1月', '2月', '3月', '4月', '5月', '6月', '7月', '8月', '9月', '10月', '11月', '12月']
    }
  },
  created() {
    console.log(this.length)
    this.getPartitions()
    this.getParamsProvince()
    this.getParamsCities()
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
    getPartitions() {
      getPartitions().then((res) => {
        this.partitions = res.data
      })
    },
    getParamsProvince() {
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
      let {
        year,
        months,
        ccodes,
        channelname
      } = this.params
      let params = {
        year,
        months,
        ccodes,
        channelname
      }
      if ((this.params.partitions.length > 0 || this.params.provinces.length) > 0 && ccodes.length === 0) {
        ccodes = this.cities.map(item => item.CityCode)
      }
      params.ccodes = ccodes.join(',')
      if (!this.onlyOneMonth) {
        params.months = months.map(str => {
          return parseInt(str) < 10 ? ('0' + parseInt(str)) : parseInt(str)
        })
        params.months = params.months.join(',')
        this.$emit('search', params)
      } else {
        console.log(params.months, 'params.months')
        if (!params.months) {
          this.$message({
            message: '请选择到期月份',
            type: 'warning'
          })
        } else {
          params.months = parseInt(params.months) < 10 ? ('0' + parseInt(params.months)) : parseInt(params.months)
          this.$emit('search', params)
          console.log(params.months, '所选月份')
        }
      }
    },
    onDownload() {
      let {
        year,
        months,
        ccodes,
        channelname
      } = this.params
      let params = {
        year,
        months,
        ccodes,
        channelname
      }
      params.ccodes = ccodes.join(',')
      if (!this.onlyOneMonth) {
        params.months = months.map(str => {
          return parseInt(str) < 10 ? ('0' + parseInt(str)) : parseInt(str)
        })
        params.months = params.months.join(',')
        this.$emit('download', params)
      } else {
        params.months = parseInt(params.months) < 10 ? ('0' + parseInt(params.months)) : parseInt(params.months)
        this.$emit('download', params)
      }
    }
  }
}
</script>
<!-- Add "scoped" attribute to limit CSS to this component only -->
<style >
</style>
