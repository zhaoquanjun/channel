exports.install = Vue => {
  Vue.directive('tableSum', {
    componentUpdated: function (el) {
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
      }
    }
  })
}
