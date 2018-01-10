<template>
<el-dialog :title="title" :visible.sync="isShow" class="add-agent">
  <el-form :inline="true" :model="agent" label-width="150px" :rules="rules" ref="agent">
    <el-form-item label="代理商" required prop="ChannelName">
      <el-input v-model="agent.ChannelName" auto-complete="off"></el-input>
    </el-form-item>
    <el-form-item label="省份" required prop="ProvinceCode">
      <el-select class="option-width" v-model="agent.ProvinceCode" placeholder="请选择" @change="filterCities()">
        <el-option v-for="item in provinces" :key="item.Code" :label="item.Name" :value="item.Code">
        </el-option>
      </el-select>
    </el-form-item>
    <el-form-item label="城市" required prop="CityCode">
      <el-select class="option-width" v-model="agent.CityCode" placeholder="请选择城市">
        <el-option v-for="item in cities" :key="item.Code" :label="item.Name" :value="item.Code"></el-option>
      </el-select>
    </el-form-item>
    <el-form-item label="负责人">
      <el-input v-model="agent.Principal" auto-complete="off"></el-input>
    </el-form-item>
    <el-form-item label="手机">
      <el-input v-model="agent.Mobile" auto-complete="off"></el-input>
    </el-form-item>
    <el-form-item label="邮箱">
      <el-input v-model="agent.Email" auto-complete="off"></el-input>
    </el-form-item>
    <el-form-item label="地址">
      <el-input v-model="agent.Address" auto-complete="off"></el-input>
    </el-form-item>
    <el-form-item label="法人">
      <el-input v-model="agent.LegalPerson" auto-complete="off"></el-input>
    </el-form-item>
    <el-form-item label="开户行">
      <el-input v-model="agent.DepositBank" auto-complete="off"></el-input>
    </el-form-item>
    <el-form-item label="开户行支行">
      <el-input v-model="agent.BranchBank" auto-complete="off"></el-input>
    </el-form-item>
    <el-form-item label="开户名">
      <el-input v-model="agent.AccountName" auto-complete="off"></el-input>
    </el-form-item>
    <el-form-item label="银行账户">
      <el-input v-model="agent.BankAccount" auto-complete="off"></el-input>
    </el-form-item>
    <el-form-item label="保证金" prop="Deposit">
      <el-input v-model="agent.Deposit" auto-complete="off"></el-input>
    </el-form-item>
    <el-form-item label="用户名" prop="UserName" v-if="isCenter && !ismodify">
      <el-input v-model="agent.UserName" auto-complete="off"></el-input>
    </el-form-item>
    <el-form-item label="密码" prop="PassWrod" v-if="isCenter && !ismodify">
      <el-input v-model="agent.PassWrod" auto-complete="off"></el-input>
    </el-form-item>
    <el-row>
      <el-col :span="8" class="text-center">
        <el-upload class="avatar-uploader" :action="uploadUrl" :show-file-list="false" :on-success="handleIdCard" :before-upload="beforeAvatarUpload" thumbnail-mode="true" :data="signKey">
          <img v-if="agent.IdCard" :src="agent.IdCard" class="avatar">
          <i v-else class="el-icon-plus avatar-uploader-icon"></i>
        </el-upload>
        <div>上传身份证</div>
      </el-col>
      <el-col :span="8">
        <el-upload class="avatar-uploader" :action="uploadUrl" :show-file-list="false" :on-success="handleAptitude" :before-upload="beforeAvatarUpload" thumbnail-mode="true" :data="signKey">
          <img v-if="agent.Aptitude" :src="agent.Aptitude" class="avatar">
          <i v-else class="el-icon-plus avatar-uploader-icon"></i>
        </el-upload>
        <div style="padding-left: 60px">代帐资质</div>
      </el-col>
      <el-col :span="8">
        <el-upload class="avatar-uploader" :action="uploadUrl" :show-file-list="false" :on-success="handleDocuments" :before-upload="beforeAvatarUpload" thumbnail-mode="true" :data="signKey">
          <img v-if="agent.Documents" :src="agent.Documents" class="avatar">
          <i v-else class="el-icon-plus avatar-uploader-icon"></i>
        </el-upload>
        <div style="padding-left: 30px">营业执照(三证合一)</div>
      </el-col>
    </el-row>
    <div v-if="agent.Status === 3">
      <div class='add-order-title'>
        <span>拒审原因</span>
      </div>
      <span style="margin-left: 30px">驳回原因：</span>
      <span style="color: red">{{agent.BackReason}}</span>
    </div>
  </el-form>
  <div slot="footer" class="dialog-footer">
    <el-button @click="dialogCacel">取 消</el-button>
    <el-button type="primary" @click="dialogSave('agent')">确 定</el-button>
  </div>
</el-dialog>
</template>
<script>
import {
  getPartitions,
  getProvince,
  getCities,
  saveAgent,
  getAgent
} from '@/api/api'

export default {
  name: 'AgentDialog',
  props: ['channelId', 'signKey', 'title'],
  data() {
    const userInfo = sessionStorage.userInfo && JSON.parse(sessionStorage.userInfo)
    return {
      agent: {
        ChannelPartitionId: '',
        ProvinceCode: '',
        CityCode: '',
        BankAccount: '',
        ChannelName: '',
        IdCard: '',
        Aptitude: '',
        Documents: ''
        // Documents2: '',
        // Documents3: ''
      },
      ismodify: false,
      rules: {
        ChannelName: [{
          required: true,
          message: '请输入代理商名称',
          trigger: 'blur'
        }],
        ProvinceCode: [{
          required: true,
          message: '请选择所在省份',
          trigger: 'change'
        }],
        CityCode: [{
          required: true,
          message: '请选择所在城市',
          trigger: 'change'
        }],
        Deposit: [{
          required: true,
          message: '请输入保证金',
          trigger: 'blur'
        }],
        UserName: [{
          required: true,
          message: '请输入用户名',
          trigger: 'blur'
        }],
        PassWrod: [{
          required: true,
          message: '请输入密码',
          trigger: 'blur'
        }]
      },
      isShow: true,
      isCenter: userInfo.IsCenter,
      allCities: [],
      cities: [],
      partitions: [],
      provinces: [],
      uploadUrl: 'https://pilipa.oss-cn-beijing.aliyuncs.com'
    }
  },
  mounted() {
    if (this.channelId) {
      this.ismodify = true
    } else {
      this.ismodify = false
    }
  },
  created() {
    this.getPartitions()
    this.getParamsProvince()
    this.getParamsCities()
    this.fetchData()
    console.log(this.channelId, 'channelId')
  },
  watch: {
    channelId() {
      this.fetchData()
    }
  },
  methods: {
    getPartitions() {
      getPartitions().then((res) => {
        this.partitions = res.data
        for (let i in this.partitions) {
          this.partitions[i].Id = this.partitions[i].Id + ''
        }
      })
    },
    getParamsProvince() {
      const param = {
        ChannelPartitionIds: ''
      }
      getProvince(param).then((res) => {
        this.provinces = res.data
      })
    },
    getParamsCities() {
      getCities().then((res) => {
        this.allCities = res.data
        this.filterCities()
      })
    },
    filterCities() {
      if (!this.agent.ProvinceCode) {
        this.cities = this.allCities
      } else {
        this.cities = window._.filter(this.allCities, item => {
          return item.ProvinceCode.trim() === this.agent.ProvinceCode.trim()
        })
      }
    },
    random_string(len) {
      len = len || 32
      var chars = 'ABCDEFGHJKMNPQRSTWXYZabcdefhijkmnprstwxyz2345678'
      var maxPos = chars.length
      var pwd = ''
      for (var i = 0; i < len; i++) {
        pwd += chars.charAt(Math.floor(Math.random() * maxPos))
      }
      return pwd
    },
    beforeAvatarUpload(file) {
      let typMap = {
        1: 'FileUploads/Order/CardID/',
        2: 'FileUploads/Order/BusinessLicense/',
        3: 'FileUploads/Order/Contract/',
        4: 'FileUploads/Agent/'
      }
      let date = new Date()
      let nowstr = date.format('yyyy-MM')
      let filename = file.name
      this.signKey.key = typMap[4] + nowstr + '/' + filename + this.random_string(10)
      console.log(this.signKey, 'this.signKey')
      let isJPG = true
      const isLt2M = file.size / 1024 / 1024 < 2
      const reg = /^.*\/(?:png|jpg|bmp|gif|jpeg)$/
      // console.log(file.type.toLowerCase())
      if (!reg.test(file.type.toLowerCase())) {
        this.$message.error('上传头像图片只能是 jpg,bmp,gif,jpeg 格式!')
        isJPG = false
      }

      if (!isLt2M) {
        this.$message.error('上传头像图片大小不能超过 2MB!')
      }
      return isJPG && isLt2M
    },
    handleIdCard(res) {
      res = this.uploadUrl + '/' + this.signKey.key
      this.agent.IdCard = res
      console.log(this.agent.IdCard, 'this.agent.IdCard')
    },
    handleAptitude(res) {
      res = this.uploadUrl + '/' + this.signKey.key
      this.agent.Aptitude = res
    },
    handleDocuments(res) {
      res = this.uploadUrl + '/' + this.signKey.key
      this.agent.Documents = res
    },
    // handleDocuments2(res) {
    //   res = this.uploadUrl + '/' + this.signKey.key
    //   this.agent.Documents2 = res
    // },
    // handleDocuments3(res) {
    //   res = this.uploadUrl + '/' + this.signKey.key
    //   this.agent.Documents3 = res
    // },
    // getCities () {
    //   getCities().then(res => {
    //     this.cities = res.data
    //   })
    // },
    fetchData() {
      if (this.channelId) {
        getAgent(this.channelId).then(res => {
          // console.log(res.data[0], '修改数据赋值')
          var resAgent = res.data[0]
          if (!resAgent.ChannelPartitionId) {
            resAgent.ChannelPartitionId = ''
          }
          this.agent = resAgent
          if (this.agent.ChannelPartitionId === 0) {
            this.agent.ChannelPartitionId = ''
          } else {
            this.agent.ChannelPartitionId = res.data[0].ChannelPartitionId + ''
          }
        })
      }
    },
    // onClose() {
    //   this.$emit('cancel')
    //   setTimeout(() => {
    //     this.$destroy()
    //     this.$el.parentNode.removeChild(this.$el)
    //   }, 1000)
    // },
    dialogSave: function (formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          saveAgent(this.agent).then((res) => {
            if (res.status) {
              this.$message.info('保存成功!')
              this.isShow = false
              this.$emit('done')
            } else {
              this.$message.error(res.message)
            }
          })
        } else {
          return false
        }
      })
    },
    dialogCacel: function () {
      this.isShow = false
    }
  }
}
</script>
<!-- Add "scoped" attribute to limit CSS to this component only -->
<style>
.add-agent .el-form--inline .el-form-item {
  width: 380px;
}
.add-agent .el-dialog--small {
  width: 70%;
}
.add-agent .option-width .el-input {
  width: 192px;
}
.add-agent .el-input__icon+.el-input__inner {
  padding-right: 0;
}
.add-agent .add-order-title {
  height: 25px;
  line-height: 25px;
  border-left: 5px solid #20a0ff;
  padding-left: 10px;
  font-weight: 600;
  font-size: 16px;
  margin-bottom: 20px;
}
</style>
