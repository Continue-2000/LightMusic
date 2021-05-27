
// 发送ajax请求

import config from './config'
export default (url, data = {}, method = 'GET') => {

  return new Promise((resolve, reject) => {
    wx.request({
      url: config.utool + url,
      data,
      header: wx.getStorageSync('cookie') ? { cookie: JSON.parse(wx.getStorageSync('cookie')) } : {},
      success: function (res) {
        // success
        if (data.isLogin) {
          console.log(res);
          let cookie = res.cookies.find(item => item.indexOf('MUSIC_U') != -1)
          wx.setStorageSync('cookie', JSON.stringify(cookie))
        }
        resolve(res.data)
      },
      fail: function (err) {
        // fail
        console.log(err);
      },
    })
  })

}