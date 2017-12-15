<template>
<div class="notice-round" v-clickoutside="handleClose">
  <div @click="visible = true" class="select-style">
    <span>{{selectedText}}</span>
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
        <el-checkbox :indeterminate="channelisIndeterminate" v-model="ChannelcheckAll" @change="ChannelhandleCheckAllChange">渠道内部全体</el-checkbox>
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
      ChannelcheckList: [6, 7, 8, 9, 14, 16, 20, 22]
    }
  },
  created() {
    this.getrolesList()
  },
  methods: {
    getrolesList() {
      getroles().then((res) => {
        console.log(res)
        if (res.status) {
          this.listData = res.data
          this.CenterRolesList = this.listData[0]
          this.ChannelRolesList = this.listData[1]
        }
      })
    },
    CenterhandleCheckAllChange(val) {
      console.log(this.CentercheckAll, val)
      this.CenterRoles = this.CentercheckAll ? this.CentercheckList : []
      this.centerisIndeterminate = false
    },
    CenterhandleCheckedRolesChange(value) {
      console.log(value)
      let checkedCount = value.length
      this.CentercheckAll = checkedCount === this.CenterRolesList.length
      this.centerisIndeterminate = checkedCount > 0 && checkedCount < this.CenterRolesList.length
    },
    ChannelhandleCheckAllChange(val) {
      console.log(this.ChannelcheckAll, val)
      this.ChannelRoles = this.ChannelcheckAll ? this.ChannelcheckList : []
      this.channelisIndeterminate = false
    },
    ChannelhandleCheckedRolesChange(value) {
      console.log(value)
      let ChannelcheckedCount = value.length
      this.CentercheckAll = ChannelcheckedCount === this.ChannelRolesList.length
      this.channelisIndeterminate = ChannelcheckedCount > 0 && ChannelcheckedCount < this.ChannelRolesList.length
    },
    handleClose: function() {
      this.visible = false
    }
  },
  directives: {
    Clickoutside
  }
}
</script>

<style lang="stylus" scoped>
.notice-round
  position: relative
  .select-style
    width: 100%
    min-height: 36px
    border: 1px solid #8391a5
    border-radius: 4px
    padding: 3px 10px
  .el-dropdown-menu
    width: 500px
    overflow: auto
    top: auto !important
</style>
