<template>
<el-dialog title="客户设置" :visible.sync="isShow">
  <el-row :gutter="20">
    <el-col :span="6">客户类型</el-col>
    <el-col :span="6">库容（/个）</el-col>
    <el-col :span="6">跟进期限（/天）</el-col>
    <el-col :span="6">最大保护期（/天）</el-col>
  </el-row>
  <el-row :gutter="20" :key="index" v-for="(setting,index) in settings" :keys="setting.Id">
    <el-col :span="6">{{setting.Name}}</el-col>
    <el-col :span="6">
      <el-input v-model="setting.Repertory"></el-input>
    </el-col>
    <el-col :span="6">
      <el-input v-model="setting.NoTrackDate"></el-input>
    </el-col>
    <el-col :span="6">
      <el-input v-model="setting.LongestData"></el-input>
    </el-col>
  </el-row>
  <div slot="footer" class="dialog-footer">
    <el-button @click="dialogCacel">取 消</el-button>
    <el-button type="primary" @click="dialogSave">确 定</el-button>
  </div>
</el-dialog>
</template>
<script>
import {
  getCustomerSettings,
  saveCustomerSettings
} from '@/api/api'
export default {
  name: 'PromotionSetting',
  props: ['channelId'],
  data() {
    return {
      settings: [],
      isShow: true,
      addPromotion: {
        PromotionId: 1,
        StartDate: '',
        EndDate: ''
      },
      tableData: [],
      rules: {
        rnumber: [{
          required: true,
          trigger: 'blur'
        }, {
          type: 'number',
          message: '年龄必须为数字值',
          trigger: 'blur'
        }]
      }
    }
  },
  created() {
    this.getCustomerSettings()
  },
  watch: {
    channelId() {
      this.getCustomerSettings()
    }
  },
  methods: {
    getCustomerSettings() {
      const params = {
        ChannelId: this.channelId
      }
      getCustomerSettings(params).then((res) => {
        this.settings = res.data
      })
    },
    dialogSave() {
      saveCustomerSettings(this.settings).then(res => {
        if (res.status) {
          this.$message.info('保存成功!')
          this.isShow = false
          this.$emit('done')
        } else {
          this.$message.error(res.message)
        }
      })
    },
    dialogCacel: function() {
      this.isShow = false
    }
  }
}
</script>
<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
.el-row {
  line-height: 36px;
  margin: 12px 0;
}
</style>
