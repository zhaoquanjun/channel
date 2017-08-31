<template>
<el-form :inline="true" :model="params" class="searchForm">
  <el-form-item v-if="!reduceSearchItem" label="" v-show="!hideDate">
    <el-date-picker v-model="params.starttime" type="date" placeholder="开始日期" :clearable="clearable">
    </el-date-picker>
    <span>-</span>
    <el-date-picker v-model="params.endtime" type="date" placeholder="结束日期" :clearable="clearable">
    </el-date-picker>
  </el-form-item>
  <el-form-item label="环比" v-show="showDateRange">
    <el-date-picker v-model="params.laststarttime" type="date" placeholder="开始日期" :clearable="clearable">
    </el-date-picker>
    <span>-</span>
    <el-date-picker v-model="params.lastendtime" type="date" placeholder="结束日期" :clearable="clearable">
    </el-date-picker>
  </el-form-item>
  <el-form-item label="统计日" v-show="reduceSearchItem">
    <el-date-picker v-model="params.endtime" type="date">
    </el-date-picker>
  </el-form-item>
  <el-form-item v-if="!reduceSearchItem" label="大区">
    <el-select v-model="params.partitions" multiple placeholder="全部" @change="getParamsProvince(),getParamsCities()">
      <el-option v-for="item in partitions" :key="item.Id" :label="item.PartitionName" :value="item.Id">
      </el-option>
    </el-select>
  </el-form-item>
  <el-form-item v-if="!reduceSearchItem" label="省份">
    <el-select v-model="params.provinces" multiple placeholder="全部" @change="getParamsCities()">
      <el-option v-for="item in provinces" :key="item.ProvinceCode" :label="item.ProvinceName" :value="item.ProvinceCode">
      </el-option>
    </el-select>
  </el-form-item>
  <el-form-item v-if="!reduceSearchItem" label="城市">
    <el-select v-model="params.ccodes" multiple placeholder="全部">
      <el-option v-for="item in cities" :key="item.CityCode" :label="item.CityName" :value="item.CityCode">
      </el-option>
    </el-select>
  </el-form-item>
  <el-form-item label="代理商" v-show="!hideChannel">
    <el-input placeholder="代理商名称" v-model="params.channelname"></el-input>
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
  getParamsCities
} from '../api/api'
import ElSelect from '@/components/select.vue'
export default {
  name: 'searchParams',
  props: ['hideChannel', 'hideDate', 'showDateRange', 'length', 'show', 'reduceSearchItem'],
  data() {
    return {
      params: {
        starttime: '',
        endtime: '',
        laststarttime: '',
        lastendtime: '',
        partitions: [],
        provinces: [],
        ccodes: [],
        channelname: ''
      },
      partitions: [],
      provinces: [],
      cities: [],
      clearable: false
    }
  },
  created() {
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
        starttime,
        endtime,
        ccodes,
        channelname
      } = this.params
      if (this.reduceSearchItem) {
        var params = {
          endtime,
          channelname
        }
      } else {
        params = {
          starttime,
          endtime,
          ccodes,
          channelname
        }
      }

      if (this.params.partitions.length > 0 || this.params.provinces.length > 0 && ccodes.length === 0) {
        ccodes = this.cities.map(item => item.CityCode)
      }
      // console.log(ccodes, 'ccodes')
      // c处理大区没有城市时候需要给后台传递codes 值为0
      if (this.params.partitions.length > 0 && ccodes.length === 0 || this.params.provinces.length > 0 && ccodes.length === 0) {
        params.ccodes = ccodes = 0
      }
      // console.log(ccodes, 'ccodes之后')
      if (this.showDateRange) {
        params.laststarttime = this.params.laststarttime
        params.lastendtime = this.params.lastendtime
      }
      // c处理大区没有城市时候需要给后台传递codes 值为0
      if (!this.reduceSearchItem && ccodes !== 0) {
        params.ccodes = ccodes.join(',')
      }
      // console.log(params, 'params')
      this.$emit('search', params, this.cities)
    },
    onDownload() {
      let {
        starttime,
        endtime,
        ccodes,
        channelname
      } = this.params
      let params = {
        starttime,
        endtime,
        ccodes,
        channelname
      }
      if (this.params.partitions.length > 0 || this.params.provinces.length > 0 && ccodes.length === 0) {
        ccodes = this.cities.map(item => item.CityCode)
      }
      if (this.showDateRange) {
        params.laststarttime = this.params.laststarttime
        params.lastendtime = this.params.lastendtime
      }
      params.ccodes = ccodes.join(',')
      this.$emit('download', params, this.cities)
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
