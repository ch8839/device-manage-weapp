const db = wx.cloud.database()//打开数据库连接
var app = getApp();
var util = require('../../../utils/util');
import drawQrcode from '../../../utils/weapp.qrcode1.js'
Page({

  /**
   * 页面的初始数据
   */
  data: {
    post: {},
    current: 0,
    biaoTypes: ['请选择设备类型', 'G表', 'Z表', 'LG表', 'NB表', 'LoRa表','风机远程采集终端','水泵远程采集终端'],
    cardTypes: ['请选择通讯类型', '电信', '移动', '联通'],
    qualitys: ['合格', '不合格'],
    location: '',
    chooseFiles: '',
    date1:'',
    date2:''
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
  
    let username = wx.getStorageSync('username');
    this.setData({
      ['post.people1']: username,
      ['post.people2']: username,
      ['post.people3']: username,
    });
  },

  onpeople1: function (e) {
    this.setData({
      ['post.people1']: e.detail.value
    });
  },

  onId: function (e) {
    this.setData({
      ['post._id']: e.detail.value
    });
  },

  biaoTypeChange: function (e) {
    this.setData({
      ['post.defaultbiaoType']: parseInt(e.detail.value)
    })
  },

  cardTypeChange: function (e) {
    this.setData({
      ['post.defaultcardType']: e.detail.value
    })
  },

  oncardID: function (e) {
    this.setData({
      ['post.cardID']: e.detail.value
    })
  },

  onDSNUM: function (e) {
    var that=this;
    this.setData({
      ['post.DSNUM']: e.detail.value
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

  onpeople3: function (e) {
    this.setData({
      ['post.people3']: e.detail.value
    });
  },

  onLocation: function(e) {
    this.setData({
      ['post.location_d']: e.detail.value
    });
  },

  onArea: function (e) {
    this.setData({
      ['post.area']: e.detail.value
    });
  },

  onMap: function (e) {
    wx.navigateTo({
      url: 'luru/luru',
    })
  },

  onCamera: function (e) {
    wx.chooseImage({
      count: 1,
      success: (res=> {
        console.log(res)
        this.setData({
          chooseFiles: res.tempFilePaths[0]
        });     
    }),
    fail:(err=>{
      console.log(err)
    })
  })
  },

  uploadImage: function (e) {
    var that=this;
    var list=['上传至云端'];
    var DSNUM_s = this.data.post.DSNUM.replace(/\ /g, "");//空格替换
    app.showActionSheet(list).then(res=>{
      console.log(res)
      wx.cloud.uploadFile({
        cloudPath: 'installimages/' + DSNUM_s + that.data.post._id + '.png', // 上传至云端的路径
        filePath: that.data.chooseFiles, // 小程序临时文件路径
       success: res => {
         that.setData({
           count:1
         })
         wx.showToast({
           title: '上传成功'
         })
      console.log(res.fileID)
      },
      fail: console.error
    })
    }).catch(res=>{
      console.log("取消")
    })
  },

  deleteImage: function (e) {
     this.setData({
      chooseFiles:''
    });   
  },

  generate2: function (e) {
    var that=this;
    let DSNUM = that.data.post.DSNUM;
    let DSNUM_s = DSNUM.replace(/\ /g, "");//空格替换
    let DSNUM_8bit = DSNUM_s.substr(DSNUM_s.length - 8, 8)
    console.log(DSNUM_8bit)
    let cardID = that.data.post.cardID;
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


  last2: function (e) {
    this.setData({
      current: 0
    });
  },
  last3: function (e) {
    this.setData({
      current: 1
    });
  },

  filterNow1 :function() {
    db.collection('list').where({
      DSNUM: this.data.post.DSNUM
    }).get().then(res =>{
      if (res.data.length !== 0) {
        app.alert('DSNUM已存在！');
        return;
      }else{
        this.filterNow_success()
      }
    })   
  },

  filterNow_success: function () {
    var me = this.data.post;
    var that=this;
    if (!me.defaultbiaoType || me.defaultbiaoType == 0) {
      app.alert('表类型不能为空');
      return;
    }
    if (!me.DSNUM) {
      app.alert('DSNUM不能为空');
      return;
    }
   
    if (!me._id) {
      app.alert('序列号不能为空');
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

    let defaultbiaoType = me.defaultbiaoType;
    let defaultcardType = me.defaultcardType;
    let cardID = me.cardID;
    let _id=me._id;
    let DSNUM = me.DSNUM;
    let DSNUM_s = DSNUM.replace(/\ /g, "");//空格替换
    let DSNUM_8bit = DSNUM_s.substr(DSNUM_s.length - 8, 8)
    var d = new Date();
    let date1 = util.formatTime(d)
    this.setData({
      date1 :date1
    })
    let people1 = me.people1;
   
    wx.showModal({
      title: '请选择',
      content: '继续填写或者直接提交',
      confirmText: "继续",
      cancelText: "直接提交",
      success: function (res) {
        console.log(res);
        if (!res.confirm) {        
              db.collection("testlist").add({
               data: {
                      _id:_id,
                      defaultbiaoType: defaultbiaoType,
                      defaultcardType: defaultcardType,
                      cardID:cardID,
                      DSNUM_8bit: DSNUM_8bit,
                      DSNUM: DSNUM,
                      date1: date1,
                      people1: people1,
              
                     }, success: res => {
                      wx.showToast({
                        title: '提交成功',
                        duration: 1000
                     })
                      wx.switchTab({
                        url: '../home'
                      });
                      console.log(res)
                    }, fail: err => {
                      wx.showToast({
                        title: '提交失败',
                      })
                    }
                  })                                                         
        } else {         
          that.setData({
            current: 1
          });
          that.generate2()
        }
      }
    });  
  },

  filterNow2: function () {
    var that = this;
    var me = this.data.post;
    
    if (!me.people2) {
      app.alert('检验人不能为空');
      return;
    }
    let defaultbiaoType = me.defaultbiaoType;
    let defaultcardType = me.defaultcardType;
    let cardID = me.cardID;
    let _id = me._id;
    let DSNUM = me.DSNUM;
    let DSNUM_s = DSNUM.replace(/\ /g, "");//空格替换
    let DSNUM_8bit = DSNUM_s.substr(DSNUM_s.length - 8, 8)
    var d = new Date();
    let date1 = this.data.date1
    let people1 = me.people1;

    let date2 = util.formatTime(d)
    this.setData({
      date2: date2
    })
    let people2 = me.people2;
    let defaultquality = me.defaultquality;

    wx.showModal({
      title: '请选择',
      content: '继续填写或者直接提交',
      confirmText: "继续",
      cancelText: "直接提交",
      success: function (res) {
        if (!res.confirm) {
        db.collection("installlist").add({
            data: {
              defaultbiaoType: defaultbiaoType,
              defaultcardType: defaultcardType,
              cardID:cardID,
              _id: _id,
              DSNUM: DSNUM,
              DSNUM_8bit: DSNUM_8bit,
              date1: date1,
              people1: people1,                    
              date2: date2,
              defaultquality: defaultquality,             
              people2: people2,
            }, success: res => {
              wx.showToast({
                title: '提交成功',
                duration: 1000
              })
              wx.switchTab({
                url: '../home'
              });
              console.log(res)
            }, fail: err => {
              wx.showToast({
                title: '提交失败',
              })
            }
          })
        } else {
          that.setData({
            current: 2
          });
        }
      }
    });
  },

  filterNow3: function () {
    var that=this;
    var me = this.data.post;
   
    if (!me.area) {
      app.alert('安装区域不能为空');
      return;
    }
    if (!me.location_d) {
      app.alert('详细地址不能为空');
      return;
    }
    if (this.data.location == '') {
      app.alert('请选择合适的区域！');
      return;
    }

    let defaultbiaoType = me.defaultbiaoType;
    let defaultcardType = me.defaultcardType;
    let cardID = me.cardID;
    let _id = me._id;
    let DSNUM = me.DSNUM;
    let DSNUM_s = DSNUM.replace(/\ /g, "");//空格替换
    let DSNUM_8bit = DSNUM_s.substr(DSNUM_s.length - 8, 8)
    var d = new Date();
    let date1 = this.data.date1
    let people1 = me.people1;
       
    let date2 = this.data.date2
    let people2 = me.people2;
    let defaultquality = me.defaultquality;

    let area = me.area;
    
    let location = this.data.location.split(',');
    let longitude = location[0];
    let latitude = location[1];
    let location_d = me.location_d;
    let date3 = util.formatTime(d)
   
    let people3 = me.people3;
    

    wx.showLoading({
      title: '提交中...',
    })
    const installlist = db.collection('list');
    db.collection('list').add({
      data: {
        defaultbiaoType: defaultbiaoType,
        defaultcardType: defaultcardType,
        cardID:cardID,
        _id: _id,
        DSNUM_8bit: DSNUM_8bit,
        DSNUM: DSNUM,
        date1: date1,
        people1: people1,
               
        date2: date2,
        people2: people2,
        defaultquality:defaultquality,

        location_d: location_d,
        area: area,
        latitude: parseFloat(latitude),
        longitude: parseFloat(longitude),
        date3: date3,       
        people3: people3,

      }, success: res => {
        wx.hideLoading();
        wx.switchTab({
          url: '../home'
        });
        wx.showToast({
          title: '新增记录成功',
        })
      }, fail: err => {
        wx.hideLoading();
        wx.showToast({
          title: '提交失败',
        })
      }
    })
  }
})