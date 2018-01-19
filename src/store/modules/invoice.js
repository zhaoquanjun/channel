import { invoiceapply } from '@/api/api'
const state = {
  tableData: []
}

const actions = {
  fetchinvoicelist ({commit}, payload) {
    invoiceapply(payload.params).then(res => {
      if (res.status) {
        commit('updata invoice list data', res.data)
        payload.cb && payload.cb(res)
      }
    })
  }
}

const mutations = {
  'updata invoice list data': (state, payload) => {
    state.tableData = payload
  }
}

export default {
  state,
  actions,
  mutations
}
