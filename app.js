App({
  globalData: {
    playing: false,//是否再播放
    playingId: '',//在播放的ID
    playSong: '',//在播放的歌曲
    playList: [],//正在播放的列表
    playIndex: 0,//正在播放的序号
    backgroundAudioManager: {},//背景音乐实例对象
  },
  // 绝对路径
  require: ($uri) => require($uri),
  /**
   * 当小程序初始化完成时，会触发 onLaunch（全局只触发一次）
   */
  onLaunch: function () {

  },

  /**
   * 当小程序启动，或从后台进入前台显示，会触发 onShow
   */
  onShow: function (options) {

  },

  /**
   * 当小程序从前台进入后台，会触发 onHide
   */
  onHide: function () {

  },

  /**
   * 当小程序发生脚本错误，或者 api 调用失败时，会触发 onError 并带上错误信息
   */
  onError: function (msg) {

  }
})
