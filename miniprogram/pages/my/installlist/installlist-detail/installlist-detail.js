const db = wx.cloud.database()//打开数据库连接
var app = getApp();
import drawQrcode from '../../../../utils/weapp.qrcode1.js';
var util = require('../../../../utils/util');
Page({

  /**
   * 页面的初始数据
   */
  data: {
    installist: [],
    post: {},
    biaoTypes: ['请选择设备类型', 'G表', 'Z表', 'LG表', 'NB表', 'LoRa表', '风机远程采集终端', '水泵远程采集终端'],
    cardTypes: ['请选择通讯类型', '电信', '移动', '联通'],
    qualitys: ['合格', '不合格'],
    navTab: ['安装信息','检验信息', '生产信息'],
    currentNavtab: "0",
    location:'',
    chooseFiles:'',
    count:''
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
    wx.setStorageSync('biaoidi', biaoid);
    console.log("检验详情" + biaoid);
    let username = wx.getStorageSync('username');
    
    db.collection('installlist').where({
      _id: biaoid,
    }).get().then(res=>{
        wx.hideLoading();
        console.log(res)
        that.setData({
          post: res.data[0],
          ['post.people3']: username,
        })
        console.log(2, that.data.post)
      }).then(res=>{
        that.generate2()
      })
   
  },

  switchTab: function (e) {
    this.setData({
      currentNavtab: e.currentTarget.dataset.idx
    });
  },

  dateChange3: function (e) {
    this.setData({
      ['post.date3']: e.detail.value
    })
  },

  onpeople3: function (e) {
    this.setData({
      ['post.people3']: e.detail.value
    });
  },

  onLocation: function (e) {
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
      url: 'address/address',
    });
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
      wx.showLoading({
        title: '加载中',
      })
      wx.cloud.uploadFile({
        cloudPath: 'installimages/' + DSNUM_s + that.data.post._id + '.png', // 上传至云端的路径
        filePath: that.data.chooseFiles, // 小程序临时文件路径
       success: res => {
         wx.hideLoading()
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
    let DSNUM = this.data.post.DSNUM;
    let DSNUM_s = DSNUM.replace(/\ /g, "");//空格替换
    let DSNUM_8bit = DSNUM_s.substr(DSNUM_s.length - 8, 8)
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

 
  filterNow: function () {
    var me = this.data.post;
    
    if (!me.area) {
      app.alert('安装区域不能为空');
      return;
    }

    if (!me.location_d) {
      app.alert('详细位置不能为空');
      return;
    }

    if (!me.people3) {
      app.alert('安装人不能为空');
      return;
    }

    if (this.data.count==0) {
      app.alert('请将照片上传至云端');
      return;
    }

    var role = wx.getStorageSync('role');
    if (role == 2) {
      app.alert('你没有该权限！');
      return;
    }
    if (this.data.location == '') {
      app.alert('请选择合适的区域！');
      return;
    }

    let biaoid = wx.getStorageSync('biaoidi');
    

    let defaultbiaoType = me.defaultbiaoType;
    let defaultcardType = me.defaultcardType;
    let DSNUM = me.DSNUM;
    let DSNUM_8bit= me.DSNUM_8bit
    let date1 = me.date1;
    let people1 = me.people1;
    

    let date2 = me.date2;
    let people2 = me.people2;
    let defaultquality = me.defaultquality

    let location = this.data.location.split(',');
    let longitude = location[0];
    let latitude =location[1];
    console.log(location)
    let area=me.area;
    let location_d = me.location_d;
    var d = new Date();
    let date3 = d.getFullYear() + "-" + (d.getMonth() + 1) + "-" + d.getDate() + ' ' + d.getHours() + ':' + d.getMinutes();
    console.log(date3)
    let people3 = me.people3;

    
    wx.showLoading({
      title: '加载中...',
    })
      const installlist = db.collection('list');
      db.collection("list").add({
        data: {
          _id: biaoid,
          defaultbiaoType: defaultbiaoType,
          defaultcardType: defaultcardType,
          DSNUM: DSNUM,
          DSNUM_8bit: DSNUM_8bit,
          date1: date1,
          people1: people1,
         
          date2: date2,
          people2: people2,
          defaultquality: defaultquality,

          latitude: parseFloat(latitude),
          longitude: parseFloat(longitude),
          area: area,
          location_d: location_d,
          date3: date3,
          people3: people3,
          

        }, success: res => {
          wx.cloud.callFunction({
            name: 'database-remove',
            // 传给云函数的参数
            data: {
              listType: 'installlist',
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
            duration: 2000
          })
          console.log(res)
        }, fail: err => {
          wx.hideLoading();
          wx.showToast({
            title: '提交失败',
          })
        }
      })
    }
    
})