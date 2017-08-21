<template>
<div>
  <div class="left">
    <h3 class="vheader">组织结构</h3>
    <div class="btn">
      <el-button @click="addItem('add')" type="info" size="small">新增</el-button>
      <el-button @click="addItem('modify')" type="warning" size="small">修改</el-button>
      <el-button @click="deleteItem()" type="danger" size="small">删除</el-button>
    </div>
    <div class="tree btn">
      <el-tree :highlight-current=true :data="data" :props="defaultProps" @current-change="handleNodeClick"></el-tree>
    </div>
  </div>
  <div class="right">
    <h3 class="vheader">员工列表</h3>
    <div class="vsearch">
      <el-form ref="params" :inline="true" :model="params" label-width="80px">
        <el-form-item label="用户名">
          <el-input v-model="params.userName"></el-input>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="getUsers">查询</el-button>
          <el-button type="primary" @click="newUser">添加用户</el-button>
        </el-form-item>
      </el-form>
    </div>
    <el-table :data="tableData" border style="width: 100%">
      <el-table-column prop="UserName" label="用户名" min-width="100">
      </el-table-column>
      <el-table-column prop="RealName" label="姓名" min-width="100">
      </el-table-column>
      <el-table-column prop="Mobile" label="手机" min-width="130">
      </el-table-column>
      <el-table-column prop="Email" label="邮箱" min-width="180">
      </el-table-column>
      <el-table-column prop="RoleName" label="角色" width="130">
      </el-table-column>
      <el-table-column prop="DepartmentName" :formatter="DepartmentNameFormat" label="部门" width="120">
      </el-table-column>
      <el-table-column label="操作" width="130">
        <template scope="scope">
            <el-button @click="newUser(scope.row)" type="text" size="small">查看/修改</el-button>
            <el-button @click="deleteCon(scope.row)" type="text" size="small">删除</el-button>
          </template>
      </el-table-column>
    </el-table>
    <el-pagination @size-change="handleSizeChange" @current-change="handleCurrentChange" :current-page="pagination.currentPage" :page-sizes="[10, 20, 30]" :page-size="pagination.pageSize" layout="total, sizes, prev, pager, next, jumper" :total="pagination.total"
      style="text-align:center; margin:20px;">
    </el-pagination>
  </div>
</div>
</template>

<script>
import {
  userTree,
  usersList,
  addTree,
  removeUser
} from '../api/api'
import bus from '../bus.js'
import Dialog from '../service/dialog.js'
import AddUser from '../components/addUser.vue'
import AddTree from './components/addTree.vue'
import deleteTree from './components/deleteTree.vue'
export default {
  data() {
    return {
      pagination: {
        total: 0,
        pageSize: 10,
        currentPage: 1
      },
      params: {
        userName: ''
      },
      data: [{
        DepartmentId: 0,
        DepartmentName: '全部',
        childs: []
      }],
      defaultProps: {
        children: 'childs',
        label: 'DepartmentName'
      },
      tableData: [],
      DepartmentId: 0,
      selectedTree: {}
    }
  },
  created() {
    // console.log(this)
    this.getTree()
    this.getUsers()
  },
  methods: {
    handleNodeClick(data) {
      this.selectedTree = data // 选中的数据就是data
      this.DepartmentId = data.DepartmentId
      console.log(this.DepartmentId, 'DepartmentId')
      this.getUsers()
    },
    getTree() { // 获取组织结构数据
      userTree().then(res => {
        var curData = res.data
        this.data[0].childs = curData
      })
    },
    getUsers() {
      // 判断DepartmentId的值来实现展示不同的数据
      let limit = this.pagination.pageSize
      let offset = (this.pagination.currentPage - 1) * limit
      let userName = this.params.userName
      let DepartmentId = this.DepartmentId
      usersList(DepartmentId, {
        limit: limit,
        offset: offset,
        userName: userName
      }).then(res => {
        this.tableData = res.data
        this.pagination.total = res.Count
      })
    },
    newUser(row) { // 添加用户 && 修改查看用户
      // console.log(row) // 返回时false 怎么判断当前默认选中？
      var item = ''
      if (row.UserId) {
        var tree = this.data
        item = row
      }
      var department = this.selectedTree.DepartmentName ? this.selectedTree.DepartmentName : '全部' // 默认部门
      Dialog(AddUser, {
        department: department,
        DepartmentId: this.DepartmentId,
        item: item,
        tree: tree
      }).then(() => {
        this.getUsers()
      })
      // bus.$on('updata-users', () => {
      //   this.getUsers()
      // })
    },
    addItem() { // 新增组织结构 根据传递的参数判断是新增还是修改
      var param = arguments[0]
      var title = ''
      var item = {} // 存储传递给后台的tree值
      var ParentID = this.DepartmentId ? this.DepartmentId : 0
      if (param === 'add') {
        title = '新增机构'
        Dialog(AddTree, {
          title: title,
          sign: 'ADD'
        })
      } else if (param === 'modify') {
        title = '修改机构'
        var DepartmentName = this.selectedTree.DepartmentName
        var Description = this.selectedTree.Description
        Dialog(AddTree, {
          title: title,
          name: DepartmentName,
          desc: Description,
          sign: 'MODIFY'
        })
      }
      bus.$on('change-tree', form => {
        // console.log(this) // 用箭头函数改变this是上下文
        if (param === 'add') {
          // console.log(this.selectedTree.ParentID)
          item = {
            DepartmentId: 0,
            DepartmentName: form.name,
            Description: form.desc,
            ParentID: ParentID
          }
          // console.log('add')
          addTree(item).then(res => {
            this.getTree()
          })
        } else if (param === 'modify') {
          this.selectedTree.DepartmentName = form.name
          this.selectedTree.Description = form.desc
          item = this.selectedTree
          addTree(item).then(res => {
            this.getTree()
          })
        }
      })
    },
    deleteItem() {
      // 不可删除条件 1、当二级菜单下面还有东西的时候 并且 2.被选中的tree的ParentID===0的时候 || 被选中的tree的DepartmentId ===null
      // if ((this.data[0].childs.length >= 1 && this.selectedTree.ParentID === 0) || this.selectedTree.DepartmentId === null) {
      //   this.alertMsg()
      //   return false
      // }
      // 传递子组件所有的childs但是要去掉当前选中的tree ==>为了不影响当前展示 把当前选中的tree和所有的子列表全部传递给子组件进行处理
      console.log(this.DepartmentId, 'deleteDepartmentId')
      // console.log(this.data[0].childs, '全部组织列表')
      var modelTree = this.formatTree(this.data[0].childs, this.selectedTree)
      Dialog(deleteTree, {
        modelTree: modelTree,
        curId: this.DepartmentId
      })
      bus.$on('delete-tree', () => {
        this.getTree()
      })
    },
    formatTree(tree, selectedTree) { // 去掉当前选中的tree
      // console.log(tree, '全部tree')
      if (!window._.isArray(tree)) {
        return
      }
      window._.each(tree, (item, key) => {
        // console.log(item, '当前tree') // 选择的
        if (item.DepartmentId === selectedTree.DepartmentId) {
          tree.splice(key, 1)
          return false
        } else if (item.childs.length > 0) {
          this.formatTree(item.childs, selectedTree)
        }
      })
      return tree
    },
    alertMsg() {
      this.$notify.error({
        title: '警告',
        message: '不容许删除'
      })
    },
    deleteCon(row) {
      this.$confirm('您确定要删除该员工吗?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        removeUser(row.UserId).then(res => {
          if (res.status) {
            this.$message({
              type: 'success',
              message: '删除成功!'
            })
            this.getUsers()
          }
        })
      }).catch(() => {
        this.$message({
          type: 'info',
          message: '已取消删除'
        })
      })
    },
    handleSizeChange(val) {
      this.pagination.pageSize = val
      this.getUsers()
    },
    handleCurrentChange(val) {
      this.pagination.currentPage = val
      this.getUsers()
    },
    DepartmentNameFormat: function(row) {
      var DepartmentId = row.DepartmentId
      var DepartmentName = row.DepartmentName
      if (!DepartmentName && DepartmentId === 0) {
        DepartmentName = '全部'
      }
      return DepartmentName
    }
  }
}
</script>

<style scoped>
.left {
  float: left;
  width: 200px;
  margin-left: 10px;
}

.right {
  margin-left: 220px;
}

.btn {
  padding-top: 10px;
  padding-left: 15px;
}
</style>
