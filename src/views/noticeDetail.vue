<template>
  <div class="notice-detail">
    <div class="vheader">
      <h3>
        公告详情
        <span class="back-last" @click="goLastPage"><<返回上一页</span>
      </h3>
    </div>
    <div class="content">
      <h3>{{detailData.Title}}</h3>
      <div class="detail-nav">
        <div class="">
          <span>发布日期：{{detailData.CreateDate}}</span>
          <span class="end-date">公告截止日期：{{detailData.EndDate}}</span>
        </div>
        <div class="">
          <span>发布范围：{{detailData.CenterRoleNames + ';' + detailData.ChannelRoleNames}}</span>
        </div>
      </div>
      <div class="detail-con">
        <pre><el-input class="detail-area" type="textarea" v-model="detailData.Text" :rows=15></el-input></pre>
      </div>
    </div>
  </div>
</template>

<script>
import { getnotice } from '@/api/api'
export default {
  data() {
    return {
      id: '',
      detailData: ''
    }
  },
  created() {
    this.id = this.$route.query.id
    console.log(this.id, 'this.id')
    this.getDetail()
  },
  methods: {
    goLastPage() {
      this.$router.back()
    },
    getDetail() {
      getnotice(this.id).then((res) => {
        console.log(res)
        if (res.status) {
          this.detailData = res.data[0]
        }
      })
    }
  }
}
</script>

<style lang="stylus">
.notice-detail
  .vheader
    border-bottom: none
    margin-bottom: 20px
    h3
      margin: 0
      font-size: 26px
      font-weight: normal
  .back-last
    font-size: 12px
    font-weight: normal
    padding-left: 10px
    cursor: pointer
    &:hover
      color: #1b9bfc
  .content
    border: 1px solid #ccc
    box-shadow: -5px -5px 5px 3px #eee
    width: 96%
    height: 510px
    margin: 10px 2%
    text-align: center
    padding: 10px 30px
    h3
      font-weight: normal
      font-size: 20px
    .detail-nav
      padding: 5px
      border-bottom: 1px solid #ccc
      div
        height: 30px
        line-height: 30px
        padding: 0 120px
        color: #969696
        .end-date
          float: right
        span
          float: left
    .detail-con
      margin-top: 30px
      text-align: left
      font-size: 14px
      line-height: 20px
      pre
        font-family: Microsoft YaHei
        white-space: pre-wrap
        word-wrap: break-word
        .detail-area .el-textarea__inner
          border: none
</style>
