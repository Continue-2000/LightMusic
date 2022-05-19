// pages/recommend/recommend.js
import request from "../../utils/request";
import { handleToPlay, handleToVideo } from "../../utils/function";
import moment from "moment";
Page({
  /**
   * 页面的初始数据
   */
  data: {
    d: "",
    m: "",
    scrollheight: "",
    recommendList: [],
    List: [],
    ListHeight: 466,
    index: 0,
  },
  // 滑动距离
  // onPageScroll: function (t) {
  //   console.log(t);
  // },
  // 播放全部
  toPlayAll() {
    handleToPlay(0, this.data.recommendList);
  },
  // 跳转播放详情页
  handleToPlayDetail(e) {
    let index = e.currentTarget.dataset.index;
    // 全局跳转
    handleToPlay(index, this.data.recommendList);
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.getRecommendList();
    this.getDate();
  },
  //获得推荐列表
  async getRecommendList() {
    let res = await request("/recommend/songs");
    if (res.code == 200) {
      // console.log(res);
      this.setData({
        recommendList: res.data.dailySongs,
        List: res.data.dailySongs,
      });
    } else {
      wx.showToast({
        title: "请先登录哦",
        icon: "none",
      });
    }
  },
  //获取日期
  getDate() {
    let date = moment(new Date()).format("M-D");
    let [m, d] = date.split("-");
    this.setData({
      m,
      d,
    });
  },
  //前往播放视频
  handleToPlayMv(e) {
    handleToVideo(e.currentTarget.dataset.mv, "mv");
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
