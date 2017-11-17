<template>
  <div>
    <el-dialog title="订单查看" :visible.sync="dialogFormVisible" size="mini">
      <div class="container add-order-container">
        <el-form ref="form" :rules="rules" :model="form" label-width="180px">
          <div>
            <el-row>
              <el-col :span="24">
                <el-form-item label="账户余额：">
                  <span style="color: red;">￥48600</span>
                </el-form-item>
              </el-col>
            </el-row>
            <el-row>
              <el-col :span="24">
                <el-form-item label="销售：">
                  <el-select v-model="value" placeholder="请选择">
                    <el-option
                      v-for="item in options"
                      :key="item.value"
                      :label="item.label"
                      :value="item.value">
                    </el-option>
                  </el-select>
                </el-form-item>
              </el-col>
            </el-row>

            <el-form-item label-width="100px">
              <el-checkbox v-model="checked">预提单</el-checkbox>
            </el-form-item>

            <div class="gray-line"></div>

            <div class="add-order-title">
              <span>基本信息</span>
            </div>

            <div class="custom-tips mb-10">
              <i class="fa fa-exclamation-circle" aria-hidden="true"></i>
              <span>【温馨提示】支持对二代居民身份证的关键字段识别。上传身份证后，即可自动读取并带出姓名、身份证号等信息。</span>
            </div>

            <el-row>
              <el-col :span="12">
                <el-form-item label="公司名称：" prop="name">
                  <el-input v-model="form.name"></el-input>
                </el-form-item>
              </el-col>
              <el-col :span="12">
                <el-form-item label="所在城市：">
                  <el-select v-model="value" placeholder="请选择">
                    <el-option
                      v-for="item in options"
                      :key="item.value"
                      :label="item.label"
                      :value="item.value">
                    </el-option>
                  </el-select>
                </el-form-item>
              </el-col>
            </el-row>
            <el-row>
              <el-col :span="12">
                <el-form-item label="联系人：" prop="name">
                  <el-input v-model="form.name"></el-input>
                </el-form-item>
              </el-col>
              <el-col :span="12">
                <el-form-item label="手机号：">
                  <el-input v-model="form.name"></el-input>
                </el-form-item>
              </el-col>
            </el-row>

            <div class="add-order-title">
              <span>工商信息</span>
            </div>

            <el-row>
              <el-col :span="12">
                <custom-upload v-model="path"></custom-upload>
                <custom-upload class="mt-20"></custom-upload>
              </el-col>
              <el-col :span="12">
                <el-form-item label="法人姓名：" prop="name">
                  <el-input v-model="form.name"></el-input>
                </el-form-item>
                <el-form-item label="法人身份证号：" prop="name">
                  <el-input v-model="form.name"></el-input>
                </el-form-item>
                <el-form-item label="公司住所：" prop="name">
                  <el-input v-model="form.name"></el-input>
                </el-form-item>
                <el-form-item label="社会统一信用代码：" prop="name">
                  <el-input v-model="form.name"></el-input>
                </el-form-item>
                <el-form-item label="营业期限：" prop="name">
                  <el-input v-model="form.name"></el-input>
                </el-form-item>
                <el-form-item label="注册资金：" prop="name">
                  <el-input v-model="form.name"></el-input>
                </el-form-item>
                <el-form-item label="社经营范围：" prop="name">
                  <el-input type="textarea" v-model="form.name"></el-input>
                </el-form-item>
              </el-col>
            </el-row>

            <div class="add-order-title">
              <span>合同信息</span>
            </div>

            <el-row>
              <el-col :span="12">
                <el-form-item label="合同编号：" prop="name">
                  <el-input v-model="form.name"></el-input>
                </el-form-item>
              </el-col>
              <el-col :span="12">
                <el-form-item label="纳税人类别：" prop="name">
                  <el-radio-group v-model="form.type">
                    <el-radio label="小规模"></el-radio>
                    <el-radio label="一般纳税人"></el-radio>
                  </el-radio-group>
                </el-form-item>
              </el-col>
            </el-row>

            <el-form-item label="社经营范围：" prop="name">
              <el-input type="textarea" v-model="form.name"></el-input>
            </el-form-item>

            <div style="float: right; margin-top: 20px;">
              <el-button icon="el-icon-arrow-left">取消</el-button>
              <el-button type="warning">保存</el-button>
            </div>

          </div>
        </el-form>
      </div>
    </el-dialog>
  </div>
</template>
<script>
  import customUpload from '@/components/customUpload'
  export default {
    props: ['postData', 'modify', 'channelid'],
    data () {
      return {
        dialogFormVisible: true,
        form: {
          name: '',
          region: '',
          date1: '',
          date2: '',
          delivery: false,
          type: [],
          resource: '',
          desc: ''
        },
        path: 'https://pilipa.oss-cn-beijing.aliyuncs.com/FileUploads/Order/CardID/201711/7SzQRwPHAH.png',
        options: [{
          value: '选项1',
          label: '黄金糕'
        }, {
          value: '选项2',
          label: '双皮奶'
        }, {
          value: '选项3',
          label: '蚵仔煎'
        }, {
          value: '选项4',
          label: '龙须面'
        }, {
          value: '选项5',
          label: '北京烤鸭'
        }],
        value: '',
        checked: false,
        rules: {
          name: [
            { required: true, message: '请输入活动名称', trigger: 'blur' },
            { min: 3, max: 5, message: '长度在 3 到 5 个字符', trigger: 'blur' }
          ],
          region: [
            { required: true, message: '请选择活动区域', trigger: 'change' }
          ],
          date1: [
            { type: 'date', required: true, message: '请选择日期', trigger: 'change' }
          ],
          date2: [
            { type: 'date', required: true, message: '请选择时间', trigger: 'change' }
          ],
          type: [
            { type: 'array', required: true, message: '请至少选择一个活动性质', trigger: 'change' }
          ],
          resource: [
            { required: true, message: '请选择活动资源', trigger: 'change' }
          ],
          desc: [
            { required: true, message: '请填写活动形式', trigger: 'blur' }
          ]
        }
      }
    },
    components: {
      customUpload
    },
    mounted () {
    },
    methods: {
    }
  }
</script>
<style lang="stylus" scoped>
  .container
    width: 1200px
    margin-bottom: 20px
    overflow: hidden
    .gray-line
      height: 1px
      width: 100%
      background-color: #ccc
    .add-order-title
      height: 22px
      line-height: 22px
      margin: 14px 0px
      &:after
        float: left
        width: 5px
        height: 100%
        background-color: #1a9bfc
        content: ''
        margin-right: 8px
      span
        font-size: 16px
        color: black
    .custom-tips
      padding: 8px 0px
      line-height: 36px
      width: 100%
      background-color: #f3fafa
      color: #1b9bfc
      font-size: 14px
      padding: 0px 10px
  .mb-10
    margin-bottom: 10px
  .mt-20
    margin-top: 20px
</style>
<style lang="stylus">
  .add-order-container
    form
      input, textarea
        width: 300px
      input:nth-child(2)
        width: 120px
</style>
