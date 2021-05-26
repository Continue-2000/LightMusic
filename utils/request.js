
// 发送ajax请求

import config from './config'
export default (url, data = {}, method = 'GET') => {
  return new Promise((resolve, reject) => {
    wx.request({
      url: config.host + url,
      data,
      success: function (res) {
        // success
        resolve(res.data)
      },
      fail: function (err) {
        // fail
        console.log(err);
      },
    })
  })

}