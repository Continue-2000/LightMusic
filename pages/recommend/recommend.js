// pages/recommend/recommend.js
import request from '../../utils/request'
import PubSub from 'pubsub-js'

Page({
  /**
   * 页面的初始数据
   */
  data: {
    scrollheight: '',
    recommendList: [],
    index: 0
  },
  // 滑动距离
  // onPageScroll: function (t) {
  //   console.log(t);
  // },
  // 跳转播放详情页
  handleToPlayDetail(e) {
    let index = e.currentTarget.dataset.index;

    this.setData({
      index
    })
    // console.log(e);
    wx.navigateTo({
      url: '/pages/playdetail/playdetail',
      events: {
        // 为指定事件添加一个监听器，获取被打开页面传送到当前页面的数据
        acceptDataFromOpenedPage: function (data) {
          console.log(data)
        },
      },
      success: function (res) {
        // 通过eventChannel向被打开页面传送数据
        res.eventChannel.emit('acceptDataFromOpenerPage', { data: e.currentTarget.dataset })
      }
    })
  },
  /**
 * 生命周期函数--监听页面加载
 */
  onLoad: function (options) {
    this.getRecommendList()
    // 订阅切歌信息
    PubSub.subscribe('cutsongType', (msg, type) => {
      console.log(msg, type);
      this.getCutSong(type)
    })
  },
  //获得推荐列表
  async getRecommendList() {
    let res = await request('/recommend/songs')
    console.log(res);
    this.setData({
      recommendList: res.data.dailySongs
    })
  },
  //  发布切歌信息
  getCutSong(type) {
    let { recommendList, index } = this.data
    let song = type == 'pre' ? recommendList[this.CutSongIndex(-1)] : recommendList[this.CutSongIndex(1)]
    PubSub.publish('cutsongInfo', song)
  },
  // 切歌操作
  CutSongIndex(num) {
    let { index, recommendList } = this.data
    let len = recommendList.length
    index = index + num;
    if (index == -1) {
      index = len - 1
    }
    else if (index == len) {
      index = 0;
    }
    this.setData({
      index
    })
    return index
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