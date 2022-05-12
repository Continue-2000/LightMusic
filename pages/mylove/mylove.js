const { default: request } = require("../../utils/request");
import { handleToPlay, handleToVideo } from "../../utils/function";
import { FormatPrice } from "../../utils/toolfunction";
// pages/songsheet/songsheet.js
Page({
  /**
   * 页面的初始数据
   */
  data: {
    Info: {}, //歌单信息
    List: [], //播放列表
    ListHeight: 570,
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.getMyLoveList();
  },
  // 获取我的喜欢的音乐列表
  async getMyLoveList() {
    if (wx.getStorageSync("userinfo")) {
      let { Info } = this.data;
      let userinfo = JSON.parse(wx.getStorageSync("userinfo"));
      let uid = userinfo.userId;
      let coverImgUrl = userinfo.backgroundUrl;
      let res = await request("/likelist", { uid });
      console.log(userinfo);
      Info = {
        coverImgUrl,
        creator: userinfo,
        shareCount: "分享",
        commentCount: "评论",
        subscribedCount: "收藏",
      };
      this.setData({
        Info,
      });
      let { ids } = res;
      ids.forEach((id) => {
        this.getSongDetail(id);
      });

      // res = res.playlist;

      // this.setData({
      //   Info,
      //   List: res.tracks,
      // });
    }
  },
  //获取歌曲详情
  async getSongDetail(ids) {
    let res = await request("/song/detail", { ids });
    let { List } = this.data;
    List.push(res.songs[0]);
    this.setData({
      List,
    });
  },
  // 播放全部
  toPlayAll() {
    handleToPlay(0, this.data.List);
  },
  // 前往播放音乐
  handleToPlayDetail(e) {
    let index = e.currentTarget.dataset.index;
    // 全局跳转
    handleToPlay(index, this.data.List);
  },
  // 前往播放mv
  handleToPlayMv(e) {
    let mvid = e.currentTarget.dataset.mv;
    handleToVideo(mvid, "mv");
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
