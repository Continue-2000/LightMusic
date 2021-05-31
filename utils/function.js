
// 前去播放音乐
export const handleToPlay = function (index, list) {
  wx.navigateTo({
    url: '/pages/playdetail/playdetail',
    events: {
      // 为指定事件添加一个监听器，获取被打开页面传送到当前页面的数据
      acceptDataFromOpenedPage: function (data) {
        console.log(data)
      },
    },
    success: function (res) {
      // 通过eventChannel向被打开页面传送数据
      let data = {
        index,
        list
      }
      res.eventChannel.emit('acceptDataFromOpenerPage', { data })
    }
  })
  console.log('全局函数');
}
// 前去播放mv/视频
// type:类型判断 是视频还是mv
export const handleToVideo = function (id, type) {
  wx.navigateTo({
    url: '/pages/videodetail/videodetail',
    events: {
      // 为指定事件添加一个监听器，获取被打开页面传送到当前页面的数据
      acceptDataFromOpenedPage: function (data) {
        console.log(data)
      },
    },
    success: function (res) {
      // 通过eventChannel向被打开页面传送数据
      let data = {
        id,
        type
      }
      res.eventChannel.emit('acceptDataFromOpenerPage', { data })
    }
  })
  console.log('全局函数');
}

// 前往搜索详情页
export const handleToSearchDetail = function (keywords) {
  wx.navigateTo({
    url: '/pages/searchdetail/searchdetail',
    events: {
      // 为指定事件添加一个监听器，获取被打开页面传送到当前页面的数据
      acceptDataFromOpenedPage: function (data) {
        console.log(data)
      }
    },
    success: function (res) {
      // 通过eventChannel向被打开页面传送数据
      res.eventChannel.emit('acceptDataFromOpenerPage', { data: keywords })
    }
  })
}