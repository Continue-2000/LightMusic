import request from '../../utils/request'
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
    // this.playingId != vid && this.videoContext && this.videoContext.stop()
    this.videoContext = wx.createVideoContext(vid)
    // this.playingId = vid;
    // console.log(vid);
    // this.playing && this.videoContext.pause()
    // !this.playing && this.videoContext.play()
    // this.playing = !this.playing
    // console.log(this.playing);
    let { timeUpdateData } = this.data
    let isPlayedData = timeUpdateData.find(item => item.vid == e.currentTarget.id)
    if (isPlayedData) {
      console.log(isPlayedData.currentTime);
      this.videoContext.seek(isPlayedData.currentTime)
      this.setData({
        initplace: isPlayedData.currentTime
      })
    }
    this.setData({
      playingId: vid
    })
    this.videoContext.play()
  },
  // 检测视频播放了多久
  handleTimeUpdate(e) {
    // console.log(e);
    let obj = { vid: e.currentTarget.id, currentTime: e.detail.currentTime }
    let { timeUpdateData } = this.data
    // 判断是否是播放过的
    let isPlayedData = timeUpdateData.find(item => item.vid == e.currentTarget.id)
    if (isPlayedData) {
      isPlayedData.currentTime = e.detail.currentTime
    }
    else {
      timeUpdateData.push(obj)
    }
    this.setData({
      timeUpdateData
    })
  },
  //播放后清除记录
  handleEnded(e) {
    // 移除记录播放时长数组中当前视频的对象
    let { timeUpdateData } = this.data;
    timeUpdateData.splice(timeUpdateData.findIndex(item => item.vid === e.currentTarget.id), 1);
    this.setData({
      timeUpdateData
    })
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