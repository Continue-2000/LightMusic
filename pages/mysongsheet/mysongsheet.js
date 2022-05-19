// pages/mysongsheet/mysongsheet.js
const { default: request } = require("../../utils/request");
import { handleToSongSheetDetail } from "../../utils/function";

// pages/songsheet/songsheet.js
Page({
  /**
   * 页面的初始数据
   */
  data: {
    songSheetList: [],
  },
  onLoad() {
    this.getMySongSheetList();
  },
  //获取我的歌单
  async getMySongSheetList() {
    console.log(1111113);
    let userinfo = JSON.parse(wx.getStorageSync("userinfo"));
    let uid = userinfo.userId;
    let res = await request("/user/playlist", { uid });
    this.setData({
      songSheetList: res.playlist.slice(1),
    });
    this.UpdateTitle();
    console.log(res.playlist.slice(1));
  },
  UpdateTitle() {
    let { songSheetList } = this.data;
    wx.setNavigationBarTitle({
      title: `收藏的歌单(${songSheetList.length})`,
    });
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
