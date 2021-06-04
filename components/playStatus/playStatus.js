// components/playStatus/playStatus.js
import { handleToPlay } from "../../utils/function"
var appInstance = getApp()
Component({
  /**
   * 组件的属性列表
   */
  properties: {
    isShow: {
      type: Boolean,
      value: false
    },
    playing: {
      type: Boolean
    },
    playSong: {
      type: Object,
    },
    playList: {
      type: Array
    },
    playIndex: {
      type: Number
    },
    backgroundAudioManager: {
      type: Object,
      value: {}
    }
  },

  /**
   * 组件的初始数据
   */
  data: {
    isLookSongList: false,
    List: [],//查看播放的列表
    ListHeight: 240,//查看列表的高度
  },

  /**
   * 组件的方法列表
   */
  methods: {
    // 播放、暂停
    handlePlayStatus() {
      let { playing, backgroundAudioManager } = this.data
      playing = !playing
      if (playing) {
        backgroundAudioManager.play()
      }
      else
        backgroundAudioManager.pause()
      this.setData({
        playing
      })
    },
    // 前往播放页
    handlePlay() {
      let { playIndex, playList } = this.data
      handleToPlay(playIndex, playList)
    },
    // 打开列表栏
    handleLookSongList() {
      console.log(1);
      this.setData({
        isLookSongList: !this.data.isLookSongList,
        List: this.data.playList
      })
    },
    handleToPlayDetail(e) {
      let { playList } = this.data
      this.handleLookSongList()
      handleToPlay(e.currentTarget.dataset.index, playList)
    }
  }
})
