const appInstance = getApp();

// 前去播放音乐
export const handleToPlay = function (index, list) {
  wx.navigateTo({
    url: "/pages/playdetail/playdetail",
    events: {
      // 为指定事件添加一个监听器，获取被打开页面传送到当前页面的数据
      acceptDataFromOpenedPage: function (data) {
        console.log(data);
      },
    },
    success: function (res) {
      // 通过eventChannel向被打开页面传送数据
      let data = {
        index,
        list,
      };
      res.eventChannel.emit("acceptDataFromOpenerPage", { data });
    },
  });
  console.log("全局函数");
};
//前去播放Fm
export const handleToPlayFm = function (index, fm) {
  wx.navigateTo({
    url: "/pages/fmdetail/fmdetail",
    events: {
      // 为指定事件添加一个监听器，获取被打开页面传送到当前页面的数据
      acceptDataFromOpenedPage: function (data) {
        console.log(data);
      },
    },
    success: function (res) {
      // 通过eventChannel向被打开页面传送数据
      let data = {
        index,
        fm,
      };
      res.eventChannel.emit("acceptDataFromOpenerPage", { data });
    },
  });
  console.log("全局函数");
};
// 前去播放mv/视频
// type:类型判断 是视频还是mv
export const handleToVideo = function (id, type) {
  if (appInstance.globalData.playing) {
    appInstance.globalData.playing = false;
    appInstance.globalData.backgroundAudioManager.pause();
  }
  wx.navigateTo({
    url: "/pages/videodetail/videodetail",
    events: {
      // 为指定事件添加一个监听器，获取被打开页面传送到当前页面的数据
      acceptDataFromOpenedPage: function (data) {
        console.log(data);
      },
    },
    success: function (res) {
      // 通过eventChannel向被打开页面传送数据
      let data = {
        id,
        type,
      };
      res.eventChannel.emit("acceptDataFromOpenerPage", { data });
    },
  });
  console.log("全局函数");
};

// 前往搜索详情页
export const handleToSearchDetail = function (keywords) {
  wx.navigateTo({
    url: "/pages/searchdetail/searchdetail",
    events: {
      // 为指定事件添加一个监听器，获取被打开页面传送到当前页面的数据
      acceptDataFromOpenedPage: function (data) {
        console.log(data);
      },
    },
    success: function (res) {
      // 通过eventChannel向被打开页面传送数据
      res.eventChannel.emit("acceptDataFromOpenerPage", { data: keywords });
    },
  });
};
// 前去歌单详情页
export const handleToSongSheetDetail = function (id) {
  wx.navigateTo({
    url: "/pages/songsheetdetail/songsheetdetail",
    events: {
      // 为指定事件添加一个监听器，获取被打开页面传送到当前页面的数据
      acceptDataFromOpenedPage: function (data) {
        console.log(data);
      },
    },
    success: function (res) {
      // 通过eventChannel向被打开页面传送数据
      res.eventChannel.emit("acceptDataFromOpenerPage", { data: id });
    },
  });
};
// 解析歌词
export const handleAnalyzeLyrics = function (lyric) {
  if (lyric === "") {
    return { lyric: [{ time: 0, lyric: "这个地方没有歌词！", uid: 520520 }] };
  }
  let LyricObjArr = [];
  let LyricArr = lyric.split(/\n/);
  // 匹配中括号里正则的
  const regTime = /\d{2}:\d{2}.\d{2,3}/;
  //格式化时间
  const formatLyricTime = function (time) {
    const regMin = /.*:/;
    const regSec = /:.*\./;
    const regMs = /\./;

    const min = parseInt(time.match(regMin)[0].slice(0, 2));
    let sec = parseInt(time.match(regSec)[0].slice(1, 3));
    const ms = time.slice(
      time.match(regMs).index + 1,
      time.match(regMs).index + 3
    );
    if (min !== 0) {
      sec += min * 60;
    }
    return Number(sec + "." + ms);
  };
  // 循环遍历歌曲数组
  for (let i = 0; i < LyricArr?.length; i++) {
    if (LyricArr[i] === "") continue;
    const time = formatLyricTime(LyricArr[i].match(regTime)[0]);
    if (LyricArr[i].split("]")[1] !== "") {
      LyricObjArr.push({
        time: time,
        lyric: LyricArr[i].split("]")[1],
        uid: parseInt(Math.random().toString().slice(-6)),
      });
    }
  }

  return LyricObjArr;
};
