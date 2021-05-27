import request from '../../utils/request'
// pages/video/video.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    videoGroupList: [],
    currentId: '',
    videoGroupData: []
  },
  //点击获取对应Groupitem
  itemClick(e) {
    console.log(e);
    this.setData({
      currentId: e.currentTarget.id
    })
    this.getVideoGroupData()
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.getVideoGroupList()
  },
  // 获取视频标签列表
  async getVideoGroupList() {
    let res = await request('/video/group/list')
    this.setData({
      videoGroupList: res.data.slice(0, 14),
      currentId: res.data.splice(0, 1)[0].id
    })
    this.getVideoGroupData()
  },
  // 获取视频标签下对应的视频数据
  async getVideoGroupData() {
    let res = await request('/video/group', { id: this.data.currentId })
    if (res.code != 200) {
      wx.showToast({
        title: '请先登录了解更多哦！',
        icon: 'none',
        duration: 2000
      })
    }
    this.setData({
      videoGroupData: res.datas
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