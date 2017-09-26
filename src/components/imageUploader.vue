<template>
<div class="image-uploader">
  <img :src="value" v-show="value">
  <el-upload :on-success="handleSuccess" :before-upload="beforeUpload" :action="action" :file-list="fileList" :show-file-list="false" v-show="!readonly" :data="signKey">
    <el-button size="small" type="primary">点击上传</el-button>
    <div slot="tip" class="el-upload__tip">上传的图片大小请不要超过1M</div>
  </el-upload>
</div>
</template>
<script>
import Viewer from 'viewerjs'
import 'viewerjs/dist/viewer.css'
export default {
  name: 'searchParams',
  props: ['type', 'value', 'readonly', 'signKey'],
  data() {
    return {
      fileList: [],
      viewer: null,
      action: ''
    }
  },
  mounted() {
    let that = this
    // console.log(this.$el)
    this.viewer = new Viewer(this.$el.querySelector('img'), {
      navbar: false,
      title: false,
      zIndex: 9999,
      view: function () {
        document.onclick = function (e) {
          if (e.target.className === 'viewer-canvas') that.viewer.hide()
        }
      }
    })
  },
  created() {
    // console.log(this.signKey, 'signKey')
    this.handleAction()
  },
  methods: {
    random_string(len) {
      len = len || 32
      var chars = 'ABCDEFGHJKMNPQRSTWXYZabcdefhijkmnprstwxyz2345678'
      var maxPos = chars.length
      var pwd = ''
      for (var i = 0; i < len; i++) {
        pwd += chars.charAt(Math.floor(Math.random() * maxPos))
      }
      return pwd
    },
    beforeUpload(file) {
      // console.log(file)
      let typMap = {
        1: 'FileUploads/Order/CardID/',
        2: 'FileUploads/Order/BusinessLicense/',
        3: 'FileUploads/Order/Contract/',
        4: 'FileUploads/Agent/'
      }
      let date = new Date()
      let nowstr = date.format('yyyy-MM')
      let filename = file.name
      this.signKey.key = typMap[this.type] + nowstr + '/' + filename + this.random_string(10)
      // console.log(this.signKey, 'this.signKey')
    },
    handleSuccess(res) {
      res = 'https://pilipa.oss-cn-beijing.aliyuncs.com/' + this.signKey.key
      // console.log(res)
      this.$emit('input', res)
    },
    handleAction() {
      let uploadUrl = 'https://pilipa.oss-cn-beijing.aliyuncs.com'
      this.action = uploadUrl
      // console.log(this.action, 'this.action')
    }
  }
}
</script>
<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
img {
  max-height: 50px;
  max-width: 100px;
}
</style>
