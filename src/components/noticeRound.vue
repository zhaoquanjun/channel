<template>
<div class="notice-round" v-clickoutside="handleClose">
  <div @click="visible = true" class="select-style">
    <div class="center-rount">{{centerselectedText}}</div>
    <div style="color: #1b9bfc">{{channelselectedText}}</div>
  </div>
  <div class="el-dropdown-menu" v-show="visible">
    <el-tabs v-model="activeName" type="card">
      <el-tab-pane label="渠道内部" name="first">
        <el-checkbox :indeterminate="centerisIndeterminate" v-model="CentercheckAll" @change="CenterhandleCheckAllChange">渠道内部全体</el-checkbox>
        <el-checkbox-group v-model="CenterRoles" @change="CenterhandleCheckedRolesChange">
          <el-checkbox v-for="role in CenterRolesList" :label="role.RoleId" :key="role.RoleId">{{role.RoleName}}</el-checkbox>
        </el-checkbox-group>
      </el-tab-pane>
      <el-tab-pane label="代理商" name="second">
        <el-checkbox :indeterminate="channelisIndeterminate" v-model="ChannelcheckAll" @change="ChannelhandleCheckAllChange">代理商全体</el-checkbox>
        <el-checkbox-group v-model="ChannelRoles" @change="ChannelhandleCheckedRolesChange">
          <el-checkbox v-for="role in ChannelRolesList" :label="role.RoleId" :key="role.RoleId">{{role.RoleName}}</el-checkbox>
        </el-checkbox-group>
      </el-tab-pane>
    </el-tabs>
  </div>
</div>
</template>

<script>
import { getroles } from '@/api/api'
import Clickoutside from 'element-ui/src/utils/clickoutside'
import bus from '@/bus'
export default {
  data() {
    return {
      visible: false,
      selectedText: '',
      activeName: 'first',
      centerisIndeterminate: true,
      channelisIndeterminate: true,
      CentercheckAll: false,
      ChannelcheckAll: false,
      listData: [],
      CenterRolesList: [],
      ChannelRolesList: [],
      CenterRoles: [1],
      CentercheckList: [1, 2, 3, 4, 5, 18, 19, 24, 25, 26, 27],
      ChannelRoles: [],
      ChannelcheckList: [6, 7, 8, 9, 14, 16, 20, 22],
      centerselectedText: '系统管理员',
      channelselectedText: ''
    }
  },
  created() {
    this.getrolesList()
  },
  methods: {
    getrolesList() {
      getroles().then((res) => {
        if (res.status) {
          this.listData = res.data
          this.CenterRolesList = this.listData[0]
          this.ChannelRolesList = this.listData[1]
        }
      })
    },
    CenterhandleCheckAllChange(val) {
      this.CenterRoles = this.CentercheckAll ? this.CentercheckList : []
      this.centerisIndeterminate = false
      if (this.CentercheckAll) {
        this.centerselectedText = '渠道内部全体'
      } else {
        this.centerselectedText = ''
      }
    },
    CenterhandleCheckedRolesChange(value) {
      console.log(value, 'centervalue')
      let checkedCount = value.length
      this.CentercheckAll = checkedCount === this.CenterRolesList.length
      this.centerisIndeterminate = checkedCount > 0 && checkedCount < this.CenterRolesList.length
      // 处理选中文字显示
      console.log(this.CentercheckAll, 'this.CentercheckAll')
      if (this.CentercheckAll) {
        this.centerselectedText = '渠道内部全体'
        return
      }
      var centerLists = this.CenterRolesList
      var curcenterValue = value
      var showText = []
      showText = window._.filter(centerLists, (item) => {
        for (var i in curcenterValue) {
          if (curcenterValue[i] === item.RoleId) {
            return true
          }
        }
      })
      if (!showText.length) return
      var centerArr = []
      for (var j in showText) {
        centerArr.push(showText[j].RoleName)
      }
      this.centerselectedText = centerArr.join(',')
    },
    ChannelhandleCheckAllChange(val) {
      this.ChannelRoles = this.ChannelcheckAll ? this.ChannelcheckList : []
      this.channelisIndeterminate = false
      if (this.ChannelcheckAll) {
        this.channelselectedText = '代理商全体'
      } else {
        this.channelselectedText = ''
      }
    },
    ChannelhandleCheckedRolesChange(value) {
      console.log(value)
      let ChannelcheckedCount = value.length
      this.ChannelcheckAll = ChannelcheckedCount === this.ChannelRolesList.length
      this.channelisIndeterminate = ChannelcheckedCount > 0 && ChannelcheckedCount < this.ChannelRolesList.length
      // 处理选中文字显示
      if (this.ChannelcheckAll) {
        this.channelselectedText = '代理商全体'
        return
      }
      var channelLists = this.ChannelRolesList
      var curcenterValue = value
      var showText = []
      showText = window._.filter(channelLists, (item) => {
        for (var i in curcenterValue) {
          if (curcenterValue[i] === item.RoleId) {
            return true
          }
        }
      })
      console.log(showText, 'showText')
      if (!showText.length) return
      var channelArr = []
      for (var j in showText) {
        channelArr.push(showText[j].RoleName)
      }
      this.channelselectedText = channelArr.join(',')
    },
    handleClose: function() {
      console.log(this.CenterRoles, 'CenterRoles')
      console.log(this.ChannelRoles, 'ChannelRoles')
      var CenterRoles = this.CenterRoles
      var ChannelRoles = this.ChannelRoles
      if (this.CentercheckAll) {
        CenterRoles = 0
      } else {
        if (!this.CenterRoles.length) {
          CenterRoles = ''
        } else {
          CenterRoles = this.CenterRoles.join(',')
        }
      }
      if (this.ChannelcheckAll) {
        ChannelRoles = 0
      } else {
        if (!this.ChannelRoles.length) {
          ChannelRoles = ''
        } else {
          ChannelRoles = this.ChannelRoles.join(',')
        }
      }
      var selectdObj = {
        CenterRoles: CenterRoles,
        ChannelRoles: ChannelRoles
      }
      bus.$emit('selectedRound', selectdObj)
      this.visible = false
    }
  },
  directives: {
    Clickoutside
  }
}
</script>

<style lang="stylus">
.notice-round
  position: relative
  .select-style
    width: 100%
    min-height: 36px
    border: 1px solid #8391a5
    border-radius: 4px
    padding: 3px 10px
    .center-rount
      white-space: nowrap
      text-overflow: ellipsis
      overflow: hidden
      cursor: pointer
  .el-dropdown-menu
    padding: 0
    width: 500px
    overflow: auto
    /* top: auto !important */
    top: -200px
    .el-tabs
      padding-bottom: 0
      margin-top: 0
      .el-tab-pane
        padding: 0 5px
</style>
