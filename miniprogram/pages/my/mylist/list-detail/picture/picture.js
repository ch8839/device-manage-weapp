// pages/my/mylist/list-detail/picture/picture.js
import drawQrcode from '../../../../../utils/weapp.qrcode1.js'
var util = require('../../../../../utils/util');
const app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    chooseFiles:'',
    DSNUM:'',
    _id:'',
    cardID:''
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    console.log(options)
    var biaoid = options.id;
    var DSNUM = options.DSNUM;
    var cardID = options.cardID
    var fileID = 'cloud://ch-test-788617.6368-ch-test-788617/installimages/' + DSNUM.replace(/\ /g, "") + biaoid + '.png';

    this.setData({
      chooseFiles: fileID,
      DSNUM: DSNUM,
      _id: biaoid,
      cardID:cardID
    })
    this.generate2()    
  },

  onCamera: function (e) {
    wx.chooseImage({
      count: 1,
      success: (res => {
        console.log(res)
        this.setData({
          chooseFiles: res.tempFilePaths[0]
        });
      }),
      fail: (err => {
        console.log(err)
      })
    })
  },

  uploadImage: function (e) {
    var that = this;
    var list = ['上传至云端'];
    var DSNUM_s = this.data.DSNUM.replace(/\ /g, "");//空格替换
    app.showActionSheet(list).then(res => {
      wx.cloud.deleteFile({
        fileList: ['installimages/' + DSNUM_s + that.data._id + '.png'],
        success: res => {
          wx.cloud.uploadFile({
            cloudPath: 'installimages/' + DSNUM_s + that.data._id + '.png', // 上传至云端的路径
            filePath: that.data.chooseFiles, // 小程序临时文件路径
            success: res => {
              wx.showToast({
                title: '上传成功'
              })
              console.log(res.fileID)
            },
            fail: console.error
          })
        },
        fail: console.error
      })
    }).catch(res => {
      console.log("取消")
    })
  },

  deleteImage: function (e) {
    this.setData({
      chooseFiles: ''
    });
  },

  generate2: function (e) {
    let DSNUM = this.data.DSNUM;
    console.log(DSNUM)
    let DSNUM_s = DSNUM.replace(/\ /g, "");//空格替换
    let DSNUM_8bit = DSNUM_s.substr(DSNUM_s.length - 8, 8)
    console.log(DSNUM_8bit)
    let cardID = this.data.cardID;
    let _id = this.data._id;

    drawQrcode({
      width: 170,
      height: 170,
      canvasId: 'myQrcode',
      typeNumber: 10,
      text: 'DSNUM:' + DSNUM_8bit + '————' + 'SIM_ID:' + cardID,
      content: DSNUM_8bit,
      _id: _id,
      callback(e) {
        console.log('e: ', e)
      }
    })
  },

  save1: function () {
    var list = ['保存图片'];
    var id = 'myQrcode';
    app.showActionSheet(list).then(res => {
      util.canvasDraw(id).then(res => {
        console.log(res)
        return wx.saveImageToPhotosAlbum({
          filePath: res.tempFilePath,
          success(res) {
            wx.showToast({
              title: '已保存到相册'
            })
          }
        })
      }).catch(err => {
        console.log(err)
      })
    }).catch(err => {
      console.log(err)
    })
  },
  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
})