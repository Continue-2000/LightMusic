import request from '../../utils/request'
import { handleToVideo } from "../../utils/function"
// pages/video/video.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    videoGroupList: [],
    currentId: '',
    videoGroupData: [],
    playingId: 0,
    timeUpdateData: [],
    initplace: 0,
    isRefresher: false,
    loadindex: 0
  },
  // 前往搜索
  // handleToSearch() {
  //   wx.navigateTo({
  //     url: '/pages/search/search',
  //   })
  // },
  //点击获取对应Groupitem
  itemClick(e) {
    console.log(e);
    this.setData({
      currentId: e.currentTarget.dataset.id
    })
    this.getVideoGroupData()
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
    wx.showLoading({
      title: '加载中',
    })
    this.setData({
      videoGroupData: []
    })
    let res = await request('/video/group', { id: this.data.currentId })
    wx.hideLoading()
    if (res.code != 200) {
      wx.showToast({
        title: '请先登录了解更多哦！',
        icon: 'none',
        duration: 2000
      })
      return
    }

    let data = res.datas.map(item => {
      item = item.data;
      return item
    })
    this.setData({
      videoGroupData: data,
      isRefresher: false
    })
  },
  // 视频播放
  videoClick(e) {
    console.log(e);
    let vid = e.currentTarget.id
    console.log(vid);
    handleToVideo(vid, 'video')

  },
  //上拉刷新
  handleRefresher() {
    this.getVideoGroupData()
  },
  // 下拉加载更多
  handleLoadMore() {
    wx.showLoading({
      title: '拼命加载中',
    })
    this.LoadMore();
    wx.hideLoading()
  },
  async LoadMore() {
    console.log(1111);
    let { loadindex, videoGroupData } = this.data
    let res = await request('/video/timeline/all', { offset: loadindex++ })
    res = res.datas.map(item => {
      item = item.data;
      return item
    })
    videoGroupData.push(...res)
    this.setData({
      videoGroupData,
      loadindex
    })
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.getVideoGroupList()
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
    if (!wx.getStorageSync('userinfo')) {
      wx.showToast({
        title: '请先登录了解更多哦！',
        icon: 'none',
        duration: 2000
      })
    }
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