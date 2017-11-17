import ossUploader from './ossUploader'
var MyPlugin = {}
MyPlugin.install = function (Vue, options) {
  Vue.prototype.$ossUploader = ossUploader
}
export default MyPlugin
