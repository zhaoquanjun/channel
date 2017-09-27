<template lang="html">
  	<el-tree
  :data="data"
  :props="defaultProps"
  :node-key="'FunctionId'"
  :highlight-current="true"
  :current-node-key="currentNodeKey"
  :auto-expand-parent="true"
  :default-expanded-keys="expandedKeys"
  accordion
  @node-click="handleNodeClick">
</el-tree>
</template>
<script>
export default {
  name: 'header',
  data() {
    let route = this.$route
    let flist = JSON.parse(this.$store.state.userInfo.FunctionList)
    let currentNode, expandedNode
    expandedNode = flist.find(node => {
      currentNode = node.children.find(n => {
        return n.url === route.name
      })
      return currentNode
    })
    const cnkey = currentNode ? currentNode.FunctionId : ''
    const epkeys = expandedNode ? [expandedNode.FunctionId] : []

    let funlist = JSON.parse(this.$store.state.userInfo.FunctionList)
    // funlist = funlist.sort(sortFn)
    // console.log(funlist, '菜单')
    funlist = window._.sortBy(funlist, 'Rank')
    // console.log(funlist, '排序后')
    funlist.forEach(function(item) {
      item.children = item.children.sort(sortFn)
    })

    function sortFn(a, b) {
      return a.Rank > b.Rank
    }

    const data = {
      data: funlist,
      defaultProps: {
        children: 'children',
        label: 'name'
      },
      currentNodeKey: cnkey, // 一级目录
      expandedKeys: epkeys // 二级目录
    }
    // console.log(data)
    return data
  },
  methods: {
    handleNodeClick(data) {
      if (data.url.indexOf('.') > 0) {
        this.$router.push(data.url.split('.')[1])
      }
    }
  }
}
</script>
<style>

</style>
