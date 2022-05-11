// pages/songsheet/songsheet.js
import request from "../../utils/request";
import { handleToSongSheetDetail } from "../../utils/function";
import { FormatPrice } from "../../utils/toolfunction";
Page({
  /**
   * 页面的初始数据
   */
  data: {
    TagsList: [], //歌单标签列表
    clickTgeId: 0, //点击的标签名
    currentIndex: 0, //标签下标
    songSheetList: [], //歌单列表，包含所有分类各自列表
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    // 调用获取歌单标签列表函数
    this.getSongSheetTags();
  },
  // 初始化数据-------
  // 获取热门歌单标签函数
  async getSongSheetTags() {
    let { songSheetList } = this.data;
    songSheetList = new Array(10);
    let res = await request("/playlist/hot");
    let TagsList = res.tags;
    this.setData({
      TagsList,
      clickTgeId: TagsList[0].id,
      songSheetList,
    });
    // 调用获取精品歌单函数
    this.getBoutiqueSongSheet();
  },
  // 获取精品歌单函数
  async getBoutiqueSongSheet() {
    wx.showLoading({
      title: "",
      mask: true,
    });
    let { TagsList, currentIndex, songSheetList } = this.data;
    let tag = TagsList[currentIndex].name;
    let res = await request("/top/playlist", { cat: tag });
    let arr = res.playlists.slice(0, 12);
    arr = arr.map((item) => {
      item.playCount = FormatPrice(item.playCount);
      return item;
    });
    res.playlists = arr;
    res.name = tag;
    songSheetList[currentIndex] = res;
    this.setData({
      songSheetList,
    });
    wx.hideLoading();
  },
  // 事件操作--------
  // 点击标签
  TagClick(e) {
    let tag = e.currentTarget.dataset.tag;
    let currentIndex = e.currentTarget.dataset.index;
    this.setData({
      clickTgeId: tag,
      currentIndex,
    });
    this.getBoutiqueSongSheet();
  },
  //滑动swiper
  handleChangeSwiper(e) {
    let { TagsList } = this.data;
    this.setData({
      clickTgeId: TagsList[e.detail.current].id,
      currentIndex: e.detail.current,
    });
    this.getBoutiqueSongSheet();
  },
  // 前往歌单详情页
  handleToDetail(e) {
    handleToSongSheetDetail(e.currentTarget.dataset.id);
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
