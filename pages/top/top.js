// pages/top/top.js
import request from "../../utils/request"
import { handleToSongSheetDetail } from "../../utils/function"
Page({

  /**
   * 页面的初始数据
   */
  data: {
    TagsList: [],//歌单标签列表
    clickTgeId: 0,//点击的标签名
    currentIndex: 0,//标签下标
    officialList: []
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    // 初始化官方榜数据
    this.getOfficialList()
    this.setData({
      TagsList: [
        {
          id: 0,
          name: '官方'
        },
      ]
    })
  },
  // 初始化数据
  async getOfficialList() {
    let res = await request('/toplist/detail')
    this.setData({
      officialList: res.list
    })
  },
  // 事件操作
  TagClick(e) {
    let tag = e.currentTarget.dataset.tag
    let currentIndex = e.currentTarget.dataset.index
    this.setData({
      clickTgeId: tag,
      currentIndex
    })
  },
  // 前往详情
  handleToDetail(e) {
    handleToSongSheetDetail(e.currentTarget.dataset.id)
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