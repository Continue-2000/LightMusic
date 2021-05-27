
import request from '../../utils/request.js'
// pages/index/index.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    bannerList: [],
    recommendList: [],
    rankList: []
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: async function (options) {
    let bannerList = await request('/banner', { type: 2 })
    let recommendList = await request('/personalized')
    this.setData({
      bannerList: bannerList.banners,
      recommendList: recommendList.result
    })
    let rankindex = 0;
    let arr = []
    while (rankindex < 5) {
      let rankList = await request('/top/list', { idx: rankindex++ })
      rankList = rankList.playlist;
      let musicItem = {
        id: rankList.id,
        titleName: rankList.name,
        tracks: rankList.tracks.slice(0, 3)
      };
      arr.push(musicItem)
      this.setData({
        rankList: arr
      })
    }
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