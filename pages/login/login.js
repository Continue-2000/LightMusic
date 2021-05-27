import request from '../../utils/request.js';

// pages/login/login.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    isLogin: 'false'
  },
  handleInput(e) {
    let value = e.detail.value;
    let gettype = e.target.id;
    this.setData({
      [gettype]: `${value}`
    })
  },
  async login() {
    let { phone, password, isLogin } = this.data
    if (!phone) {
      wx.showToast({
        title: '手机号不能为空',
        icon: 'none',
        duration: 2000
      })
      return
    }
    let phoneRegExp = new RegExp(/^1(3|4|5|6|7|8|9)\d{9}$/);
    if (!phoneRegExp.test(phone)) {
      wx.showToast({
        title: '手机号格式不正确',
        icon: 'none',
        duration: 2000
      })
      return
    }
    if (!password) {
      wx.showToast({
        title: '请输入密码',
        icon: 'none',
        duration: 2000
      })
      return
    }
    let res = await request('/login/cellphone', { phone, password, isLogin })
    let code = res.code;
    if (code === 200) {
      let profile = JSON.stringify(res.profile)
      wx.setStorageSync('userinfo', profile)
      this.setData({
        isLogin: 'true'
      })
      wx.showToast({
        title: `登陆成功`,
        icon: 'none',
        duration: 2000
      })
      wx.switchTab({
        url: '/pages/profile/profile'
      })
      return
    }
    else {
      wx.showToast({
        title: `${res.msg}`,
        icon: 'none',
        duration: 2000
      })
      return
    }

  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {

  },
  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {

  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
})