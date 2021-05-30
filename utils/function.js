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