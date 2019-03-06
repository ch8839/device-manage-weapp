// pages/home/search/search.js
const db = wx.cloud.database()
Page({
  /**
   * 页面的初始数据
   */
  data: {
    inputShowed: false,
    inputvalue2:''
  },

  oninput: function (event) {
    this.setData({
      inputvalue2: event.detail.value
    })
  },

  onClear: function(event) {
    this.setData({
      inputvalue2:''
    })
  },

  shuru2: function (e) {
    let inputvalue2 = this.data.inputvalue2;
    const list = db.collection('list')
    console.log(2, inputvalue2.constructor)
    db.collection('list').where({
      DSNUM: inputvalue2
    }).get({
      success: function (res) {
        console.log(res)
        if (res.data.length==0){
          console.log("chabudao")
          wx.showModal({
            title: '提示',
            content: '没有该设备',
          })
        }
        else {
          wx.navigateTo({
            url: '../../my/mylist/list-detail/list-detail?id=' + res.data[0]._id,
          })}

      }, fail: function (res) {
        wx.showModal({
          title: '提示',
          content: '数据库中没有',
          success: function (res) {
            wx.navigateBack({
              delta: 1
            })
          }
        })}
    })    
  },

  scanCode: function () {
    // 允许从相机和相册扫码
    var that = this;
    wx.scanCode({
      success: (res) => {
        this.show = "结果:" + res.result + "二维码类型:" + res.scanType + "字符集:" + res.charSet + "路径:" + res.path;
        console.log(res)
        var DSNUM_8bit = res.result.substr(6, 8)
        console.log(DSNUM_8bit)
        db.collection('list').where({
          DSNUM_8bit: DSNUM_8bit
        }).get().then(res=>{
            console.log(res)
            if (res.data.length == 0) {
              wx.showModal({
                title: '提示',
                content: '没有该设备',
              })
            }
            else {
              wx.navigateTo({
                url: '../../my/mylist/list-detail/list-detail?id=' + res.data[0]._id,
              })
            }
        })      
      },
      fail: (res) => {
        wx.showToast({
          title: '失败',
          icon: 'success',
          duration: 2000
        })
      },
    })
  }
})