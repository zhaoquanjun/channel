<template lang="html">
  <div class="header">
  	<el-menu class="el-menu-demo" mode="horizontal" @select="handleSelect">
      <div class="pull-right">
      	<el-submenu index="1">
        <template slot="title">设置</template>
        <el-menu-item index="1-1">修改密码</el-menu-item>
        <el-menu-item index="1-2">退出登陆</el-menu-item>
      </el-submenu>
      </div>
      <div class="pull-right info">
        <span>欢迎 {{userInfo.RoleName}}：</span>
        <span>{{userInfo.RealName}} 进入！</span>
      </div>
      <h4 @click="goMainHtml">PILIPA渠道管理系统</h4>
    </el-menu>
  </div>
</template>
<script>
import Dialog from '../service/dialog.js'
import ModifyPwd from './modifyPwd'
import {
  logout
} from '../api/api'
export default {
  props: ['userInfo'],
  data() {
    return {
      activeIndex2: '1',
      msg: 'Welcome to Your Vue.js App'
    }
  },
  methods: {
    handleSelect(key, keyPath) {
      // console.log(key, keyPath)
      if (key === '1-1') { // 修改密码
        Dialog(ModifyPwd)
      } else if (key === '1-2') { // 退出登录
        logout().then((res) => {
          if (res.status) {
            location.href = '/#login'
          }
        })
      }
    },
    goMainHtml() {
      this.$router.push({name: 'main.home'})
    }
  }
}
</script>
<style>
h1,
h2,
h4 {
  font-weight: normal;
  margin: 12px;
}

ul {
  list-style-type: none;
  padding: 0;
}

a {
  color: #42b983;
}

.info {
  height: 42px;
  line-height: 42px;
  font-size: 14px;
}

.el-menu--horizontal .el-submenu .el-submenu__title {
  height: 42px;
  line-height: 42px;
}

.el-menu--horizontal .el-submenu>.el-menu {
  top: auto;
}
.header h4 {
  cursor: pointer;
}
</style>
