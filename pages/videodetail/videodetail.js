// pages/viedodetail/videodetail.js
import request from '../../utils/request'
Page({

  /**
   * 页面的初始数据
   */
  data: {
    playId: 0,
    playUrl: '',
    type: '',
    isPlay: true,
    playInfo: '',//mv数据
    playIndex: 0,//正在播放的序号
    offset: 0,//加载的其他视频的页数
    playList: [],//播放的列表
    startY: 0,
    moveY: 0,
    moveDistanceY: 0,
    translateY: 'translateY(0)',
    transation: '',
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    // 接收视频/mv数据
    const eventChannel = this.getOpenerEventChannel()
    let _this = this
    eventChannel.on('acceptDataFromOpenerPage', function (data) {
      console.log(data);
      let playId = data.data.id
      let type = data.data.type
      _this.setData({
        playId,
        type
      })
    })
    this.videocontext = wx.createVideoContext('myVideo', this)

    // 获取播放地址
    let { playId, type } = this.data
    this.getPlayUrl(playId, type)
  },
  // 暂停继续播放
  videoClick() {
    let { isPlay } = this.data;
    isPlay = !isPlay
    if (isPlay)
      this.videocontext.play()
    else
      this.videocontext.pause()
    this.setData({
      isPlay
    })
  },
  // 获取播放地址
  async getPlayUrl(id, type) {
    let { playList } = this.data
    let url = type == 'mv' ? '/mv/url' : '/video/url'
    console.log(url);
    let res = await request(url, { id })
    console.log(res);
    let playUrl = type == 'mv' ? res.data.url : res.urls[0].url
    playList.push(playUrl)
    this.setData({
      playUrl,
      playList
    })
    this.getPlayInfo(id, type)
  },
  // 获取mv/视频数据
  async getPlayInfo(id, type) {
    let url = type == 'mv' ? '/mv/detail' : '/video/detail'
    let res;
    if (type == 'mv')
      res = await request(url, { mvid: id })
    else if (type == 'video')
      res = await request(url, { id })
    this.setData({
      playInfo: res.data
    })
  },
  // 滑动视频
  // 滑动的起点
  handleTouchStart(e) {
    this.setData({
      startY: e.touches[0].clientY
    })
    console.log(e);
  },
  handleTouchMove(e) {
    let { startY, moveY, moveDistanceY } = this.data
    moveY = e.touches[0].clientY;
    moveDistanceY = moveY - startY;
    if (moveDistanceY > 80) {
      console.log('上滑');
      this.changePlay(-1)
    }
    else if (moveDistanceY < -80) {
      console.log('下滑')
      this.changePlay(1)
    }
    this.setData({
      translateY: `translateY(${moveDistanceY}rpx)`
    })
  },
  handleTouchEnd() {
    this.setData({
      transition: '1s linear',
      translateY: `translateY(0rpx)`
    })

  },
  // 滑动视频的功能函数
  changePlay(num) {
    let { playIndex, playList, offset } = this.data;
    playIndex = playIndex + num;
    if (playIndex == -1) {
      return
    }
    else {
      if (playIndex === playList.length) {
        this.getOtherList(offset)
      }
      this.setData({
        playIndex,
        playUrl: playList[playIndex]
      })

    }
  },
  // 获取其他视频
  async getOtherList(offset) {
    let res = await request('/video/timeline/all', { offset })
    res.datas.forEach(item => {
      this.getPlayUrl(item.data.vid, 'video')
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