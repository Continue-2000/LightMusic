
import request from '../../utils/request.js'
// pages/index/index.js
import { handleToPlay, handleToSongSheetDetail } from '../../utils/function'
Page({

  /**
   * 页面的初始数据
   */
  data: {
    bannerList: [],
    recommendList: [],
    rankList: [],
    rankAllList: []
  },
  // 前往每日推荐
  toDayRecommend() {
    wx.navigateTo({
      url: '/pages/recommend/recommend'
    })
  },
  // 前往推荐歌单
  handleToDetail(e) {
    handleToSongSheetDetail(e.currentTarget.dataset.id)
  },
  // 前往播放排行榜
  handleToPlayRank(e) {
    handleToPlay(e.currentTarget.dataset.index, this.data.rankAllList)
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
    let idindex = 24381616
    let arr = []
    let rankList = await request('/playlist/detail', { id: idindex })
    // 播放列表总长度
    let len;
    len = wx.getStorageSync('userinfo') ? 20 : 6
    rankList = rankList.playlist;
    this.setData({
      rankAllList: rankList.tracks.slice(0, len)
    })
    while (rankindex < 5) {
      let musicItem = {
        id: rankList.id,
        titleName: rankList.name,
        tracks: rankList.tracks.slice(rankindex * 3, (rankindex * 3 + 3))
      };
      arr.push(musicItem)
      rankindex++
    }
    console.log(arr);
    this.setData({
      rankList: arr
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