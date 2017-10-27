<template>
<div class="image-uploader">
  <div :class="isClose ? 'img-item': '' " ref="imgItem">
    <img :src="value" v-show="value">
    <i class="el-icon-circle-cross" style="display: none;" @click="deleteImg"></i>
  </div>
  <el-upload v-if="!isClose || isClose && signList" :on-success="handleSuccess" :before-upload="beforeUpload" :action="action" :file-list="fileList" :show-file-list="false" v-show="!readonly" :data="signKey">
    <el-button size="small" type="primary">点击上传</el-button>
    <div v-if="isClose" slot="tip" class="el-upload__tip">上传的图片大小请不要超过1M,支持多次上传</div>
    <div v-else slot="tip" class="el-upload__tip">上传的图片大小请不要超过1M</div>
  </el-upload>
</div>
</template>
<script>
import Viewer from 'viewerjs'
import 'viewerjs/dist/viewer.css'
export default {
  name: 'searchParams',
  props: ['type', 'value', 'readonly', 'signKey', 'signList', 'isClose'],
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

    if (this.isClose) {
      $(this.$refs['imgItem']).hover(() => {
        $(that.$refs['imgItem']).children('.el-icon-circle-cross').show()
      }, () => {
        $(that.$refs['imgItem']).children('.el-icon-circle-cross').hide()
      })
    }
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
        4: 'FileUploads/Agent/',
        5: 'FileUploads/ChargeType/'
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
    },
    deleteImg(index) {
      this.$emit('delete')
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
.img-item {
  width: 100px;
  height: 50px;
  float: left;
  border: 1px solid #ccc;
  display: flex;
  align-items: center;
  justify-content: center;
  position: relative;
}
.el-icon-circle-cross {
  position: absolute;
  color: red;
  cursor: pointer;
  top: 5px;
  right: 5px;
}
.file-upload-area-button .img-item {
  display: none;
}
</style>
