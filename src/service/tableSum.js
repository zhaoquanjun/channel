exports.install = Vue => {
  Vue.directive('tableSum', {
    componentUpdated: function (el, binding) {
      const footTr = el.querySelector('.el-table__footer>tbody>tr')

      if (footTr) {
        let td = footTr.querySelector('td:nth-child(1)')
        let count = +td.getAttribute('colspan') || 1
        footTr.querySelectorAll('td>div').forEach((el, index) => {
          if (index > 0 && el.innerHTML === '-') {
            footTr.removeChild(el.parentNode)
            count += 1
          }
        })
        td.setAttribute('colspan', count)
        if (binding.value && binding.arg) {
          let val = binding.value
          let arg = JSON.parse(binding.arg)
          arg.forEach(function (item) {
            console.log(footTr.children[item])
            let el = footTr.children[item] || null
            el.setAttribute('style', 'cursor: pointer; color: #20a0ff; text-decoration: underline;')
            if (el) {
              el.onclick = function () {
                val(item)
              }
            }
          })
        }
      }
    }
  })
}
