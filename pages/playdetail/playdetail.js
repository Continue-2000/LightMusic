// pages/playdetail/playdetail.js
import request from "../../utils/request";
import moment from 'moment'
var appInstance = getApp()
Page({
  /**
   * 页面的初始数据
   */
  data: {
    playing: true,
    song: {},
    index: 0,//正在播放的序号
    playlist: [],//播放列表
    List: [],//查看播放的列表
    ListHeight: 466,//查看列表的高度
    playType: 'listLoop',//播放类型
    currentTime: '',//实时时间
    totalTime: '',//总时间
    processLength: 0,//进度条长度
    isLyric: false, //是否看歌词
    isPlayEnd: false,//是否时自然播放
    isLookSongList: false//是否查看播放列表
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    // appInstance.handleToPlay()
    // 接收歌曲数据
    const eventChannel = this.getOpenerEventChannel()
    let _this = this
    eventChannel.on('acceptDataFromOpenerPage', function (data) {
      console.log(data);
      let playlist = data.data.list
      let index = data.data.index
      _this.setData({
        playlist,
        index,
        List: playlist
      })
    })

    //如果没有歌或者在播放的不是同一首歌，则发送请求
    if (!appInstance.globalData.playing || appInstance.globalData.playingId != this.data.song.id) {
      //获取播放路径数据
      let { index, playlist } = this.data
      this.getSongDetail(playlist[index].id)
    }

    //监听音乐播放状态
    this.BackgroundAudioManager = wx.getBackgroundAudioManager()
    this.BackgroundAudioManager.onPlay(() => {
      let { song } = this.data
      this.updatePlayStatus(true)
      appInstance.globalData.playingId = song.id
      aappInstance.globalData.playName = song.name
    })
    this.BackgroundAudioManager.onPause(() => {
      this.updatePlayStatus(false)

    })
    this.BackgroundAudioManager.onStop(() => {
      this.updatePlayStatus(false)
    })
    this.BackgroundAudioManager.onEnded(() => {
      //  自然播放完
      this.setData({
        isPlayEnd: true
      })
      this.handleCutSong()
      this.setData({
        isPlayEnd: false
      })
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
  // 切换状态 磁盘/歌词
  changeStatus() {
    let { isLyric } = this.data
    this.setData({
      isLyric: !isLyric
    })
  },
  //更新playing
  updatePlayStatus(status) {
    this.setData({
      playing: status
    })
    appInstance.globalData.playing = status
  },
  // 更新播放总时长
  updateTotalTime() {
    let totalTime = moment(this.data.song.dt).format('mm:ss')
    // 更新时间条
    this.setData({
      totalTime
    })
  },
  // 更新数据 歌曲名 播放路径 歌词
  UpdateDate(song) {
    // 更新歌曲名
    wx.setNavigationBarTitle({
      title: song.name
    })
    // 更新歌词
    this.getLyric(song.id)
    // 更新播放路径
    this.getMusciUrl(song.id)
    // 更新播时间条
    this.updateTotalTime()
  },

  // 底部操作栏-----

  // 切换播放类型
  changePlayType() {
    let { playType } = this.data
    let types = ['listLoop', 'singerPlay', 'randomPlay']
    let index = types.indexOf(playType)
    if (index == types.length - 1)
      index = 0;
    else
      index++;
    let type = '';
    switch (index) {
      case 0:
        type = '列表循环'
        break;
      case 1:
        type = '单曲循环'
        break;
      case 2:
        type = '随机播放'
    }
    wx.showToast({
      title: type,
      icon: 'none',
      duration: 1500,
    });
    this.setData({
      playType: types[index]
    })
  },
  //播放/暂停
  handlePlay() {
    let isPlay = !this.data.playing
    this.handleisPlay(isPlay)
  },
  //处理类型的功能函数
  handlePlayTypeFunction(type) {
    // type:上一首还是下一首
    let { playType, index, playlist } = this.data
    if (playType == 'listLoop') {
      let num = type == 'pre' ? -1 : 1
      let len = playlist.length
      index = index + num;
      if (index == -1)
        index = len - 1
      if (index == len)
        index = 0;
    }
    else if (playType == 'singerPlay') {
      index = index;

    }
    else if (playType == 'randomPlay') {
      // 生成数组随机下标
      index = Math.floor(Math.random() * (playlist.length - 0));
    }
    this.setData({
      index
    })
  },
  // 切歌
  handleCutSong(e) {
    this.BackgroundAudioManager.stop()
    // 获得是点击下一首还是上一首
    let type = e.currentTarget.dataset.type;
    if (this.data.isPlayEnd)
      type = 'next'
    // 获得切歌类型 列表\单曲\随机
    this.handlePlayTypeFunction(type)
    // 更新歌曲详细信息
    let { playlist, index } = this.data
    this.getSongDetail(playlist[index].id)
  },
  // 查看列表
  handleLookSongList() {
    let { isLookSongList } = this.data
    isLookSongList = !isLookSongList
    this.setData({
      isLookSongList
    })
  },
  // 播放所有
  toPlayAll() {
    handleToPlay(0, this.data.List)
  },
  // 点击查看的列表切歌
  handleToPlayDetail(e) {
    let { playlist, index, isLookSongList } = this.data
    this.BackgroundAudioManager.stop()
    index = e.currentTarget.dataset.index;
    this.setData({
      index,
      isLookSongList: !isLookSongList
    })
    this.getSongDetail(playlist[index].id)
  },
  // 获取播放的音乐路径
  async getMusciUrl(playId) {
    let res = await request('/song/url', { id: playId })
    let playurl = res.data[0].url;
    console.log(res);
    if (playurl) {
      this.BackgroundAudioManager.src = playurl
      this.BackgroundAudioManager.title = this.data.song.name
    }
    else {
      wx.showToast({
        title: '歌曲即将上线,敬请期待',
        icon: 'none',
        image: '',
        duration: 2500,
        mask: false,
      });

    }
  },
  // 获取歌曲详情
  async getSongDetail(ids) {
    let { song } = this.data
    let res = await request('/song/detail', { ids })
    console.log(res);
    song = res.songs[0]
    this.setData({
      song
    })
    // 更新数据
    this.UpdateDate(song)
  },
  // 播放音乐的操控函数
  async handleisPlay(isPlay) {
    if (isPlay)
      this.BackgroundAudioManager.play()
    else {
      this.BackgroundAudioManager.pause()
    }
  },
  // 获取歌词
  async getLyric(id) {
    let res = await request('/lyric', { id })
    console.log(res);
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