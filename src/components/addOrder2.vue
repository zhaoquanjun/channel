<template>
  <div>
    <el-dialog title='订单查看' :visible.sync='dialogFormVisible' size='mini'>
      <div class='container add-order-container'>
        <el-form ref='form' :rules='rules' :model='form' label-width='180px'>
          <div>
            <el-row>
              <el-col :span='24'>
                <el-form-item label='账户余额：'>
                  <span style='color: red;'>￥48600</span>
                </el-form-item>
              </el-col>
            </el-row>
            <el-row>
              <el-col :span='24'>
                <el-form-item label='销售：'>
                  <el-select v-model='value' placeholder='请选择'>
                    <el-option
                      v-for='item in options'
                      :key='item.value'
                      :label='item.label'
                      :value='item.value'>
                    </el-option>
                  </el-select>
                </el-form-item>
              </el-col>
            </el-row>

            <el-form-item label-width='100px'>
              <el-checkbox v-model='checked'>预提单</el-checkbox>
            </el-form-item>

            <div class='gray-line'></div>

            <div class='add-order-title'>
              <span>基本信息</span>
            </div>

            <div class='custom-tips mb-10'>
              <i class='fa fa-exclamation-circle' aria-hidden='true'></i>
              <span>【温馨提示】支持对二代居民身份证的关键字段识别。上传身份证后，即可自动读取并带出姓名、身份证号等信息。</span>
            </div>

            <el-row>
              <el-col :span='12'>
                <el-form-item label='公司名称：' prop='name'>
                  <el-autocomplete
                    class='company-search'
                    v-model='form.state2'
                    :fetch-suggestions='querySearch'
                    placeholder='请输入内容'
                    :trigger-on-focus='false'
                    @select='handleSelect'
                  >
                    <template slot='append'>快速录入</template>
                  </el-autocomplete>
                </el-form-item>
              </el-col>
              <el-col :span='12'>
                <el-form-item label='所在城市：'>
                  <el-select v-model='value' placeholder='请选择'>
                    <el-option
                      v-for='item in options'
                      :key='item.value'
                      :label='item.label'
                      :value='item.value'>
                    </el-option>
                  </el-select>
                </el-form-item>
              </el-col>
            </el-row>
            <el-row>
              <el-col :span='12'>
                <el-form-item label='联系人：' prop='name'>
                  <el-input v-model='form.name'></el-input>
                </el-form-item>
              </el-col>
              <el-col :span='12'>
                <el-form-item label='手机号：'>
                  <el-input v-model='form.name'></el-input>
                </el-form-item>
              </el-col>
            </el-row>

            <div class='add-order-title'>
              <span>工商信息</span>
            </div>

            <el-row>
              <el-col :span='12'>
                <custom-upload v-model='path' :uploaded="uploaded" title='请上传清晰的身份证人像面，图片大小不要超过1M' disabled='disabled'></custom-upload>
                <custom-upload v-model='path2' :uploaded="uploaded" title='请上传清晰的营业执照，图片大小不要超过1M' class='mt-30'></custom-upload>
              </el-col>
              <el-col :span='12'>
                <el-form-item label='法人姓名：' prop='name'>
                  <el-input v-model='form.name'></el-input>
                </el-form-item>
                <el-form-item label='法人身份证号：' prop='name'>
                  <el-input v-model='form.name'></el-input>
                </el-form-item>
                <el-form-item label='公司住所：' prop='name'>
                  <el-input v-model='form.name'></el-input>
                </el-form-item>
                <el-form-item label='社会统一信用代码：' prop='name'>
                  <el-input v-model='form.name'></el-input>
                </el-form-item>
                <el-form-item label='营业期限：' prop='name'>
                  <el-input v-model='form.name'></el-input>
                </el-form-item>
                <el-form-item label='注册资金：' prop='name'>
                  <el-input v-model='form.name'></el-input>
                </el-form-item>
                <el-form-item label='经营范围：' prop='name'>
                  <el-input type='textarea' v-model='form.name' :rows=8></el-input>
                </el-form-item>
              </el-col>
            </el-row>

            <div class='add-order-title'>
              <span>合同信息</span>
            </div>

            <el-row>
              <el-col :span='12'>
                <el-form-item label='合同编号：' prop='name'>
                  <el-input v-model='form.name'></el-input>
                </el-form-item>
              </el-col>
              <el-col :span='12'>
                <el-form-item label='纳税人类别：' prop='name'>
                  <el-radio-group v-model='form.type'>
                    <el-radio label='小规模'></el-radio>
                    <el-radio label='一般纳税人'></el-radio>
                  </el-radio-group>
                </el-form-item>
              </el-col>
            </el-row>

            <el-form-item label='社经营范围：' prop='name'>
              <el-input type='textarea' v-model='form.name'></el-input>
            </el-form-item>

            <div style='float: right; margin-top: 20px;'>
              <el-button icon='el-icon-arrow-left' @click="dialogFormVisible = false">取消</el-button>
              <el-button type='warning' @click="submitForm('form')">保存</el-button>
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
        restaurants: [],
        form: {
          name: '',
          region: '',
          date1: '',
          date2: '',
          delivery: false,
          type: [],
          resource: '',
          desc: '',
          state2: ''
        },
        path: 'https://pilipa.oss-cn-beijing.aliyuncs.com/FileUploads/Order/CardID/201711/GQYAxBRFr2.png',
        path2: '',
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
    watch: {
      'path': function () {
        console.log(arguments)
      }
    },
    components: {
      customUpload
    },
    mounted () {
      this.restaurants = this.loadAll()
    },
    methods: {
      submitForm (formName) {
        this.$refs[formName].validate((valid) => {
          if (valid) {
            alert('submit!')
          } else {
            console.log('error submit!!')
            return false
          }
        })
      },
      uploaded () {
        // alert('上传完毕')
      },
      querySearch (queryString, cb) {
        var restaurants = this.restaurants
        var results = queryString ? restaurants.filter(this.createFilter(queryString)) : restaurants
        // 调用 callback 返回建议列表的数据
        cb(results)
      },
      createFilter (queryString) {
        return (restaurant) => {
          return (restaurant.value.toLowerCase().indexOf(queryString.toLowerCase()) === 0)
        }
      },
      loadAll() {
        return [
          { 'value': '三全鲜食（北新泾店）', 'address': '长宁区新渔路144号' },
          { 'value': 'Hot honey 首尔炸鸡（仙霞路）', 'address': '上海市长宁区淞虹路661号' },
          { 'value': '新旺角茶餐厅', 'address': '上海市普陀区真北路988号创邑金沙谷6号楼113' },
          { 'value': '泷千家(天山西路店)', 'address': '天山西路438号' },
          { 'value': '胖仙女纸杯蛋糕（上海凌空店）', 'address': '上海市长宁区金钟路968号1幢18号楼一层商铺18-101' },
          { 'value': '贡茶', 'address': '上海市长宁区金钟路633号' },
          { 'value': '豪大大香鸡排超级奶爸', 'address': '上海市嘉定区曹安公路曹安路1685号' },
          { 'value': '茶芝兰（奶茶，手抓饼）', 'address': '上海市普陀区同普路1435号' },
          { 'value': '十二泷町', 'address': '上海市北翟路1444弄81号B幢-107' },
          { 'value': '星移浓缩咖啡', 'address': '上海市嘉定区新郁路817号' },
          { 'value': '阿姨奶茶/豪大大', 'address': '嘉定区曹安路1611号' },
          { 'value': '新麦甜四季甜品炸鸡', 'address': '嘉定区曹安公路2383弄55号' },
          { 'value': 'Monica摩托主题咖啡店', 'address': '嘉定区江桥镇曹安公路2409号1F，2383弄62号1F' },
          { 'value': '浮生若茶（凌空soho店）', 'address': '上海长宁区金钟路968号9号楼地下一层' },
          { 'value': 'NONO JUICE  鲜榨果汁', 'address': '上海市长宁区天山西路119号' },
          { 'value': 'CoCo都可(北新泾店）', 'address': '上海市长宁区仙霞西路' },
          { 'value': '快乐柠檬（神州智慧店）', 'address': '上海市长宁区天山西路567号1层R117号店铺' },
          { 'value': 'Merci Paul cafe', 'address': '上海市普陀区光复西路丹巴路28弄6号楼819' },
          { 'value': '猫山王（西郊百联店）', 'address': '上海市长宁区仙霞西路88号第一层G05-F01-1-306' },
          { 'value': '枪会山', 'address': '上海市普陀区棕榈路' },
          { 'value': '纵食', 'address': '元丰天山花园(东门) 双流路267号' },
          { 'value': '钱记', 'address': '上海市长宁区天山西路' },
          { 'value': '壹杯加', 'address': '上海市长宁区通协路' },
          { 'value': '唦哇嘀咖', 'address': '上海市长宁区新泾镇金钟路999号2幢（B幢）第01层第1-02A单元' },
          { 'value': '爱茜茜里(西郊百联)', 'address': '长宁区仙霞西路88号1305室' },
          { 'value': '爱茜茜里(近铁广场)', 'address': '上海市普陀区真北路818号近铁城市广场北区地下二楼N-B2-O2-C商铺' },
          { 'value': '鲜果榨汁（金沙江路和美广店）', 'address': '普陀区金沙江路2239号金沙和美广场B1-10-6' },
          { 'value': '开心丽果（缤谷店）', 'address': '上海市长宁区威宁路天山路341号' },
          { 'value': '超级鸡车（丰庄路店）', 'address': '上海市嘉定区丰庄路240号' },
          { 'value': '妙生活果园（北新泾店）', 'address': '长宁区新渔路144号' },
          { 'value': '香宜度麻辣香锅', 'address': '长宁区淞虹路148号' },
          { 'value': '凡仔汉堡（老真北路店）', 'address': '上海市普陀区老真北路160号' },
          { 'value': '港式小铺', 'address': '上海市长宁区金钟路968号15楼15-105室' },
          { 'value': '蜀香源麻辣香锅（剑河路店）', 'address': '剑河路443-1' },
          { 'value': '北京饺子馆', 'address': '长宁区北新泾街道天山西路490-1号' },
          { 'value': '饭典*新简餐（凌空SOHO店）', 'address': '上海市长宁区金钟路968号9号楼地下一层9-83室' },
          { 'value': '焦耳·川式快餐（金钟路店）', 'address': '上海市金钟路633号地下一层甲部' },
          { 'value': '动力鸡车', 'address': '长宁区仙霞西路299弄3号101B' },
          { 'value': '浏阳蒸菜', 'address': '天山西路430号' },
          { 'value': '四海游龙（天山西路店）', 'address': '上海市长宁区天山西路' },
          { 'value': '樱花食堂（凌空店）', 'address': '上海市长宁区金钟路968号15楼15-105室' },
          { 'value': '壹分米客家传统调制米粉(天山店)', 'address': '天山西路428号' },
          { 'value': '福荣祥烧腊（平溪路店）', 'address': '上海市长宁区协和路福泉路255弄57-73号' },
          { 'value': '速记黄焖鸡米饭', 'address': '上海市长宁区北新泾街道金钟路180号1层01号摊位' },
          { 'value': '红辣椒麻辣烫', 'address': '上海市长宁区天山西路492号' },
          { 'value': '(小杨生煎)西郊百联餐厅', 'address': '长宁区仙霞西路88号百联2楼' },
          { 'value': '阳阳麻辣烫', 'address': '天山西路389号' },
          { 'value': '南拳妈妈龙虾盖浇饭', 'address': '普陀区金沙江路1699号鑫乐惠美食广场A13' }
        ]
      },
      handleSelect (item) {
        console.log(item)
      }
    }
  }
</script>
<style lang='stylus' scoped>
  .container
    width: 1200px
    margin-bottom: 20px
    overflow: hidden
    .company-search
      width: 300px !important
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
  .mt-30
    margin-top: 30px
</style>
<style lang='stylus'>
  .add-order-container
    form
      input, textarea
        width: 300px
      input:nth-child(2)
        width: 120px
    .company-search
      input
        width: 220px
      .el-input-group__append
        width: 80px
        text-align: center
        background-color: #1a9bfc
        color: white
        border: none
        cursor: pointer
</style>
