<template>
<el-form :inline="true" :model="params" class="searchForm">
  <el-form-item label="年">
    <el-select v-model="params.year" placeholder="请选择" clearable>
      <el-option v-for="item in years" :key="item" :label="item" :value="item">
      </el-option>
    </el-select>
  </el-form-item>
  <el-form-item label="结束账期">
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
  <el-form-item label="代理商是否解约">
    <el-select v-model="params.status">
      <el-option v-for="item in Status" :key="item.status" :label="item.statusName" :value="item.status">
      </el-option>
    </el-select>
  </el-form-item>
  <el-form-item>
    <el-button type="primary" @click="onSearch">查询</el-button>
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
import ElSelect from '@/components/select.vue'
export default {
  name: 'searchParams',
  props: ['length'],
  data() {
    return {
      Status: [
        {status: '', statusName: '全部'},
        {status: 0, statusName: '是'},
        {status: 1, statusName: '否'}
      ],
      params: {
        year: 2017,
        months: '',
        partitions: [],
        provinces: [],
        ccodes: [],
        channelname: '',
        status: ''
      },
      partitions: [],
      provinces: [],
      cities: [],
      years: [2018, 2017, 2016],
      months: ['1月', '2月', '3月', '4月', '5月', '6月', '7月', '8月', '9月', '10月', '11月', '12月']
    }
  },
  created() {
    this.params.months = this.getCurMonth() + '月'
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
    getCurMonth() {
      var date = new Date()
      var month = date.getMonth()
      // console.log(month)
      return month
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
      let {
        year,
        months,
        ccodes,
        channelname,
        status
      } = this.params
      let params = {
        year,
        months,
        ccodes,
        channelname,
        status
      }
      if ((this.params.partitions.length > 0 || this.params.provinces.length) > 0 && ccodes.length === 0) {
        ccodes = this.cities.map(item => item.CityCode)
      }
      // console.log(ccodes, 'ccodes')
      // c处理大区没有城市时候需要给后台传递codes 值为0
      if (this.params.partitions.length > 0 && ccodes.length === 0 || this.params.provinces.length > 0 && ccodes.length === 0) {
        params.ccodes = ccodes = 0
      } else {
        params.ccodes = ccodes.join(',')
      }
      // console.log(params.ccodes, 'ccodes之后')
      params.months = parseInt(params.months) < 10 ? ('0' + parseInt(params.months)) : parseInt(params.months)
      this.$emit('search', params)
    },
    onDownload() {
      this.$emit('download')
    }
  },
  components: {
    ElSelect
  }
}
</script>
<!-- Add "scoped" attribute to limit CSS to this component only -->
<style >
</style>
