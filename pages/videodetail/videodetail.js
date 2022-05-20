// pages/viedodetail/videodetail.js
import request from "../../utils/request";
import moment from "moment";
Page({
  /**
   * 页面的初始数据
   */
  data: {
    playId: 0,
    playUrl: "",
    type: "",
    isPlay: true,
    playInfo: "", //mv数据
    playIndex: 0, //正在播放的序号
    offset: 0, //加载的其他视频的页数
    playList: [], //播放的列表
    startY: 0,
    moveY: 0,
    moveDistanceY: 0,
    translateY: "translateY(0)",
    transation: "",
    isLookComment: false, //是否看评论
    playingIndex: 0,
    videoContext: 0, //当前video
    comments: [], //评论,
    offset: 0,
    sendMsg: "", //发送内容
    isReply: false, //是否是回复
    commentId: "",
    replayNickName: "", //回复的人
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    let { videoContext } = this.data;
    // 接收视频/mv数据
    const eventChannel = this.getOpenerEventChannel();
    let _this = this;
    eventChannel.on("acceptDataFromOpenerPage", function (data) {
      console.log(data);
      let playId = data.data.id;
      let type = data.data.type;
      _this.setData({
        playId,
        type,
      });
      // _this.getPlayUrl(playId, type);
      // _this.playList.push(playId);
    });
    videoContext = wx.createVideoContext("myVideo0", this);
    this.setData({
      videoContext,
    });
    videoContext.play();
    // 获取播放地址
    //获取播放列表
    this.getPlayList();
  },
  // 暂停继续播放
  videoClick() {
    let { isPlay, videoContext } = this.data;
    isPlay = !isPlay;
    if (isPlay) videoContext.play();
    else videoContext.pause();
    this.setData({
      isPlay,
    });
  },
  //获取播放列表
  async getPlayList() {
    let { playId, type } = this.data;
    let res = await request("/related/allvideo", { id: playId });
    console.log("playList", res);
    this.getPlayUrl(playId, type);
    res.data.map((item) => {
      this.getPlayUrl(item.vid, type);
    });
  },
  // 获取播放地址
  async getPlayUrl(id, type) {
    console.log(type);
    let url = type == "mv" ? "/mv/url" : "/video/url";
    let res = await request(url, { id });
    let playUrl = type == "mv" ? res.data.url : res.urls[0].url;
    this.getPlayInfo(id, type, playUrl);
  },
  // 获取mv/视频数据
  async getPlayInfo(id, type, playUrl) {
    let { playList } = this.data;
    let url = type == "mv" ? "/mv/detail" : "/video/detail";
    let res;
    if (type == "mv") res = await request(url, { mvid: id });
    else if (type == "video") res = await request(url, { id });
    let obj = {
      id,
      playUrl,
      playInfo: res.data,
    };
    playList.push(obj);
    this.setData({
      playList,
    });
    console.log("playList", playList);
  },
  //获取评论数据
  async getCommentData() {
    let { playId, type, offset, comments } = this.data;
    let url = `/comment/${type}`;
    wx.showLoading({
      title: "加载中",
    });
    let res = await request(url, { id: playId, offset });
    wx.hideLoading();
    let newComments = res.comments.map((item) => {
      return {
        commentId: item.commentId,
        avatarUrl: item.user.avatarUrl,
        nickname: item.user.nickname,
        content: item.content,
        time: moment(item.time).format("YYYY-MM-DD"),
        replys: [],
      };
    });
    comments = [...comments, ...newComments];
    this.setData({
      offset: offset + 1,
      comments,
    });
    console.log("comments", comments);
    console.log("replay", playId);
  },
  //参与评论（发送/回复）
  async handleToComment(t, type, id, content, commentId = "") {
    let userinfo = JSON.parse(wx.getStorageSync("userinfo"));
    let { comments } = this.data;
    console.log("userinfo", userinfo);
    let { userId, avatarUrl, nickname } = userinfo;
    let time = moment(new Date()).format("YYYY-MM-DD");
    let newObj = {
      avatarUrl,
      nickname,
      time,
      content,
    };
    if (type === "mv") {
      type = 1;
    } else if (type === "video") {
      type = 5;
    }
    if (commentId) {
      let res = await request("/comment", { t, type, content, id, commentId });
      if (res.code === 200) {
        wx.showToast({
          title: `回复成功`,
          icon: "none",
          duration: 2000,
        });
        comments.some((item) => {
          if (item.commentId === commentId) {
            item.replys.unshift({
              nickname,
              content,
            });
          }
        });
        this.setData({
          comments,
        });
      }
    } else {
      let res = await request("/comment", { t, type, content, id });
      if (res.code === 200) {
        wx.showToast({
          title: `发送成功`,
          icon: "none",
          duration: 2000,
        });
        comments.unshift(newObj);
        this.setData({
          comments,
        });
      }
    }
  },
  //滚动swiper
  handleChangeSwiper(e) {
    let { videoContext, playList } = this.data;
    videoContext.pause();
    videoContext = wx.createVideoContext("myVideo" + e.detail.current, this);
    videoContext.play();
    let index = e.detail.current;
    this.setData({
      playId: playList[index][id],
      playingIndex: index,
      videoContext,
      comments: [],
    });
  },

  // 右侧控制栏
  // 是否看评论
  handleLookComment() {
    let isLookComment = !this.data.isLookComment;
    if (isLookComment) this.getCommentData();
    this.setData({
      isLookComment,
    });
  },
  //隐藏评论
  handleHiddenComment() {
    this.setData({
      isLookComment: false,
    });
  },
  // 回复
  handleToReply(e) {
    console.log("回复");
    let commentId = e.currentTarget.dataset.commentid;
    let replayNickName = e.currentTarget.dataset.nickname;
    if (!commentId) {
      wx.showToast({
        title: "不能回复自己哦",
        icon: "none",
        duration: 1500,
      });
      return;
    }
    this.setData({
      isReply: true,
      commentId,
      replayNickName,
    });
  },
  //取消回复
  handleToCancel() {
    this.setData({
      isReply: false,
      commentId: "",
    });
  },
  //离开输入
  //隐藏输入框
  onHideInput() {
    this.setData({
      isReply: false,
    });
    console.log("发送");
  },
  //获取评论content数据
  bindInputMsg(e) {
    this.setData({
      sendMsg: e.detail.value,
    });
    console.log("e.detail.value", e.detail.value);
  },
  //发送
  handleToSend() {
    let { sendMsg, isReply, type, playId, commentId } = this.data;
    console.log("sendMsg", sendMsg);
    let t = isReply ? 2 : 1;
    this.handleToComment(t, type, playId, sendMsg, commentId);
  },
  //重置input
  cleanInput: function () {
    var setMessage = { sendInfo: this.data.userMessage };
    this.setData(setMessage);
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
