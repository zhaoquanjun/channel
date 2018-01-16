<template>
<div>
  <h3 class="vheader">代理管理</h3>
  <div class="vsearch">
    <el-form ref="searchParam" :inline="true" :model="searchParam" label-width="60px">
      <el-form-item label="代理商">
        <el-input placeholder="代理商名称" v-model="searchParam.channelname"></el-input>
      </el-form-item>
      <el-form-item label="状态">
        <el-select v-model="searchParam.status " clearable placeholder="全部">
          <el-option v-for="data in agentStatus" :key="data.status" :label="data.name" :value="data.status">
          </el-option>
        </el-select>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="fetchData">查询</el-button>
        <el-button v-if="category != 14 && category != 7 && category != 13 && category != 10" type="primary" @click="addAgent()">添加代理商</el-button>
        <el-button v-if="IsCenter == 1" type="primary" @click="onDownload()" :disabled="!tableData.length">导出</el-button>
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
    <el-table-column prop="StatusText" label="状态">
    </el-table-column>
    <el-table-column prop="CreateDate" label="入驻日期" width="130">
    </el-table-column>
    <el-table-column prop="Balance" label="余额" width="130">
    </el-table-column>
    <el-table-column v-if="IsCenter == 1 && category != 7 && category != 13 && category != 14 && category != 10" label="操作" min-width="300">
      <template scope="scope">
        <div v-if="scope.row.Status === 1">
          <el-button @click="viewAgent(scope.row)" type="text" size="small">修改</el-button>
          <el-button @click="deleteAgent(scope.row)" type="text" size="small">删除</el-button>
          <el-button @click="setDiscount(scope.row)" type="text" size="small">设置折扣</el-button>
          <el-button v-if="!scope.row.ChannelName2" @click="setFetation(scope.row)" type="text" size="small">能否添加下级</el-button>
          <el-button @click="setGift(scope.row)" type="text" size="small">礼包设置</el-button>
          <el-button @click="setPromotion(scope.row)" type="text" size="small">活动设置</el-button>
          <el-button  @click="setCustomerSettings(scope.row)" type="text" size="small">客户设置</el-button>
        </div>
        <div v-if="scope.row.Status === 2">
          <el-button @click="viewAgent(scope.row)" type="text" size="small">修改</el-button>
          <el-button @click="deleteAgent(scope.row)" type="text" size="small">删除</el-button>
          <el-button @click="passAgent(scope.row)" type="text" size="small">通过</el-button>
          <el-button @click="refuseAgent(scope.row)" type="text" size="small">驳回</el-button>
        </div>
        <div v-if="scope.row.Status === 3">
          <el-button @click="viewAgent(scope.row)" type="text" size="small">修改</el-button>
          <el-button @click="deleteAgent(scope.row)" type="text" size="small">删除</el-button>
        </div>
      </template>
    </el-table-column>
    <el-table-column v-if="IsCenter == 1 && category == 7 || category == 13" label="操作" width="100px">
      <template scope="scope">
        <el-button  @click="setCustomerSettings(scope.row)" type="text" size="small">客户设置</el-button>
      </template>
    </el-table-column>
    <el-table-column v-if="IsCenter == 0" label="操作" width="100px">
      <template scope="scope">
        <el-button @click="viewAgent(scope.row)" type="text" size="small">修改</el-button>
        <el-button v-if="scope.row.Status !== 1" @click="deleteAgent(scope.row)" type="text" size="small">删除</el-button>
      </template>
    </el-table-column>
  </el-table>
  <el-pagination @size-change="handleSizeChange" @current-change="handleCurrentChange" :current-page="pagination.currentPage" :page-sizes="[10, 20, 30]" :page-size="pagination.pageSize" layout="total, sizes, prev, pager, next, jumper" :total="pagination.total"
    style="text-align:center; margin:20px;">
  </el-pagination>
  <el-dialog title="能否添加下级" :visible.sync="dialog2Visible">
    <el-radio-group v-model="isFetation">
      <el-radio :label="1">可以</el-radio>
      <el-radio :label="0">不可以</el-radio>
    </el-radio-group>
    <div slot="footer" class="dialog-footer">
      <el-button @click="dialog2Cacel">取 消</el-button>
      <el-button type="primary" @click="dialog2Save">确 定</el-button>
    </div>
  </el-dialog>
</div>
</template>
<script>
import GiftSetting from '@/views/components/AgentGiftSettingDialog.vue'
// import PromotionSetting from '@/views/components/AgentPromotionSetting.vue'
import AgentCustomerSetting from '@/views/components/AgentCustomerSetting.vue'
import AgentDialog from '@/views/components/AgentViewDialog.vue'
import PromotionSetting from '@/views/components/promotionSetting'
import Dialog from '../service/dialog.js'
import AgentPass from '@/components/agentPass.vue'
import Refuse from '@/components/refuse.vue'
import {
  getAgents,
  setDiscount,
  setIsFetation,
  remove,
  urlsignkey
} from '../api/api'
export default {
  name: 'agents',
  data: function () {
    return {
      pagination: {
        total: 0,
        pageSize: 10,
        currentPage: 1
      },
      tableData: [],
      searchParam: {
        channelname: '',
        status: 0
      },
      isFetation: false,
      channelId: '',
      dialog2Visible: false,
      category: '',
      IsCenter: '',
      signkey: {},
      agentStatus: [{
        name: '全部',
        status: 0
      }, {
        name: '正常',
        status: 1
      }, {
        name: '未审核',
        status: 2
      }, {
        name: '拒审',
        status: 3
      }],
      RoleId: ''
    }
  },
  created() {
    console.log(JSON.parse(sessionStorage.getItem('userInfo')), 'userInfo')
    var userInfos = JSON.parse(sessionStorage.getItem('userInfo'))
    this.RoleId = userInfos.RoleId
    this.category = userInfos.Category
    this.IsCenter = userInfos.IsCenter
    // this.category = JSON.parse(sessionStorage.getItem('userInfo')).Category
    console.log(this.IsCenter, this.category, 'category')
    this.fetchData()
    this.getsignkey()
  },
  methods: {
    getsignkey() {
      urlsignkey().then((res) => {
        delete res.data.Filename
        delete res.data.key
        delete res.data.callback
        delete res.data.expire
        delete res.data.Host
        this.signkey = res.data
        // this.signkey.key = ''
      })
    },
    handleSizeChange(val) {
      this.pagination.pageSize = val
      this.fetchData()
    },
    handleCurrentChange(val) {
      this.pagination.currentPage = val
      this.fetchData()
    },
    fetchData() {
      let limit = this.pagination.pageSize
      let offset = (this.pagination.currentPage - 1) * limit
      getAgents({
        limit: limit,
        offset: offset,
        channelname: this.searchParam.channelname,
        status: this.searchParam.status
      }).then((res) => {
        this.tableData = res.data
        this.pagination.total = res.Count
      })
    },
    viewAgent(agent) {
      Dialog(AgentDialog, {
        channelId: agent.ChannelId,
        signKey: this.signkey,
        title: '修改代理商'
      }).then(() => {
        this.fetchData()
      })
    },
    addAgent() {
      Dialog(AgentDialog, {
        signKey: this.signkey,
        title: '添加代理商'
      }).then(res => this.fetchData())
    },
    dialog2Cacel: function () {
      this.dialog2Visible = false
    },
    setDiscount(agent) {
      this.$prompt('折扣', '折扣设置', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        inputPattern: /[0-9]{1}/,
        inputErrorMessage: '折扣值不正确',
        inputValue: agent.Discount
      }).then(({
        value
      }) => {
        setDiscount(agent.ChannelId, {
          Discount: value
        }).then((res) => {
          this.$message.info('设置成功！')
          this.fetchData()
        })
      })
    },
    setFetation(agent) {
      this.isFetation = agent.IsFetation
      this.channelId = agent.ChannelId
      this.dialog2Visible = true
    },
    setGift(agent) {
      Dialog(GiftSetting, {
        channelId: agent.ChannelId
      })
    },
    // setPromotion(agent) {
    //   Dialog(PromotionSetting, {
    //     channelId: agent.ChannelId
    //   })
    // },
    setPromotion(agent) {
      // console.log(agent.ChannelId)
      Dialog(PromotionSetting, {
        channelId: agent.ChannelId
      })
    },
    setCustomerSettings(agent) {
      Dialog(AgentCustomerSetting, {
        channelId: agent.ChannelId
      })
    },
    dialog2Save: function () {
      setIsFetation(this.channelId, {
        IsFetation: this.isFetation
      }).then((res) => {
        if (res.status) {
          this.$message.info('保存成功!')
          this.fetchData()
          this.dialog2Visible = false
        } else {
          this.$message.error(res.message)
        }
      })
    },
    deleteAgent(row) {
      this.$confirm('您确定要删除代理商?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        remove(row.ChannelId).then(res => {
          if (res.status) {
            this.$message({
              type: 'success',
              message: '删除成功!'
            })
            this.fetchData()
          }
        })
      }).catch(() => {})
    },
    onDownload() {
      const {
        channelname,
        status
      } = this.searchParam
      const url = `/api/download/exportagents?channelname=${channelname || ''}&status=${status}`
      window.open(url)
    },
    passAgent(row) { // 通过
      row.status = 1
      delete row.cols
      Dialog(AgentPass, {
        row: row,
        sign: 'AGENT'
      }).then(() => {
        this.fetchData()
      })
      // bus.$on('done', () => {
      //   this.fetchData()
      // })
    },
    refuseAgent(row) { // 驳回
      // console.log(row.ChannelId)
      Dialog(Refuse, {
        row: row,
        sign: 'REFUSEAGENT'
      }).then(() => {
        this.fetchData()
      })
      // bus.$on('refuse-agent-success', () => {
      //   this.fetchData()
      // })
    }
  }
}
</script>
<style>
.avatar-uploader .el-upload {
  border: 1px dashed #d9d9d9;
  border-radius: 6px;
  cursor: pointer;
  position: relative;
  overflow: hidden;
}

.avatar-uploader .el-upload:hover {
  border-color: #20a0ff;
}

.avatar-uploader-icon {
  font-size: 28px;
  color: #8c939d;
  width: 178px;
  height: 178px;
  line-height: 178px;
  text-align: center;
}

.avatar {
  width: 178px;
  height: 178px;
  display: block;
}
</style>
