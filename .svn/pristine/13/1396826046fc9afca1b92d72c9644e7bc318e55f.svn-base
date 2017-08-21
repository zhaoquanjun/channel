<template>
<div>
  <el-dialog title="删除机构" :visible.sync="dialogFormVisible">
    <el-form :model="ruleForm" :rules="rules" class="demo-ruleForm" ref="ruleForm" label-width="100px">
      <el-form-item label="移入新机构" prop="name">
        <el-input v-model="ruleForm.name" auto-complete="off"></el-input>
      </el-form-item>
    </el-form>
    <div class="treeChild">
      <el-tree :highlight-current=true :data="data" :props="defaultProps" @node-click="handleNodeClick"></el-tree>
    </div>
    <div slot="footer" class="dialog-footer">
      <el-button @click="cancel">取 消</el-button>
      <el-button type="primary" @click="submitForm('ruleForm')">删 除</el-button>
    </div>
  </el-dialog>
</div>
</template>

<script>
import {
  deleteTree
} from '../../api/api'
import bus from '../../bus.js'
export default {
  props: ['modelTree', 'curId'],
  data() {
    return {
      dialogFormVisible: true,
      ruleForm: {
        name: ''
      },
      rules: {
        name: [{
          required: true,
          message: '请选择新机构',
          trigger: 'blur'
        }]
      },
      data: [], // 接受组织树
      defaultProps: {
        children: 'childs',
        label: 'DepartmentName'
      },
      modelSelectedTree: {}
    }
  },
  created() {
    this.data = this.modelTree
    this.ruleForm.name = this.data[0].DepartmentName // 设置初始input框内值是默认第一个
    this.modelSelectedTree.DepartmentId = this.data[0].DepartmentId
  },
  methods: {
    handleNodeClick(data) {
      this.modelSelectedTree = data // 选中的数据就是data
      // 点击时候改变input的值值是当前被选中的
      this.ruleForm.name = data.DepartmentName
    },
    submitForm(formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          // 删除数据 传递要移入的新的级别的DepartmentId给父组件
          // bus.$emit('delete-tree', this.ruleForm)
          deleteTree(this.curId, this.modelSelectedTree.DepartmentId).then((res) => {
            if (res.status) {
              bus.$emit('delete-tree')
            }
          })
          this.dialogFormVisible = false
        } else {
          return false
        }
      })
    },
    cancel() { // 为了解决过滤杯选中的组织级别而产生的bug
      bus.$emit('delete-tree')
      this.dialogFormVisible = false
    }
  }
}
</script>

<style scoped>
</style>
