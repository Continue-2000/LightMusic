// pages/playdetail/playdetail.js
import request from "../../utils/request";
import PubSub from 'pubsub-js'
import moment from 'moment'
var appInstance = getApp()
Page({
  /**
   * 页面的初始数据
   */
  data: {
    playing: true,
    song: {},
    currentTime: '',//实时时间
    totalTime: '',//总时间
    processLength: 0//进度条长度
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    // 接收歌曲数据
    const eventChannel = this.getOpenerEventChannel()
    let _this = this
    eventChannel.on('acceptDataFromOpenerPage', function (data) {
      console.log(data);
      _this.setData({
        song: data.data.song
      })
    })

    //如果没有歌或者在播放的不是同一首歌，则发送请求
    if (!appInstance.globalData.playing || appInstance.globalData.playingId != this.data.song.id) {
      //获取播放路径数据
      this.getMusciUrl(this.data.song.id)
    }

    //监听音乐播放状态
    this.BackgroundAudioManager = wx.getBackgroundAudioManager()
    this.BackgroundAudioManager.onPlay(() => {
      this.updatePlayStatus(true)
      appInstance.globalData.playingId = this.data.song.id
    })
    this.BackgroundAudioManager.onPause(() => {
      this.updatePlayStatus(false)

    })
    this.BackgroundAudioManager.onStop(() => {
      this.updatePlayStatus(false)
    })
    // 监听实时更新
    this.BackgroundAudioManager.onTimeUpdate(() => {
      let currentTime = moment(this.BackgroundAudioManager.currentTime * 1000).format('mm:ss')
      // 修改进度条长度
      let processLength = 528.28 * (this.BackgroundAudioManager.currentTime * 1000 / this.data.song.dt)
      this.setData({
        currentTime,
        processLength
      })
    });

  },
  // 获取播放的音乐路径
  async getMusciUrl(playId) {
    let res = await request('/song/url', { id: playId })
    let playurl = res.data[0].url;
    console.log(res);
    this.BackgroundAudioManager.src = playurl
    this.BackgroundAudioManager.title = this.data.song.name
  },
  //更新playing
  updatePlayStatus(status) {
    this.setData({
      playing: status
    })
    appInstance.globalData.playing = status
  },
  //点击播放的handle
  handlePlay() {
    let isPlay = !this.data.playing
    this.handleisPlay(isPlay)
  },

  // 播放音乐的操控函数
  async handleisPlay(isPlay) {
    if (isPlay)
      this.BackgroundAudioManager.play()
    else {
      this.BackgroundAudioManager.pause()
    }
  },

  // 切歌
  handleCutSong(e) {
    // console.log('切歌' + e.currentTarget.dataset.type);
    PubSub.publish('cutsongType', e.currentTarget.dataset.type)
    PubSub.subscribe('cutsongInfo', (msg, song) => {
      this.BackgroundAudioManager.stop()
      console.log(song);
      this.setData({
        song: song
      })
      appInstance.globalData.playingId = song.id
      this.getMusciUrl(song.id)
      wx.setNavigationBarTitle({
        title: this.data.song.name
      })
      PubSub.unsubscribe('cutsongInfo')
    })
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {
    let totalTime = moment(this.data.song.dt).format('mm:ss')
    // 更新时间条
    this.setData({
      totalTime
    })
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