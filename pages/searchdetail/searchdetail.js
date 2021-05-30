// pages/searchdetail/searchdetail.js
import request from '../../utils/request'
Page({

  /**
   * 页面的初始数据
   */
  data: {
    clickTitle: '单曲',
    List: [],
    ListHeight: 140,
    key: {
      type: String
    }
  },
  titleClick(e) {
    console.log(e.currentTarget.dataset.title);
    this.setData({
      clickTitle: e.currentTarget.dataset.title
    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.getSearchData()
    console.log(this.data.key);
  },
  // 根据搜索类型获得数据
  async getSearchData() {
    let res = await request('/search', { keywords: '海阔天空', type: 1 })
    console.log(res);
    this.setData({
      List: res.result.songs
    })
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