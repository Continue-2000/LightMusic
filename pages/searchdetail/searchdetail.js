// pages/searchdetail/searchdetail.js
import request from '../../utils/request'
import { handleToPlay, handleToVideo } from '../../utils/function'

Page({

  /**
   * 页面的初始数据
   */
  data: {
    clickTitle: '单曲',
    List: [],
    ListHeight: 230,
    keywords: ''
  },
  // 选择主题
  titleClick(e) {
    console.log(e.currentTarget.dataset.title);
    this.setData({
      clickTitle: e.currentTarget.dataset.title
    })
  },
  // 播放所有
  toPlayAll() {
    handleToPlay(0, this.data.List)
  },
  // 前往播放音乐
  handleToPlayDetail(e) {
    let index = e.currentTarget.dataset.index;
    // 全局跳转
    handleToPlay(index, this.data.List)
  },
  // 前往播放mv
  handleToPlayMv(e) {
    let mvid = e.currentTarget.dataset.mv
    handleToVideo(mvid, 'mv')
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    // let { keywords } = this.data
    let _this = this
    // 获取搜索点击关键字
    const eventChannel = this.getOpenerEventChannel()
    // 监听acceptDataFromOpenerPage事件，获取上一页面通过eventChannel传送到当前页面的数据
    eventChannel.on('acceptDataFromOpenerPage', function (data) {
      _this.setData({
        keywords: data.data
      })
      // console.log(res);
      // 获取搜索到的单曲列表 type:1
      _this.getSearchData(1)
      // 获取mvid
      _this.getSearchData(1004)

    })
    // this.setData({
    //   keywords: res
    // })


  },
  // 根据搜索类型获得数据
  async getSearchData(typeNum) {
    let { keywords, List } = this.data
    if (typeNum == 1) {
      console.log(keywords, typeNum);
      let res = await request('/cloudsearch', { keywords, type: typeNum })
      console.log(res);

      this.setData({
        List: res.result.songs
      })

    }
    if (typeNum == 1004) {
      let res = await request('/cloudsearch', { keywords, type: typeNum })
      console.log(res);
    }
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