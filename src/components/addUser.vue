<template>
<div class="addUser">
  <el-dialog :title="title" :visible.sync="dialogFormVisible" size="small">
    <el-form :model="ruleForm" :rules="rules" class="demo-ruleForm" ref="ruleForm" label-width="100px">
      <el-form-item label="用户名" prop="UserName">
        <el-input v-if="item.UserId" v-model="ruleForm.UserName" auto-complete="off" :disabled="true"></el-input>
        <el-input v-else v-model="ruleForm.UserName" auto-complete="off"></el-input>
      </el-form-item>
      <el-form-item label="真实姓名" prop="RealName">
        <el-input v-model="ruleForm.RealName" auto-complete="off"></el-input>
      </el-form-item>
      <el-form-item label="邮箱" prop="Email">
        <el-input v-model="ruleForm.Email" auto-complete="off"></el-input>
      </el-form-item>
      <el-form-item label="密码" required>
        <el-input v-model="ruleForm.Password" auto-complete="off"></el-input>
      </el-form-item>
      <el-form-item label="电话" prop="Mobile">
        <el-input v-model="ruleForm.Mobile" auto-complete="off"></el-input>
      </el-form-item>
      <el-form-item label="角色" required>
        <el-select v-model="ruleForm.RoleId" placeholder="请选择" @change="getFunction">
          <el-option v-for="item in modelRoles" :key="item.RoleId" :label="item.RoleName" :value="item.RoleId">
          </el-option>
        </el-select>
      </el-form-item>
      <el-form-item v-if="ruleForm.RoleId === 18 || ruleForm.RoleId === 19 || ruleForm.RoleId === 26  || ruleForm.RoleId === 27 " label="主数据权限" required>
        <AutyMain v-model="mainData"></AutyMain>
      </el-form-item>
      <el-form-item v-if="ruleForm.RoleId === 18 || ruleForm.RoleId === 19 || ruleForm.RoleId === 26  || ruleForm.RoleId === 27 " label="附数据权限">
        <Auty v-model="attData"></Auty>
      </el-form-item>
      <el-form-item v-if="!item.UserId" label="部门" required>
        <el-input v-model="department" auto-complete="off" :disabled="true"></el-input>
      </el-form-item>
      <!-- <el-form-item v-show="ruleForm.RoleId === 18" label="选择大区" required>
        <el-select v-model="ruleForm.ChannelPartitionId" placeholder="请选择">
          <el-option v-for="item in channelpartitions" :key="item.Id" :label="item.PartitionName" :value="item.Id">
          </el-option>
        </el-select>
      </el-form-item> -->
      <!-- <el-form-item class="select-width" v-show="ruleForm.RoleId === 19" label="选择大区" required>
        <el-select v-model="ChannelOperatePartitionId" multiple placeholder="请选择">
          <el-option v-for="item in channelpartitions" :key="item.Id" :label="item.PartitionName" :value="item.Id">
          </el-option>
        </el-select>
      </el-form-item> -->
      <el-form-item label="选择模块" class="clearH" required>
        <el-tree :highlight-current=true ref="tree" :data="dataFunction" :show-checkbox="true" node-key="FunctionId" :props="defaultProps" @check-change="handleNodeClick" :default-checked-keys="defaultCheckedKey">
        </el-tree>
      </el-form-item>
      <el-form-item v-if="item.UserId" label="当前组织" required>
        <el-input v-model="trssSelectedDepartmentName" auto-complete="off" :disabled="true"></el-input>
      </el-form-item>
      <el-form-item v-if="item.UserId" label="选择组织" class="clearH" required>
        <el-tree :highlight-current=true :data="trees" :props="defaultPropsTree" @node-click="handleNodeClick2">
        </el-tree>
      </el-form-item>
    </el-form>
    <div slot="footer" class="dialog-footer">
      <el-button @click="dialogFormVisible = false">取 消</el-button>
      <el-button @click="resetForm('ruleForm')">重 置</el-button>
      <el-button v-if="!item.UserId" type="primary" @click="submitForm('ruleForm')">新 增</el-button>
      <el-button v-if="item.UserId" type="primary" @click="submitForm('ruleForm')">修 改</el-button>
    </div>
  </el-dialog>
</div>
</template>

<script>
import {
  getRoles,
  getFunctions,
  accountChange,
  account,
  getFqList,
  dataauthorityinfos
} from '../api/api'
import Auty from '@/views/components/authority.vue'
import AutyMain from '@/views/components/authoritymain.vue'
export default {
  props: ['department', 'DepartmentId', 'item', 'tree'],
  data() {
    return {
      dialogFormVisible: true,
      title: '新增员工',
      ruleForm: {
        DepartmentId: '',
        UserName: '',
        RealName: '',
        Email: '',
        Password: '',
        Mobile: '',
        FunctionList: [],
        IsCenter: 1,
        RoleId: '',
        ChannelPartitionId: 0 // 大区
      },
      rules: {
        UserName: [{
          required: true,
          message: '请输入用户名',
          trigger: 'blur'
        }, {
          min: 1,
          max: 20,
          message: '长度20个字符内',
          trigger: 'blur'
        }],
        RealName: [{
          required: true,
          message: '请输入真实姓名',
          trigger: 'blur'
        }],
        Email: [{
          required: true,
          message: '请输入邮箱',
          trigger: 'blur'
        }, {
          type: 'email',
          message: '请输入正确的邮箱地址',
          trigger: 'blur,change'
        }],
        Password: [{
          required: true,
          message: '请输入密码',
          trigger: 'blur'
        }, {
          min: 6,
          message: '密码最小长度为6位',
          trigger: 'blur'
        }],
        Mobile: [{
          required: true,
          message: '请输入电话号码',
          trigger: 'blur'
        }, {
          min: 11,
          max: 11,
          message: '请输入正确的手机号码',
          trigger: 'blur'
        }],
        department: [{
          required: true,
          message: '请选择部门',
          trigger: 'blur'
        }],
        dataFunction: [{
          required: true,
          message: '请选择模块',
          trigger: 'blur'
        }]
      },
      modelRoles: [],
      dataFunction: [], // 存放对应角色的权限
      channelpartitions: [], // 存放返回大区
      defaultProps: {
        children: 'children',
        label: 'name'
      },
      trees: [],
      defaultPropsTree: {
        children: 'childs',
        label: 'DepartmentName'
      },
      treeSelectedId: '',
      trssSelectedDepartmentName: '',
      defaultCheckedKey: [], // 放selected为true的id
      curList: '',
      ChannelOperatePartitionId: [],
      initRoleId: '',
      attData: '',
      mainData: ''
    }
  },
  created() {
    // console.log(this.item, '所有信息')
    console.log(this.item, 'item')
    if (this.item.UserId) {
      this.title = '修改员工信息'
      this.ruleForm.UserName = this.item.UserName
      this.ruleForm.RealName = this.item.RealName
      this.ruleForm.Email = this.item.Email
      this.ruleForm.Password = ''
      this.ruleForm.Mobile = this.item.Mobile
      this.ruleForm.RoleId = this.item.RoleId
      this.initRoleId = this.item.RoleId // 存储修改时默认返回的角色
      // 之前选择大区方法 新需求没用
      // console.log(this.ruleForm.RoleId, 'RoleId')
      // if (this.ruleForm.RoleId === 18) {
      //   if (this.item.ChannelPartitionId === 0) {
      //     this.ruleForm.ChannelPartitionId = this.item.ChannelPartitionId
      //   } else {
      //     this.ruleForm.ChannelPartitionId = this.item.ChannelPartitionId ? +this.item.ChannelPartitionId : ''
      //   }
      // } else if (this.ruleForm.RoleId === 19) {
      //   console.log(this.item.ChannelPartitionId, 'this.item.ChannelPartitionId')
      //   this.ruleForm.ChannelPartitionId = this.filterChannelPartitionIdToArr(this.item.ChannelPartitionId)
      //   console.log(this.ruleForm.ChannelPartitionId, 'this.ruleForm.ChannelPartitionId')
      //   this.ChannelOperatePartitionId = this.ruleForm.ChannelPartitionId
      // }
      // console.log(this.item.ChannelPartitionId, 'ChannelPartitionId')
      if (this.item.ChannelPartitionId === 0) {
        this.ruleForm.ChannelPartitionId = this.item.ChannelPartitionId
      } else {
        this.ruleForm.ChannelPartitionId = this.item.ChannelPartitionId ? +this.item.ChannelPartitionId : ''
      }
      this.ruleForm.PartitionName = this.item.PartitionName
      this.getFunction(this.ruleForm.RoleId) // 获取修改时当前角色对应的权限列表
      this.trees = this.tree
      this.curList = JSON.parse(this.item.FunctionList) // 需要一开始处理下让当前返回的selected值变成true
      // console.log(this.curList, '初始返回')
      this.initialFunctionList()
      this.treeSelectedId = this.item.DepartmentId // 初始默认选择的组织
      this.trssSelectedDepartmentName = this.item.DepartmentName ? this.item.DepartmentName : '全部'
      // 主数据权限修改赋值
      this.mainData = {
        partitions: this.item.MainChannelPartitions,
        provinces: this.item.MainProvinces,
        cities: this.item.MainCitys,
        agents: this.item.MainChannels
      }
      console.log(this.mainData, 'this.mainData')
      // 附属数据权限修改赋值
      this.attData = {
        partitions: this.item.AttChannelPartitions,
        provinces: this.item.AttProvinces,
        cities: this.item.AttCitys,
        agents: this.item.AttChannels
      }
    }
    this.getRole()
    this.getChannelpartition()
    // this.getProvinceList()
    // this.getCityList()
    // this.getAgents()
    this.getdataauthorityinfos()
    this.department = this.department ? this.department : 0
    console.log(this.mainData, this.attData, 'data created')
  },
  components: {
    Auty,
    AutyMain
  },
  methods: {
    getdataauthorityinfos() {
      dataauthorityinfos().then((res) => {
        console.log(res)
        this.partitions = res.data[0]
        this.provinces = res.data[1]
        this.cities = res.data[2]
        this.Agents = res.data[3]
      })
    },
    // getProvinceList() {
    //   getProvince().then((res) => {
    //     this.provinces = res.data
    //   })
    // },
    // getCityList() {
    //   getCities().then((res) => {
    //     this.cities = res.data
    //   })
    // },
    // getAgents() {
    //   agents().then((res) => {
    //     this.Agents = res.data
    //   })
    // },
    handleSelectionChange(val) {
      this.multipleSelection = val
    },
    initialFunctionList() {
      var list = this.curList

      function getCheckedItem(list) {
        window._.each(list, (item, key) => {
          item.selectd = true
          if (item.children && item.children.length) {
            getCheckedItem(item.children)
          }
        })
      }
      getCheckedItem(list)
      // console.log(list, 'initialFunctionList')
    },
    // 之前选择大区方法 新需求没用
    // filterChannelPartitionIdToArr(arr) {
    //   if (arr === 0) {
    //     arr = []
    //   } else {
    //     arr = arr.split(',')
    //     for (let i in arr) {
    //       arr[i] = +arr[i]
    //     }
    //   }
    //   return arr
    // },
    getRole() {
      getRoles().then(res => {
        this.modelRoles = res.data
        console.log(this.modelRoles, 'modelRoles')
      })
    },
    getChannelpartition() {
      getFqList().then(res => {
        this.channelpartitions = res.data
      })
    },
    getFunction(RoleId) { // 角色改变时获取权限数据
      console.log(this.initRoleId, RoleId, this.initRoleId === this.ruleForm.RoleId, '修改时默认角色权限')
      this.ruleForm.RoleId = RoleId
      getFunctions(RoleId).then(res => { // 返回值所有带selectd==true属性默认选中
        this.dataFunction = res.data
        if (this.item.UserId && this.initRoleId === this.ruleForm.RoleId) {
          this.handleEditFList()
        } else {
          this.handleCurFList()
        }
        this.defaultCheckedKey = this.getAllSelectedChildId()
      })
    },
    getAllSelectedChildId() {
      var data = this.dataFunction
      var parents = {}
      for (let i in this.dataFunction) {
        parents[this.dataFunction[i]['FunctionId']] = this.dataFunction[i]['FunctionId']
      }
      // console.log(this.curList, 'curList')
      // console.log(parents, 'parents')
      // console.log(data, 'dataFunction')
      let arr = []

      function formatSelected(data) { // 过滤默认被选中的
        if (!window._.isArray(data)) {
          return
        }
        window._.each(data, (item, key) => {
          // console.log(item.FunctionId, item.selectd)
          if (item.selectd && !parents[item.FunctionId]) {
            arr.push(item.FunctionId)
          }
          if (item.children && item.children.length) {
            // console.log(item.children, 'item')
            formatSelected(item.children)
          }
        })
      }
      formatSelected(data)
      // console.log(arr, 'FunctionId selectd')
      return arr
    },
    // 处理节点点选中
    handleNodeClick(data, checked) { // 点击当前如果原来被选中现在就不被选中 原来不被选中现在被选中
      // console.log(arguments, 'checked change')
      data.selectd = checked
      this.handleClickedFList(data)
      // console.log(data, '修改时当前被选中')
      // console.log(this.dataFunction, '修改增加新的')
      this.handleCurFList()
    },
    handleEditFList() {
      var list = this.curList // 处理dataFunction让默认显示
      var dataFunction = this.dataFunction
      var arr = {}

      function getCurItem(list) {
        window._.each(list, (item, key) => {
          arr[item.FunctionId] = item.selectd
          if (item.children && item.children.length) {
            getCurItem(item.children)
          }
        })
      }
      // console.log(arr, 'edit')

      function getCheckedItem(list) {
        window._.each(list, (item, key) => {
          // console.log(arr[item.FunctionId], +item.FunctionId)
          if (arr[item.FunctionId]) {
            item.selectd = true
          } else {
            item.selectd = false
          }
          if (item.children && item.children.length) {
            getCheckedItem(item.children)
          }
        })
      }
      getCurItem(list)
      getCheckedItem(dataFunction)
      // console.log(dataFunction, 'handleEdited dataFunction')
    },
    handleCurFList() {
      var arr = []

      function getCheckedItem(list) {
        window._.each(list, (item, key) => {
          var sonArr = []
          var me = {}
          window._.each(item.children, (item2, key2) => {
            // console.log(item2, item2.selectd, item2.FunctionId)
            if (item2.selectd) {
              sonArr.push(item2)
            }
          })
          // console.log(sonArr, 'sonArr')
          if (sonArr.length > 0) {
            me = Object.assign({}, item)
            me.children = sonArr
            arr.push(me)
          }
        })
      }
      getCheckedItem(this.dataFunction)
      this.curList = arr
      // console.log(arr, 'handleCurFList')
    },
    handleClickedFList(data) {
      function getCheckedItem(list) {
        window._.each(list, (item, key) => {
          // console.log(item.FunctionId, data.FunctionId)
          if (item.FunctionId === data.FunctionId) {
            item = data
          }
          if (item.children && item.children.length) {
            getCheckedItem(item.children)
          }
        })
      }
      var list = this.dataFunction
      getCheckedItem(list)
    },
    handleNodeClick2(data) {
      this.treeSelectedId = data.DepartmentId // 设置当前点击的组织的id给被选中的组织
      this.trssSelectedDepartmentName = data.DepartmentName
    },
    resetForm(formName) {
      this.$refs[formName].resetFields()
    },
    submitForm(formName) {
      // console.log(this.dataFunction, 'ruleForm.FunctionList')
      // return ''
      console.log(this.mainData, this.attData, 'data')
      this.$refs[formName].validate((valid) => {
        if (valid) {
          // console.log(this.treeSelectedId, 'treeSelectedId')
          // this.ruleForm.DepartmentId = this.treeSelectedId
          // console.log(this.ruleForm, 'ruleForm')
          // console.log(accountChange, account, bus)
          this.ruleForm.FunctionList = this.curList
          // console.log(this.curList)
          if (this.ruleForm.RoleId === 19) {
            this.ruleForm.ChannelPartitionId = this.ChannelOperatePartitionId
          }
          // return
          if (!this.ruleForm.RoleId) {
            this.$message({
              message: '请选择角色',
              type: 'warning'
            })
          } else if (this.ruleForm.FunctionList.length === 0) {
            this.$message({
              message: '请选择模块',
              type: 'warning'
            })
          } else {
            // if (this.ruleForm.RoleId === 19) {
            //   this.ruleForm.ChannelPartitionId = this.ruleForm.ChannelPartitionId.join()
            // }
            this.ruleForm.FunctionList = JSON.stringify(this.curList)
            // 提交的时候把主数据权限赋值给后台需要的
            if (this.ruleForm.RoleId === 18 || this.ruleForm.RoleId === 19 || this.ruleForm.RoleId === 26 || this.ruleForm.RoleId === 27) {
              console.log(this.mainData)
              this.ruleForm.MainChannelPartitions = this.mainData.partitions.join(',')
              this.ruleForm.MainProvinces = this.mainData.provinces.join(',')
              this.ruleForm.MainCitys = this.mainData.cities.join(',')
              this.ruleForm.MainChannels = this.mainData.agents.join(',')
              // 提交的时候把附属数据权限赋值给后台需要的
              console.log(this.attData)
              this.ruleForm.AttChannelPartitions = this.attData.partitions instanceof Array ? this.attData.partitions.join(',') : ''
              this.ruleForm.AttProvinces = this.attData.provinces instanceof Array ? this.attData.provinces.join(',') : ''
              this.ruleForm.AttCitys = this.attData.cities instanceof Array ? this.attData.cities.join(',') : ''
              this.ruleForm.AttChannels = this.attData.agents instanceof Array ? this.attData.agents.join(',') : ''
            }
            console.log(this.ruleForm)
            if (this.item.UserId) { // 修改用户
              this.ruleForm.DepartmentId = this.treeSelectedId // 把最终被选择的组织传递给后台 不选择默认就是之前的组织
              console.log(accountChange)
              accountChange(this.item.UserId, this.ruleForm).then((res) => {
                if (res.status) {
                  this.$emit('done')
                  this.dialogFormVisible = false
                }
              })
            } else { // 新增用户
              if (!this.ruleForm.Password) {
                this.$message({
                  message: '请填写密码',
                  type: 'warning'
                })
              } else {
                this.ruleForm.DepartmentId = this.DepartmentId
                console.log(account)
                account(this.ruleForm).then((res) => {
                  if (res.status) {
                    this.$emit('done')
                    this.dialogFormVisible = false
                  }
                })
              }
            }
          }
        } else {
          return false
        }
      })
    }
  }
}
</script>

<style>
.selectd {
  color: red
}

.addUser .clearH .el-form-item__content {
  height: 100%;
}

.addUser .demo-ruleForm {
  padding-right: 80px;
  padding-left: 10px;
}

.addUser .select-width .el-form-item__content {
  height: 100%;
}

.addUser .select-width .el-select {
  width: 100%;
}
</style>
