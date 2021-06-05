
import request from '../../utils/request.js'
// pages/index/index.js
const appInstance = getApp()
import { handleToPlay, handleToSongSheetDetail } from '../../utils/function'
Page({

  /**
   * 页面的初始数据
   */
  data: {
    bannerList: [],
    rankList: [],
    rankAllList: [],
    // ---playStatus组件数据
    isShow: false,//是否展示底部播放
    playing: false,
    playSong: {},
    playList: [],
    playIndex: 0,
    backgroundAudioManager: {},
    // ---indexScrollItem组件数据
    musicItemInfo: {},
    mvItemInfo: {},
    videoItemInfo: {}
  },
  /**
 * 生命周期函数--监听页面加载
 */
  onLoad: function (options) {
    // 调用获取banner信息的功能函数
    this.getBannerInfo()
    // 调用获取推荐歌单信息的功能函数
    this.getRecommendSongSheet()
    // 调用获取推荐mv信息的功能函数
    this.getRecommendMv()
    // 调用获取推荐视频信息的功能函数
    this.getRecommendVideo()
  },


  // 获取信息初始化部分---------
  // 获取banner信息
  async getBannerInfo() {
    let res = await request('/banner', { type: 2 })
    this.setData({
      bannerList: res.banners,
    })
  },
  // 获取推荐歌单信息
  async getRecommendSongSheet() {
    let res = await request('/personalized')
    let recommendList = res.result
    // 设置IndexScrollItem信息
    this.setScrollItemInfo('songsheet', recommendList)
  },
  // 获取推荐mv信息
  async getRecommendMv() {
    let res = await request('/personalized/mv')
    let recommendList = res.result
    // 设置IndexScrollItem信息
    this.setScrollItemInfo('mv', recommendList)
  },
  // 获取推荐视频信息
  async getRecommendVideo() {
    let res = await request('/video/timeline/recommend')
    let recommendList = res.datas.map(item => {
      item = item.data
      return item
    })
    // 设置IndexScrollItem信息
    this.setScrollItemInfo('video', recommendList)
  },
  // 设置IndexScrollItem信息
  setScrollItemInfo(type, recommendList) {
    let { musicItemInfo, mvItemInfo, videoItemInfo, } = this.data
    if (type === 'songsheet') {
      musicItemInfo = {
        title: '推荐歌单',
        controlName: '更多',
        recommendList,
        songsheet: true,
      }
      this.setData({
        musicItemInfo
      })
      return
    }
    if (type === 'mv') {
      mvItemInfo = {
        title: '推荐mv',
        controlName: '更多',
        recommendList,
        mv: true,
      }
      this.setData({
        mvItemInfo
      })
      return
    }
    if (type === 'video') {
      videoItemInfo = {
        title: '推荐视频',
        controlName: '更多',
        recommendList,
        video: true,
      }
      this.setData({
        videoItemInfo
      })
      return
    }
  },

  // 跳转功能部分---------
  // 前往每日推荐
  toDayRecommend() {
    wx.navigateTo({
      url: '/pages/recommend/recommend'
    })
  },
  // 前往歌单
  toSongSheet() {
    wx.navigateTo({
      url: '/pages/songsheet/songsheet'
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
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    if (appInstance.globalData.playing) {
      this.setData({
        playing: appInstance.globalData.playing,
        playSong: appInstance.globalData.playSong,
        playList: appInstance.globalData.playList,
        playIndex: appInstance.globalData.playIndex,
        backgroundAudioManager: appInstance.globalData.backgroundAudioManager,
        isShow: true
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
  onShareAppMessage: function ({ from }) {
    return {
      title: '来自大帅的转发',
      page: '/pages/video/video',
      imageUrl: '/static/images/1.jpg'
    }
  }
})