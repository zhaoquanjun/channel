<template>
<div>
  <el-dialog title="修改密码" :visible.sync="dialogFormVisible">
    <el-form :model="ruleForm" :rules="rules" class="demo-ruleForm" ref="ruleForm" label-width="100px">
      <el-form-item label="旧密码" prop="Old">
        <el-input v-model="ruleForm.Old" auto-complete="off"></el-input>
      </el-form-item>
      <el-form-item label="新密码" prop="New">
        <el-input type="password" v-model="ruleForm.New" auto-complete="off"></el-input>
      </el-form-item>
      <el-form-item label="确认密码" prop="Confirm">
        <el-input type="password" v-model="ruleForm.Confirm" auto-complete="off"></el-input>
      </el-form-item>
    </el-form>
    <div slot="footer" class="dialog-footer">
      <el-button @click="dialogFormVisible = false">取 消</el-button>
      <el-button type="primary" @click="submitForm('ruleForm')">修 改</el-button>
    </div>
  </el-dialog>
</div>
</template>

<script>
import {
  resetPwd
} from '../api/api'
export default {
  data() {
    var validatePass = (rule, value, callback) => {
      if (value === '') {
        callback(new Error('请输入密码'))
      } else {
        if (this.ruleForm.Confirm !== '') {
          this.$refs.ruleForm.validateField('Confirm')
        }
        callback()
      }
    }
    var validatePass2 = (rule, value, callback) => {
      if (value === '') {
        callback(new Error('请再次输入密码'))
      } else if (value !== this.ruleForm.New) {
        callback(new Error('两次输入密码不一致!'))
      } else {
        callback()
      }
    }
    return {
      dialogFormVisible: true,
      ruleForm: {
        Old: '',
        New: '',
        Confirm: ''
      },
      rules: {
        Old: [{
          required: true,
          message: '请输入旧密码',
          trigger: 'blur'
        },
        {
          min: 6,
          message: '密码长度最少6位',
          trigger: 'blur'
        }
        ],
        New: [{
          required: true,
          validator: validatePass,
          trigger: 'blur'
        },
        {
          min: 6,
          message: '密码长度最少6位',
          trigger: 'blur'
        }
        ],
        Confirm: [{
          required: true,
          validator: validatePass2,
          trigger: 'blur'
        },
        {
          min: 6,
          message: '密码长度最少6位',
          trigger: 'blur'
        }
        ]
      }
    }
  },
  methods: {
    submitForm(formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          resetPwd(this.ruleForm)
          this.dialogFormVisible = false
        } else {
          return false
        }
      })
    }
  }
}
</script>

<style scoped>
</style>
