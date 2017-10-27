<template>
<div class="addMoney">
  <el-dialog :title="title" :visible.sync="dialogTableVisible" size="large">
    <el-table :data="gridData">
      <el-table-column type="index" label="序号"></el-table-column>
      <!-- <el-table-column v-if="type == 1" property="OrderId" label="订单编号" width="200"></el-table-column> -->
      <el-table-column property="BillId" label="账单编号" width="150"></el-table-column>
      <el-table-column v-if="type == 1" property="Amount" label="支出"></el-table-column>
      <el-table-column v-if="type == 2" property="Amount" label="充值金额" width="120"></el-table-column>
      <el-table-column property="Balance" label="余额" width="120"></el-table-column>
      <el-table-column property="Description" label="备注" min-width="300"></el-table-column>
      <el-table-column property="BillTime" label="操作时间" width="200"></el-table-column>
      <el-table-column v-if="type == 1" label="操作">
        <template scope="scope">
          <el-button @click="scanView(scope.row)" type="text" size="small" v-if="scope.row.Category != 3 && scope.row.Category != 6">查看</el-button>
        </template>
      </el-table-column>
    </el-table>
    <el-pagination @size-change="handleSizeChange" @current-change="handleCurrentChange" :current-page="pagination.currentPage" :page-sizes="[10, 20, 30]" :page-size="pagination.pageSize" layout="total, sizes, prev, pager, next, jumper" :total="pagination.total"
      style="text-align:center; margin:20px;">
    </el-pagination>
    <div slot="footer" class="dialog-footer">
      <el-button type="primary" @click="dialogTableVisible = false">关 闭</el-button>
    </div>
  </el-dialog>
</div>
</template>

<script>
import {
  rechargeDetail,
  orderTitle
} from '../api/api'
import AddOrder from './addOrder'
import Dialog from '../service/dialog.js'
export default {
  props: ['type', 'channelId'],
  data() {
    return {
      pagination: {
        total: 0,
        pageSize: 10,
        currentPage: 1
      },
      dialogTableVisible: true,
      gridData: [],
      title: ''
    }
  },
  created() {
    if (this.type === 1) {
      this.title = '支付明细'
    } else if (this.type === 2) {
      this.title = '充值明细'
    }
    this.getData()
  },
  methods: {
    getData() {
      let limit = this.pagination.pageSize
      let offset = (this.pagination.currentPage - 1) * limit
      let channelId = this.channelId
      let type = this.type
      rechargeDetail({
        limit: limit,
        offset: offset,
        channelId: channelId,
        type: type
      }).then((res) => {
        this.gridData = res.data
        this.pagination.total = res.Count
      })
    },
    scanView(row) {
      var postData = ''
      orderTitle(row.OrderId).then(res => {
        if (res.status) {
          postData = res.data
          Dialog(AddOrder, {
            postData: postData
          })
        }
      })
    },
    handleSizeChange(val) {
      this.pagination.pageSize = val
      this.getData()
    },
    handleCurrentChange(val) {
      this.pagination.currentPage = val
      this.getData()
    }
  }
}
</script>

<style scoped>
</style>
