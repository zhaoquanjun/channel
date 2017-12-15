<template>
  <div class="container">
    <div class="board dash-board">
      <h4>仪表盘</h4>
    </div>
    <div class="right-content">
      <div class="board notice">
        <h4>
          最新公告
          <span class="more" @click="goMoreinfo">更多>></span>
        </h4>
        <div v-if="lists.length" class="list-item" v-for="list in lists">
          <div>
            <i v-if="list.IsNew">新</i>
            <span>{{list.Title}}</span>
          </div>
          <p>{{list.CreateDate}}</p>
        </div>
        <div v-if="!lists.length" class="list-bg">
        </div>
        <div v-if="category === 1" class="new" @click="makeNotice">
          <div class="new-notice">
            创建公告
          </div>
        </div>
      </div>
      <div class="board document">
        <h4>
          帮助文档
          <span class="more">更多>></span>
        </h4>
        <div v-if="documents.length" class="document-item" v-for="list in documents">
          <i></i>
          <div>{{list.title}}</div>
        </div>
        <div v-if="!documents.length" class="list-bg list-bg-document">
        </div>
        <div v-if="category === 1" class="new" @click="uploaderFile">
          <div class="new-notice">
            上传文件
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
import { getnoticelist } from '@/api/api'
import Dialog from '@/service/dialog.js'
import FileUploader from '@/components/fileUploader'
import MakeNotice from '@/views/components/makeNotice'
export default {
  data() {
    return {
      category: '',
      lists: [
        {IsNew: 1, Title: '渠道系统V1.5.1正式版发布 升级注意事项', CreatDate: '2017-11-25'},
        {IsNew: 1, Title: '渠道系统V1.5.1正式版发布 升级注意事项渠道系统V1.5.1正式版发布 升级注意事项渠道系统V1.5.1正式版发布 升级注意事项', CreatDate: '2017-11-25'},
        {IsNew: 1, Title: '渠道系统V1.5.1正式版发布 升级注意事项', CreatDate: '2017-11-25'}
      ],
      documents: [
        {title: '渠道系统提单使用手册渠道系统提单使用手册渠道系统提单使用手册渠道系统提单使用手渠道系统提单使用手册'},
        {title: '渠道系统提单使用手册'},
        {title: '渠道系统提单使用手册'},
        {title: '渠道系统提单使用手册'},
        {title: '渠道系统提单使用手册'}
      ]
      // lists: [],
      // documents: []
    }
  },
  mounted() {
    this.initMenu()
    this.getNoticeList()
    this.category = JSON.parse(sessionStorage.getItem('userInfo')).Category
  },
  methods: {
    getNoticeList() {
      let limit = 3
      let offset = 0
      getnoticelist({
        limit: limit,
        offset: offset,
        title: '',
        type: 1
      }).then((res) => {
        this.lists = res.data
      })
    },
    initMenu() {
      $('.nav-title').addClass('active')
      $('.el-tree').children().map((index, el) => {
        $(el).removeClass('is-expanded')
        $(el).children().eq(1).hide()
      })
    },
    goMoreinfo() {
      var obj = {}
      if (this.category === 1) {
        obj.title = '公告管理'
        obj.category = 1
      } else {
        obj.title = '公告列表'
        obj.category = 0
      }
      this.$router.push({name: 'InfoList', query: obj})
    },
    uploaderFile() {
      console.log('aa')
      Dialog(FileUploader).then(() => {
        // this.getFilelist()
      })
    },
    makeNotice() {
      Dialog(MakeNotice).then(() => {
        this.getNoticeList()
      })
    }
  }
}
</script>
<style lang="stylus" scoped>
  .container
    background: #eee
    padding: 10px
    overflow: hidden
    h4
      font-size: 18px
    .board
      background-color: #fff
      padding: 15px 25px
      position: relative
      h4
        color: #1b9bfc
        margin: 0
    .dash-board
      float: left
      width: 60%
      height: 574px;
      margin-right: 20px
    .right-content
      float: left
      width: 38%
      overflow: hidden
      .notice, .document
        height: 277px
        h4
          margin-bottom: 10px
        .more
          float: right
          color: #000
          font-size: 12px
          padding-top: 5px
          cursor: pointer
        .more:hover
          color: #1b9bfc
        .list-item
          border-bottom: 1px solid #ccc
          font-size: 14px
          padding-top: 10px
          div
            height: 20px
            line-height: 20px
            overflow: hidden
            white-space: nowrap
            text-overflow: ellipsis
            cursor: pointer
            span:hover
              color: #1b9bfc
            i
              display: inline-block
              width: 16px
              line-height: 16px
              text-align: center
              color: red
              border: 1px solid red
              font-style:normal
              font-size: 12px
              border-radius: 4px
          p
            font-size: 12px
            color: #ccc
            padding: 5px 0 10px
            margin: 0
      .notice
        margin-bottom: 20px
      .document
        .document-item
          height: 30px
          line-height: 30px
          font-size: 14px
          div
            overflow: hidden
            white-space: nowrap
            text-overflow:ellipsis
            cursor: pointer
          div:hover
            color: #1b9bfc
          i
            display: flex
            float: left
            width: 10px
            height: 3px
            background-color: #ccc
            margin-top: 14px
            margin-right: 10px
</style>
<style lang="stylus">
  .notice
    .list-item:nth-child(4)
      border-bottom: none !important
</style>
<style lang="stylus" scoped>
.container
  .list-bg
    width: 100%
    height: 177px
    background: url('../assets/images/noinfo.png')
    background-position: center
    background-repeat: no-repeat
  .list-bg-document
    background: url('../assets/images/nodocument.png')
    background-position: center
    background-repeat: no-repeat
  .new
    position: absolute
    bottom: 0
    left: 0
    width: 100%
    .new-notice
      margin: 0 25px
      padding: 20px 0
      border-top: 1px solid #ccc
      text-align: center
      color: #1b9bfc
      font-weight: 600
      cursor: pointer
</style>
