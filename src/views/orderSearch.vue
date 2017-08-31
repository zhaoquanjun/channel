<template>
<div>
  <h3 class="vheader">订单查询</h3>
  <div class="vsearch">
    <el-form ref="params" :inline="true" :model="params">
      <el-form-item label="公司名称">
        <el-input class="inputWid" placeholder="公司名称" v-model="params.cusname"></el-input>
      </el-form-item>
      <el-form-item label="法人">
        <el-input class="inputWid" placeholder="法人" v-model="params.legalPerson"></el-input>
      </el-form-item>
      <el-form-item label="">
        <el-date-picker class="inputWid" v-model="params.starttime" type="date" placeholder="开始日期" :clearable="clearable">
        </el-date-picker>
        <span>-</span>
        <el-date-picker class="inputWid" v-model="params.endtime" type="date" placeholder="结束日期" :clearable="clearable">
        </el-date-picker>
      </el-form-item>
      <el-form-item label="审核状态">
        <el-select class="inputWid" v-model="params.status " clearable placeholder="全部">
          <el-option v-for="data in orderStatus" :key="data.status" :label="data.name" :value="data.status">
          </el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="订单类型">
        <el-select class="inputWid" v-model="params.Category " clearable placeholder="全部">
          <el-option v-for="data in orderType" :key="data.Category" :label="data.name" :value="data.Category">
          </el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="代理商">
        <el-select class="inputWid" filterable v-model="params.agents " clearable placeholder="请选择">
          <el-option v-for="data in agents" :key="data.ChannelId" :label="data.ChannelName" :value="data.ChannelId">
          </el-option>
        </el-select>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="fetchData">查询</el-button>
      </el-form-item>
    </el-form>
  </div>
  <el-table :data="tableData" border style="width: 100%">
    <el-table-column prop="ProvinceName" label="省" width="120">
    </el-table-column>
    <el-table-column prop="CityName" label="市" width="120">
    </el-table-column>
    <el-table-column prop="ChannelName1" label="一级代理商" min-width="200">
    </el-table-column>
    <el-table-column prop="ChannelName2" label="二级代理商" min-width="200">
    </el-table-column>
    <el-table-column prop="Name" label="公司名称" min-width="200">
    </el-table-column>
    <el-table-column prop="Category" :formatter="formatType" label="类型">
    </el-table-column>
    <el-table-column prop="ContractAmount" label="合同金额" width="100">
    </el-table-column>
    <el-table-column label="礼包">
      <template scope="scope">
          <span v-text="scope.row.GiftTypeName"></span>
          <span>{{scope.row.GiftPrice | formatePrice}}</span>
        </template>
    </el-table-column>
    <el-table-column prop="PromotionName" label="活动">
    </el-table-column>
    <el-table-column prop="LegalPerson" label="法人">
    </el-table-column>
    <el-table-column prop="Status" :formatter="StatusFormat" label="状态" width="80">
    </el-table-column>
    <el-table-column prop="CreateDate" label="订单日期" width="120">
    </el-table-column>
    <el-table-column v-if="category != 7" label="操作" width="140">
      <template scope="scope">
          <el-button @click="viewOrder(scope.row)" type="text" size="small">查看</el-button>
          <el-button @click="modify(scope.row)" type="text" size="small">修改</el-button>
          <el-button v-if="scope.row.Status != 2"  @click="deleteOrder(scope.row)" type="text" size="small">删除</el-button>
          <el-button v-if="scope.row.Status === 2" @click="reback(scope.row)" type="text" size="small">审核回退</el-button>
          <el-button v-if="scope.row.Status === 2" @click="guaqi(scope.row)" type="text" size="small">挂起</el-button>
        </template>
    </el-table-column>
  </el-table>
  <el-pagination @size-change="handleSizeChange" @current-change="handleCurrentChange" :current-page="pagination.currentPage" :page-sizes="[10, 20, 30]" :page-size="pagination.pageSize" layout="total, sizes, prev, pager, next, jumper" :total="pagination.total"
    style="text-align:center; margin:20px;">
  </el-pagination>
</div>
</template>

<script>
import {
  review,
  agents,
  deleteSearch,
  rebackSearch,
  orderTitle
} from '../api/api'
import Dialog from '../service/dialog.js'
import AddOrder from '../components/addOrder.vue'
import Refuse from '../components/refuse.vue'
import bus from '../bus'
export default {
  name: 'orderSearch',
  data: function () {
    return {
      show: true,
      pagination: {
        total: 0,
        pageSize: 10,
        currentPage: 1
      },
      orderStatus: [{
        name: '全部',
        status: 0
      }, {
        name: '未审核',
        status: 1
      }, {
        name: '通过',
        status: 2
      }, {
        name: '拒审',
        status: 3
      }],
      orderType: [{
        name: '全部',
        Category: 0
      }, {
        name: '正常',
        Category: 1
      }, {
        name: '预提单初审',
        Category: 2
      }, {
        name: '预提单复审',
        Category: 3
      }],
      agents: [],
      tableData: [],
      params: {
        cusname: '',
        agents: '',
        legalPerson: '',
        starttime: null,
        endtime: null,
        status: 0,
        Category: 0
      },
      category: '',
      clearable: false
    }
  },
  created() {
    this.category = JSON.parse(sessionStorage.getItem('userInfo')).Category
    this.fetchData()
    this.getAgents()
  },
  methods: {
    fetchData() {
      let limit = this.pagination.pageSize
      let offset = (this.pagination.currentPage - 1) * limit
      let cid = this.params.agents
      let cusname = this.params.cusname
      let legalPerson = this.params.legalPerson
      let status = this.params.status
      let Category = this.params.Category
      let start = this.params.starttime
      let end = this.params.endtime
      // console.log(legalPerson, cusname, '法人')
      review({
        limit: limit,
        offset: offset,
        cid: cid,
        cusname: cusname,
        legalPerson: legalPerson,
        status: status,
        Category: Category,
        start: start,
        end: end
      }).then((res) => {
        this.tableData = res.data
        this.pagination.total = res.Count
      })
    },
    getAgents() {
      agents().then((res) => {
        this.agents = res.data
      })
    },
    StatusFormat: function (row) {
      const map = {
        1: '未审核',
        2: '通过',
        3: '拒审'
      }
      return map[row.Status] || ''
    },
    formatType: function (row) {
      var Category = row.Category
      // console.log(Category)
      if (Category > 1) {
        Category = '注+记'
      } else if (Category === 1) {
        Category = '记'
      }
      return Category
    },
    viewOrder(row) {
      var postData = ''
      orderTitle(row.OrderId).then(res => {
        postData = res.data
        Dialog(AddOrder, {
          postData: postData
        })
      })
    },
    modify(row) {
      var postData = ''
      orderTitle(row.OrderId).then(res => {
        postData = res.data
        if (Number(postData.Customer.NoDeadLine) === 1) {
          postData.Customer.BusnissDeadline = ''
        }
        Dialog(AddOrder, {
          postData: postData,
          modify: true
        }).then(res => this.fetchData())
      })
    },
    deleteOrder(row) {
      this.$confirm('您确定要删除订单吗?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        deleteSearch(row.OrderId).then(res => {
          if (res.status) {
            this.$message({
              type: 'success',
              message: '删除订单成功!'
            })
            this.fetchData()
          }
        })
      }).catch(() => {
        this.$message({
          type: 'info',
          message: '已取消删除'
        })
      })
    },
    reback(row) {
      this.$confirm('您确定要回退审核吗?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        // console.log(row.OrderId)
        rebackSearch(row.OrderId).then(res => {
          if (res.status) {
            this.$message({
              type: 'success',
              message: '审核回退成功!'
            })
            this.fetchData()
          }
        })
      }).catch(() => {
        this.$message({
          type: 'info',
          message: '已取消回退'
        })
      })
    },
    guaqi(row) {
      var item = {
        CompanyId: row.CustomerId,
        ChannelId: row.ChannelId
      }
      Dialog(Refuse, {
        item: item,
        sign: 'GUAQI',
        title: '订单挂起',
        label: '挂起原因'
      })
      bus.$on('gq-success', () => {
        this.fetchData()
      })
    },
    handleSizeChange(val) {
      this.pagination.pageSize = val
      this.fetchData()
    },
    handleCurrentChange(val) {
      this.pagination.currentPage = val
      this.fetchData()
    }
  },
  filters: {
    formatePrice(val) {
      if (val === 0 || !val) {
        return ''
      } else {
        return ('(￥' + val + ')')
      }
    }
  }
}
</script>

<style scoped>
.inputWid {
  width: 100px;
}
</style>
