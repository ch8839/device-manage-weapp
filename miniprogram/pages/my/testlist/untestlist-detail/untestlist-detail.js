const db = wx.cloud.database()//打开数据库连接
import drawQrcode from '../../../../utils/weapp.qrcode1.js';
var util = require('../../../../utils/util');
var app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    testlist: [],
    post: {},
    biaoTypes: ['请选择设备类型', 'G表', 'Z表', 'LG表', 'NB表', 'LoRa表', '风机远程采集终端', '水泵远程采集终端'],
    cardTypes: ['请选择通讯类型', '电信', '移动', '联通'],
    signals: ['请选择信号强度', '正常', '微弱', '异常'],
    qualitys: ['合格', '不合格'],
    navTab: ['检验信息', '生产信息'],
    currentNavtab: "0",
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {

    wx.showLoading({
      title: '加载中...',
    })
    var that = this
    var biaoid = options.id;
    wx.setStorageSync('biaoidt2', biaoid);
    let username = wx.getStorageSync('username');
    console.log("检验详情" + biaoid)

    db.collection('untestlist').where({
      _id: biaoid,//这里excel表导入时_id类型为num，但在页面上取值时为string 所以需将转换为数据库中_id对应的num类型
    }).get().then(function (res) {
      wx.hideLoading();
      console.log(res)
      that.setData({
        post: res.data[0],
        ['post.people2']: username,
      })
      console.log(2, that.data.post)
    }).then(function () {
      that.generate2()
    });
  },

  switchTab: function (e) {
    this.setData({
      currentNavtab: e.currentTarget.dataset.idx
    });
  },

  
  onpeople2: function (e) {
    this.setData({
      ['post.people2']: e.detail.value
    });
  },

  onQuality: function (e) {
    this.setData({
      ['post.defaultquality']: e.detail.value
    })
  },

  generate2: function (e) {
    let DSNUM = this.data.post.DSNUM;
    console.log(DSNUM)
    let DSNUM_s = DSNUM.replace(/\ /g, "");//空格替换
    let DSNUM_8bit = DSNUM_s.substr(DSNUM_s.length - 8, 8)
    console.log(DSNUM_8bit)
    let cardID = this.data.post.cardID;
    let _id = this.data.post._id;

    drawQrcode({
      width: 170,
      height: 170,
      canvasId: 'myQrcode2',
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
    var id = 'myQrcode2';
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


  filterNow2: function () {
    var me = this.data.post;
    if (!me.defaultbiaoType || me.defaultbiaoType == 0) {
      app.alert('表类型不能为空');
      return;
    }
    if (!me.DSNUM) {
      app.alert('DSNUM不能为空');
      return;
    }
    if (!me.cardID) {
      app.alert('SIM卡号不能为空');
      return;
    }
    if (!me.defaultcardType || me.defaultcardType == 0) {
      app.alert('通讯类型不能为空');
      return;
    }
    if (!me.people1) {
      app.alert('生产人不能为空');
      return;
    }
    if (!me.defaultquality) {
      app.alert('请填写是否合格');
      return;
    }

    if (!me.people2) {
      app.alert('检验人不能为空');
      return;
    }

    var role = wx.getStorageSync('role');
    if (role == 1) {
      app.alert('你没有该权限！');
      return;
    }

    let biaoid = wx.getStorageSync('biaoidt2')

    let defaultbiaoType = me.defaultbiaoType;
    let defaultcardType = me.defaultcardType;
    let DSNUM = me.DSNUM;
    let DSNUM_s = DSNUM.replace(/\ /g, "");//空格替换
    let DSNUM_8bit = DSNUM_s.substr(DSNUM_s.length - 8, 8)
    let date1 = me.date1;
    let people1 = me.people1;

    var d = new Date();
    let date2 = d.getFullYear() + "-" + (d.getMonth() + 1) + "-" + d.getDate() + ' ' + d.getHours() + ':' + d.getMinutes();
    let people2 = me.people2;
    let defaultquality = me.defaultquality

    if (me.defaultquality == 0) {
      wx.showLoading({
        title: '加载中...',
      });
      const installlist = db.collection('installlist');
      db.collection("installlist").add({
        data: {
          _id:biaoid,
          defaultbiaoType: defaultbiaoType,
          defaultcardType: defaultcardType,
          DSNUM: DSNUM,
          DSNUM_8bit: DSNUM_8bit,
          cardID: cardID,
          date1: date1,
          people1: people1,
          date2: date2,         
          people2: people2,
          defaultquality: defaultquality
        }, success: res => {

          wx.cloud.callFunction({
            name: 'database-remove',
            // 传给云函数的参数
            data: {
              listType: 'untestlist',
              biaoid: biaoid,
            },
            success: res => {
              var pages = getCurrentPages();//当前页面栈
              if (pages.length > 1) {
                var beforePage = pages[pages.length - 2];//获取上一个页面实例对象
                beforePage.onLoad();//触发父页面中的方法
              };
              wx.navigateBack({
                delta: 1
              })
            },
          });
          wx.hideLoading();
          wx.showToast({
            title: '提交成功',
            duration: 3000
          })
          console.log(res)
        }, fail: err => {
          wx.showToast({
            title: '提交失败',
          })
        }
      })
    }
    else {
      wx.showModal({
        content: '设备不合格将提交到待检验列表',
        showCancel: false,
        success: function (res) {
          if (res.confirm) {
            wx.showLoading({
              title: '加载中...',
            });
            db.collection("untestlist").add({
              data: {
                defaultbiaoType: defaultbiaoType,
                defaultcardType: defaultcardType,
                DSNUM: DSNUM,
                DSNUM_8bit: DSNUM_8bit,
                date1: date1,
                people1: people1,
                date2: date2,
                people2: people2,
                defaultquality: defaultquality
              }, success: res => {
                wx.cloud.callFunction({
                  name: 'database-remove',
                  // 传给云函数的参数
                  data: {
                    listType: 'untestlist',
                    biaoid: biaoid,
                  },
                  success: res => {
                    var pages = getCurrentPages();//当前页面栈
                    if (pages.length > 1) {
                      var beforePage = pages[pages.length - 2];//获取上一个页面实例对象
                      beforePage.onLoad();//触发父页面中的方法
                    };
                    wx.hideLoading()
                    wx.navigateBack({
                      delta: 1
                    })
                    wx.showToast({
                      title: '提交成功',
                      duration: 3000
                    })
                  }
                })
                
              }
            })
          };
        }
      });
    }
  }

})