var uploadUrl = 'https://pilipa.oss-cn-beijing.aliyuncs.com'
var typMap = {
  1: 'FileUploads/Order/CardID/',
  2: 'FileUploads/Order/BusinessLicense/',
  3: 'FileUploads/Order/Contract/',
  4: 'FileUploads/Agent/'
}
var signkey = {}
$.get('/api/signkey').then(function (res) {
  delete res.data.Filename
  delete res.data.key
  delete res.data.callback
  delete res.data.expire
  delete res.data.Host
  signkey = res.data
})
function buildKey(type, fileName) {
  // var randomFilename = ''

  var getSuffix = function (filename) {
    var suffix = ''
    var pos = filename.lastIndexOf('.')

    if (pos !== -1) {
      suffix = filename.substring(pos)
    }
    return suffix
  }
  var randomString = function (len) {
    len = len || 32
    var chars = 'ABCDEFGHJKMNPQRSTWXYZabcdefhijkmnprstwxyz2345678'
    var maxPos = chars.length
    var pwd = ''
    for (var i = 0; i < len; i++) {
      pwd += chars.charAt(Math.floor(Math.random() * maxPos))
    }
    return pwd
  }

  var suffix = getSuffix(fileName)
  var nowstr = new Date().toLocaleDateString().replace(/^(\d{4})\/(\d{1,2})\/\d{1,2}$/, function (source, $1, $2) {
    return $2.length === 2 ? $1 + $2 : $1 + '0' + $2
  })
  var gObjectName = typMap[type] + nowstr + '/' + randomString(10) + suffix
  return gObjectName
}

export default function(file, type = 1) {
  var formData = new FormData()
  var key = buildKey(type, file.name)
  var url = uploadUrl + '/' + key
  formData.append('key', key)
  for (var k in signkey) {
    formData.append(k, signkey[k])
  }
  formData.append('file', file)
  return $.ajax({
    url: uploadUrl,
    type: 'POST',
    data: formData,
    processData: false,
    contentType: false
  }).then(function (res) {
    res = res === '' ? { status: 200 } : res
    res['sourceUrl'] = url
    return res
  }, function (err) {
    return err
  })
}
