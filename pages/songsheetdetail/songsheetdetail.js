const { default: request } = require("../../utils/request");
import { handleToPlay, handleToVideo } from "../../utils/function";
import { FormatPrice } from "../../utils/toolfunction";
// pages/songsheet/songsheet.js
Page({
  /**
   * 页面的初始数据
   */
  data: {
    id: "",
    Info: {}, //歌单信息
    List: [], //播放列表
    isSub: false,
    ListHeight: 570,
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    let _this = this;
    // 获取歌单id
    const eventChannel = this.getOpenerEventChannel();
    // 监听acceptDataFromOpenerPage事件，获取上一页面通过eventChannel传送到当前页面的数据
    eventChannel.on("acceptDataFromOpenerPage", function (data) {
      // 歌单id
      let id = data.data;
      _this.setData({
        id,
      });
      _this.getSongSheetInfo(id);
      console.log(id);
    });
  },
  // 收藏取消收藏
  async changeSubStatus(t, id) {
    let res = await request("/playlist/subscribe", { t, id });
    console.log(res);
  },
  // 获取歌单详细信息
  async getSongSheetInfo(id) {
    let { Info, List } = this.data;
    let res = await request("/playlist/detail", { id });
    res = res.playlist;
    Info = {
      coverImgUrl: res.coverImgUrl,
      name: res.name,
      creator: res.creator,
      description: res.description,
      shareCount: FormatPrice(res.shareCount),
      commentCount: FormatPrice(res.commentCount),
      subscribedCount: FormatPrice(res.subscribedCount),
    };
    this.setData({
      Info,
      List: res.tracks,
    });
  },

  //收藏
  handleSub() {
    let { id, isSub } = this.data;
    isSub = !isSub;
    if (!isSub) {
      let _this = this;
      wx.showModal({
        content: "确定取消收藏",
        success: function (res) {
          if (res.confirm) {
            //这里是点击了确定以后
            _this.setData({
              isSub,
            });
            this.changeSubStatus(2, id);
          } else {
            //这里是点击了取消以后
            isSub = !isSub;
          }
        },
      });
    } else {
      this.setData({
        isSub,
      });
      this.changeSubStatus(1, id);
    }
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
