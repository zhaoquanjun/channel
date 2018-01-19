<template>
<div class="main">
  <VHeader :user-info="userInfo"></VHeader>
  <div class="content">
    <div class="content-left">
      <div class="nav-title" @click="goMainHtml">
        首页
      </div>
      <VAside ref='vaside'></VAside>
    </div>
    <div class="content-right">
      <router-view></router-view>
    </div>
    <div class="loading"></div>
  </div>
</div>
</template>
<script>
import VHeader from '../components/header.vue'
import VAside from '../components/aside.vue'
export default {
  data: function() {
    return {
      userInfo: {},
      showIndex: true
    }
  },
  components: {
    VHeader,
    VAside
  },
  mounted() {
    this.initMenu()
  },
  created() {
    var userInfos = JSON.parse(sessionStorage.getItem('userInfo'))
    this.userInfo.RoleName = userInfos.RoleName
    this.userInfo.RealName = userInfos.RealName
  },
  methods: {
    goMainHtml() {
      $('.nav-title').addClass('active')
      console.log($(this.$refs.vaside.$el))
      $(this.$refs.vaside.$el).children().map((index, el) => {
        $(el).removeClass('is-expanded')
        $(el).removeClass('is-current')
        $(el).children().eq(1).hide()
      })
      this.$router.push({name: 'main.home'})
    },
    initMenu() {
      if (this.$route.name === 'main.home') {
        $('.nav-title').addClass('active')
      }
    }
  }
}
</script>
<style scoped>
.main {
  height: 100%;
  display: flex;
  flex-direction: column;
  /*overflow: hidden;*/
}

.content {
  flex: auto;
  display: flex;
}

.content-left {
  min-width: 170px;
  border: 1px solid #d1dbe5;
  background: #eee;
}

.el-tree {
  border: none;
  background: transparent;
}

.content-right {
  flex: auto;
  overflow-y: auto;
  border: 20px solid #eee;
  padding: 15px;
  border-right: none;
}

.main .nav-title {
  line-height: 36px;
  height: 36px;
  cursor: pointer;
  font-size: 14px;
  padding-left: 20px;
}
.main .nav-title.active {
  background-color: #edf7ff;
}
.main .nav-title:hover {
  background-color: #e4e8f1;
}
</style>
