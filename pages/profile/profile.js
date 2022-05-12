import request from "../../utils/request";
import { handleToPlay } from "../../utils/function";
let startY = 0; // 手指起始的坐标
let moveY = 0; // 手指移动的坐标
let moveDistance = 0; // 手指移动的距离
Page({
  /**
   * 页面的初始数据
   */
  data: {
    translateY: "translateY(0)",
    transation: "",
    userInfo: {},
    recentPlayList: [],
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    if (wx.getStorageSync("userinfo")) this.init();
  },
  // 初始化
  init() {
    this.setData({
      userInfo: JSON.parse(wx.getStorageSync("userinfo")),
    });
    this.getRecentPlayed();
  },
  // 获取最近播放
  async getRecentPlayed(uid = this.data.userInfo.userId, type = 1) {
    let res = await request("/user/record", { uid, type });
    console.log(res);
    // 自己构造特殊标识
    let index = 0;
    let arr = res.weekData.slice(0, 10).map((item) => {
      item.playId = index++;
      return item;
    });
    this.setData({
      recentPlayList: arr,
    });
  },
  // 去登陆
  toLogin() {
    if (wx.getStorageSync("userinfo")) {
      wx.showToast({
        title: "你已经登录了哦",
        icon: "none",
      });
    } else {
      wx.reLaunch({
        url: "/pages/login/login",
      });
    }
  },
  // 播放历史
  handleToRecentPlay(e) {
    let { recentPlayList } = this.data;
    let arr = recentPlayList.map((item) => {
      item = item.song;
      return item;
    });
    console.log(1);
    handleToPlay(e.currentTarget.dataset.index, arr);
  },
  //我的喜欢
  toMyLove() {
    wx.navigateTo({
      url: "/pages/mylove/mylove",
    });
  },
  // 滑动
  handleTouchStart(e) {
    this.setData({
      transition: "",
    });
    startY = e.touches[0].clientY;
    // console.log('start');
  },
  handleMoveStart(e) {
    moveY = e.touches[0].clientY;
    moveDistance = moveY - startY;
    if (moveDistance < 0) return;
    if (moveDistance >= 100) moveDistance = 100;
    this.setData({
      translateY: `translateY(${moveDistance}rpx)`,
    });
  },
  handleTouchEnd(e) {
    this.setData({
      transition: "1s linear",
      translateY: `translateY(0rpx)`,
    });
  },
  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {},

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    if (wx.getStorageSync("userinfo")) this.getRecentPlayed();
  },

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
