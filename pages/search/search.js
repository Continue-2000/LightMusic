// pages/search/search.js
import request from '../../utils/request.js'
let timer;
Page({

  /**
   * 页面的初始数据
   */
  data: {
    searchKey: '',
    inputValue: '',
    isLookMore: false,
    hostSearchList: [],//存储10条热搜数据
    searchList: [],//搜索到的数据
    allList: [],//存储20条数据
    isSearched: false
  },
  // 获取搜索关键字
  async getSearchKey() {
    let res = await request('/search/default')
    this.setData({
      searchKey: res.data.realkeyword
    })
    console.log(res);
  },
  // 删除搜索
  handleDeleteInput() {
    this.setData({
      inputValue: '',
      searchList: []
    })
  },
  // 获取热搜榜
  async getHotSearchList(num) {
    let res = await request('/search/hot/detail')
    // console.log(res);
    this.setData({
      allList: res.data,
      hostSearchList: res.data.slice(0, num)
    })
  },
  // 查看更多
  handleLookMore() {
    this.setData({
      isLookMore: true,
      hostSearchList: this.data.allList
    })
  },
  // 处理搜索的函数
  handleInputChange(e) {
    // console.log(e);
    let inputValue = e.detail.value
    this.setData({
      inputValue
    })
    // 防抖优化
    if (timer) clearTimeout(timer)
    timer = setTimeout(() => {
      if (inputValue.length != 0)
        this.getSearchList(inputValue)
      else {
        this.setData({
          searchList: []
        })
      }
    }, 300)
  },
  // 获取搜素列表
  async getSearchList(keywords) {
    let { searchList } = this.data
    let res = await request('/search', { keywords, limit: 10 })
    searchList = res.result.songs
    this.setData({
      searchList
    })
    console.log(res);
  },
  // 点击搜索功能函数
  handleSearchClick() {
    wx.navigateTo({
      url: 'String',
      success: function (res) {
        // success
      },
      fail: function () {
        // fail
      },
      complete: function () {
        // complete
      }
    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.getSearchKey()
    this.getHotSearchList(10)
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