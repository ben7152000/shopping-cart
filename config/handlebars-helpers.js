const dayjs = require('dayjs')
require('dayjs/locale/zh-tw')
dayjs.locale('zh-tw')

module.exports = {
  equal: function (a, b, options) {
    if (a === b) {
      return options.fn(this)
    }
    return options.inverse(this)
  },
  multiply: function (a, b) {
    if (typeof a === 'number' && typeof b === 'number') {
      return a * b
    }
  },
  formatTime: function (a) {
    return dayjs(a).locale('zh-tw').format('YYYY/MM/DD (dd) a HH:mm:ss')
  }
}
