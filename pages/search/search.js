// pages/search/search.js
import request from "../../utils/request.js";
import { handleToSearchDetail } from "../../utils/function";
let timer;
Page({
  /**
   * 页面的初始数据
   */
  data: {
    searchKey: "",
    inputValue: "",
    isLookMore: false,
    hostSearchList: [], //存储热搜数据
    searchList: [], //搜索到的数据
    isSearched: false,
    searchHistoryList: [],
  },
  // 获取搜索关键字
  async getSearchKey() {
    let res = await request("/search/default");
    this.setData({
      searchKey: res.data.realkeyword,
    });
    console.log(res);
  },
  // 本地获取搜索历史
  getSearchHistoryList() {
    let { searchHistoryList } = this.data;
    searchHistoryList = JSON.parse(wx.getStorageSync("searchHistoryList"));
    this.setData({
      searchHistoryList,
    });
  },
  // 添加搜索记录到本地
  addSearchHistory(keywords = "") {
    let { searchHistoryList } = this.data;
    console.log("bol", Array.isArray(searchHistoryList));
    let index = searchHistoryList.indexOf(keywords);
    if (index != -1) {
      searchHistoryList.splice(index, 1);
    }
    if (keywords) {
      console.log("searchHistoryList", searchHistoryList);
      searchHistoryList.unshift(keywords);
      console.log("searchHistoryList", searchHistoryList);
      wx.setStorageSync("searchHistoryList", JSON.stringify(searchHistoryList));
    }
  },
  // 删除搜索记录
  handleRemoveHistory() {
    wx.showModal({
      title: "确认删除吗？",
      content: "",
      showCancel: true,
      cancelText: "取消",
      cancelColor: "#000000",
      confirmText: "确定",
      confirmColor: "#3CC51F",
      success: (result) => {
        if (result.confirm) {
          wx.setStorageSync("searchHistoryList", []);
          // 更新记录
          this.getSearchHistoryList();
        }
      },
    });
  },
  // 删除搜索
  handleDeleteInput() {
    this.setData({
      inputValue: "",
      searchList: [],
    });
  },
  // 获取热搜榜
  async getHotSearchList() {
    let res = await request("/search/hot/detail");
    console.log(res);
    this.setData({
      hostSearchList: res.data.slice(0, 10),
    });
  },
  //获取热搜列表（详细）
  async getHotSearchListDetail() {
    let res = await request("/search/hot/detail");
    // console.log(res);
    this.setData({
      hostSearchList: res.data,
      isLookMore: true,
    });
  },
  // 查看更多
  handleLookMore() {
    this.getHotSearchListDetail();
  },
  // 处理搜索的函数
  handleInputChange(e) {
    // console.log(e);
    let inputValue = e.detail.value;
    this.setData({
      inputValue,
    });
    // 防抖优化
    if (timer) clearTimeout(timer);
    timer = setTimeout(() => {
      if (inputValue.length != 0) this.getSearchList(inputValue);
      else {
        this.setData({
          searchList: [],
        });
      }
    }, 300);
  },
  // 获取搜素到的列表
  async getSearchList(keywords) {
    let { searchList } = this.data;
    let res = await request("/search", { keywords, limit: 10 });
    searchList = res.result.songs;
    this.setData({
      searchList,
    });
    console.log(res);
  },
  // 点击搜索功能函数
  handleSearchClick(e) {
    let keywords = e.currentTarget.dataset.keywords;
    // 保存搜索记录到本地
    this.addSearchHistory(keywords);
    // 重新获取
    this.getSearchHistoryList();
    // 跳转至搜索详情
    handleToSearchDetail(keywords);
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    // 得到搜索关键词
    this.getSearchKey();
    // 得到热搜列表
    this.getHotSearchList();

    this.addSearchHistory();
    // 得到本地搜索记录
    this.getSearchHistoryList();
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {},

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {},

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {},

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {},

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {},

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {},

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {},
});
