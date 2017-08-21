<template>
<el-dialog title="设置礼包" :visible.sync="isShow">
  <el-table :data="tableData" border style="width: 100%">
    <el-table-column prop="GiftTypeName" label="礼包类型">
    </el-table-column>
    <el-table-column prop="AddedValue" label="客户类型" :formatter="AddedValueFormat">
    </el-table-column>
    <el-table-column prop="Price" label="价格">
    </el-table-column>
    <el-table-column prop="Num" label="数量">
    </el-table-column>
    <el-table-column label="操作">
      <template scope="gifts">
        <el-button @click="giftDelete(gifts.row)" type="text" size="small">删除</el-button>
      </template>
    </el-table-column>
  </el-table>
  <el-form :inline="true" ref="giftForm" :model="addGift" class="gift-form" style="margin:20px 0">
    <el-form-item label="礼包类型">
      <el-select v-model="addGift.GiftTypeId">
        <el-option v-for="item in giftTypes" :key="item.Id" :label="item.GiftTypeName" :value="item.Id"></el-option>
      </el-select>
    </el-form-item>
    <el-form-item label="公司性质">
      <el-select v-model="addGift.AddedValue">
        <el-option label="小规模" value="1"></el-option>
        <el-option label="一般纳税人" value="2"></el-option>
      </el-select>
    </el-form-item>
    <el-form-item label="价格" required>
      <el-input v-model="addGift.Price"></el-input>
    </el-form-item>
    <el-form-item label="数量" required>
      <el-input v-model="addGift.Num"></el-input>
    </el-form-item>
    <el-form-item>
      <el-button type="primary" @click="onSubmit">添加</el-button>
    </el-form-item>
  </el-form>
  <div slot="footer" class="dialog-footer">
    <el-button @click="dialogCacel">取 消</el-button>
  </div>
</el-dialog>
</template>
<script>
import {
  getGiftTypes,
  getGifts,
  addGift,
  deleteGift
} from '@/api/api'
export default {
  name: 'giftsetting',
  props: ['channelId'],
  data() {
    return {
      giftTypes: [],
      isShow: true,
      addGift: {
        GiftTypeId: 1,
        AddedValue: '1',
        Price: '',
        Num: ''
      },
      tableData: []
    }
  },
  created() {
    this.getGiftTypes()
    this.fetchData()
  },
  watch: {
    channelId() {
      this.addGift = {
        GiftTypeId: 1,
        AddedValue: '1'
      }
      this.fetchData()
    }
  },
  methods: {
    getGiftTypes() {
      getGiftTypes().then((res) => {
        this.giftTypes = res.data
      })
    },
    fetchData() {
      getGifts({
        ChannelId: this.channelId
      }).then((res) => {
        this.tableData = res.data
      })
    },
    AddedValueFormat(row) {
      var AddedValue = row.AddedValue
      switch (AddedValue) {
        case 1:
          AddedValue = '小规模'
          break
        case 2:
          AddedValue = '一般纳税人'
          break
      }
      return AddedValue
    },
    onSubmit() {
      this.addGift.ChannelId = this.channelId
      if (!this.addGift.Price) {
        this.$message({
          type: 'warning',
          message: '请填写礼包价格'
        })
      } else if (!this.addGift.Num) {
        this.$message({
          type: 'warning',
          message: '请填写礼包数量'
        })
      } else {
        addGift(this.addGift).then(res => {
          this.addGift = {
            GiftTypeId: 1,
            AddedValue: '1',
            Price: '',
            Num: ''
          }
          this.fetchData()
        })
      }
    },
    giftDelete(row) {
      this.$confirm('您确定要删除该礼包?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        deleteGift(row.Id).then(res => {
          if (res.status) {
            this.$message({
              type: 'success',
              message: '删除成功!'
            })
            this.fetchData()
          }
        })
      })
    },
    dialogCacel: function() {
      this.isShow = false
    }
  }
}
</script>
<!-- Add "scoped" attribute to limit CSS to this component only -->
<style>
.gift-form.el-form--inline .el-form-item__content {
  width: 100px;
}
</style>
