<template>
  <div class="img-upload-container" >
    <input type="file" style="display: none">
    <div class="upload-area">
      <span style="display: none">重新上传</span>
    </div>
    <p class="ng-binding">
      <span class="required"></span>
      {{title}}
    </p>
  </div>
</template>
<script>
  import Viewer from 'viewerjs'
  export default {
    props: {
      uploader: Function,
      value: String,
      title: String,
      uploaded: Function
    },
    mounted () {
      var _self = this

      var ele = $(this.$el)
      ele.find('.upload-area').hover(function (e) {
        if (ele.attr('disabled')) return
        if (_self.value) {
          ele.find('.upload-area span').show()
          ele.find('.upload-area span').removeClass().addClass('enter')
        } else {
          ele.find('.upload-area').append('<div class="upload-shadow"></div><i class="fa fa-cloud-upload" aria-hidden="true"></i>')
        }
      }, function () {
        ele.find('.upload-area i, .upload-area .upload-shadow').remove()
        if (_self.value) {
          ele.find('.upload-area span').removeClass().addClass('leave')
        }
      })

      ele.find('.upload-area').click(function (e) {
        if (ele.attr('disabled')) return
        if (_self.value) {
          if (e.target.tagName.toUpperCase() === 'SPAN') {
            ele.find('input[type=file]').trigger('click')
          }
        } else {
          ele.find('input[type=file]').trigger('click')
        }
      })
      if (this.value) {
        this.appendImg(this.value)
      } else {
        ele.find('.upload-area span').hide()
      }

      ele.find('input[type=file]').on('change', function () {
        var file = ele.find('input[type=file]')[0].files[0]
        if (!file) return

        if (file.size > 1024 * 1024) {
          alert('图片大小超过1M!')
          return
        }
        if (/^(?!image)./.test(file.type)) {
          alert('上传格式不正确！')
          return
        }
        ele.find('.upload-area').append('<div class="upload-shadow"></div><i class="fa fa-spinner fa-pulse" aria-hidden="true"></i>')
        _self.$ossUploader(file).then(function (res) {
          if (res.status === 200) {
            ele.find('.upload-area .upload-shadow, .upload-area i').remove()
            _self.appendImg(res.sourceUrl)
            _self.$emit('input', res.sourceUrl)
            _self.uploaded && _self.uploaded()
          } else {
            alert('上传失败')
          }
        })
      })
    },
    methods: {
      appendImg (src) {
        var _self = this
        var ele = $(this.$el)
        ele.find('.upload-area img')[0] ? ele.find('.upload-area img').prop('src', src) : ele.find('.upload-area').append('<img src="' + src + '"  />')
        this.viewer = new Viewer(this.$el.querySelector('img'), {
          navbar: false,
          title: false,
          zIndex: 9999,
          view: function () {
            document.onclick = function (e) {
              if (e.target.className === 'viewer-canvas') _self.viewer.hide()
            }
          }
        })
      }
    }
  }
</script>
<style lang="stylus">
  @keyframes img-upload-enter
    0%
      height: 0px
    100%
      height: 56px
  @keyframes img-upload-leave
    0%
      height: 56px
    100%
      height: 0px
  .img-upload-container
    width: 400px
    text-align: center
    .required
      &:before
        color: red;
        content: '*';
    p
      margin-top: 10px
      font-size: 16px
      color: black
    .upload-area
      margin: 0px auto
      width: 369px
      height: 226px
      background: url('../assets/images/u2051.png')
      position: relative
      img
        width: 100%
        height: 100%
      .upload-shadow
        position: absolute
        top: 0
        bottom: 0
        left: 0
        right: 0
        background: rgba(0,0,0, .5)
      i
        font-size: 72px
        color: white
        position: absolute
        margin: 0 auto
        right: 0px
        left: 0px
        line-height: 226px
        cursor: pointer
      span
        position: absolute
        line-height: 56px
        background-color: rgba(51, 51, 51, .65)
        color: white
        font-size: 20px
        text-align: center
        left: 0px
        right: 0px
        bottom: 0px
        height: 0px
        cursor: pointer
        overflow: hidden
        &.enter
          animation: img-upload-enter 100ms
          animation-fill-mode: both
        &.leave
          animation: img-upload-leave 100ms
          animation-fill-mode: both
</style>
