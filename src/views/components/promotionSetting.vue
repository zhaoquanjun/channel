<template>
  <el-dialog title="活动设置" :visible.sync="dialogTableVisible" size="small">
    <promotion-child :common-promotion="isCommonPromotion" :id="channelid"></promotion-child>
    <div slot="footer" class="dialog-footer">
      <el-button type="primary" @click="dialogTableVisible = false">关 闭</el-button>
    </div>
  </el-dialog>
</template>

<script>
import PromotionTypeChild from '@/components/promotionTypeChild'
export default {
  props: ['channelId'],
  data() {
    return {
      dialogTableVisible: true,
      isCommonPromotion: false,
      channelid: ''
    }
  },
  mounted() {
    this.channelid = this.channelId
    console.log(this.channelid)
  },
  components: {
    PromotionChild: PromotionTypeChild
  }
}
</script>

<style scoped>
</style>
