// components/navheader/NavHeader.js
import { handleToSongSheetDetail, handleToVideo } from '../../utils/function'

Component({
  /**
   * 组件的属性列表
   */
  properties: {
    ScrollItemInfo: {
      type: Object
    }
  },

  /**
   * 组件的初始数据
   */
  data: {

  },

  /**
   * 组件的方法列表
   */
  methods: {
    handleToDetail(e) {
      let { ScrollItemInfo } = this.data
      if (ScrollItemInfo.songsheet) {
        handleToSongSheetDetail(e.currentTarget.dataset.id)
      }
      if (ScrollItemInfo.mv) {
        handleToVideo(e.currentTarget.dataset.id, 'mv')
      }
      if (ScrollItemInfo.video) {
        handleToVideo(e.currentTarget.dataset.id, 'video')
      }
    }
  }
})
