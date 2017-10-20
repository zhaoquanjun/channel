<template>
<div>
  <h3 class="vheader">活动类型设置</h3>
  <promotion-child :common-promotion="isCommonPromotion"></promotion-child>
</div>
</template>

<script>
import PromotionTypeChild from '@/components/promotionTypeChild'
export default {
  data() {
    return {
      isCommonPromotion: true
    }
  },
  components: {
    PromotionChild: PromotionTypeChild
  }
}
</script>

<style scoped>
</style>
