<template>
  <div class="invoice-address">
    <h3 class="vheader">发票地址</h3>
    <div class="card">
      <div class="add-card">

      </div>
    </div>
  </div>
</template>

<script>
import {
  address
} from '@/api/api'
export default {
  data: function() {
    return {
      tableData: []
    }
  },
  created() {
    this.onSearch()
  },
  methods: {
    onSearch() {
      address().then(res => {
        if (res.status) {
          this.tableData = res.data
        }
      })
    }
  }
}
</script>

<style lang='stylus' scoped>
.invoice-address
  .card
    padding: 30px 0;
    .add-card
      width: 30%;
      height: 176px;
      background: url('../../assets/images/address.png') no-repeat;
</style>
