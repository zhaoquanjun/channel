<template>
  <div class="invoice-address">
    <h3 class="vheader">发票地址</h3>
    <div class="card">
      <div class="item-card" v-for="item in tableData">
        <div class="card-top">
          <p>{{item.Name}}</p>
          <div>{{item.ProvinceName}}{{item.CityName}}</div>
          <div>{{item.Address}}</div>
        </div>
        <div class="card-bottom">
          <span>{{item.Receiver}}</span>
          <span>{{item.Mobile}}</span>
          <el-button type="text" @click="newAddress(item)">修改</el-button>
        </div>
      </div>
      <div class="add-card" @click="newAddress()"></div>
    </div>
  </div>
</template>

<script>
import {
  address
} from '@/api/api'
import Dialog from '@/service/dialog.js'
import NewAddress from '@/components/newAddress'
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
    },
    newAddress(row) {
      console.log(row, 'row')
      Dialog(NewAddress, {
        row: row
      }).then(() => {
        this.onSearch()
      })
    }
  }
}
</script>

<style lang='stylus' scoped>
.invoice-address
  .card
    padding: 30px 0;
    overflow: hidden;
    .add-card
      float: left;
      width: 350px;
      height: 176px;
      background: url('../../assets/images/address.png') no-repeat;
      background-size: 350px 166px;
      cursor: pointer;
    .item-card
      float: left;
      width: 350px;
      height: 166px;
      margin-right: 20px;
      margin-bottom: 10px;
      padding: 15px 20px;
      background-color: #eee;
      font-size: 14px;
      font-weight: normal;
      cursor: pointer;
      &:hover
        background-color: #ccc;
        .card-bottom
          border-color: #eee;
      .card-top
        height: 90px;
        p
          font-size: 18px;
          margin: 5px 0;
        div
          padding-top: 10px;
      .card-bottom
        height: 44px;
        line-height: 44px;
        border-top: 1px solid #ccc;
        span
          padding-right: 20px;
        button
          float: right;
          margin-top: 5px;
</style>
