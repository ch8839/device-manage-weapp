const db = wx.cloud.database()//打开数据库连接
var app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    productlist: [],
    post:{},    
    biaoTypes: ['请选择设备类型', 'G表', 'Z表', 'LG表', 'NB表', 'LoRa表', '风机远程采集终端', '水泵远程采集终端'],
    cardTypes: ['请选择通讯类型', '电信', '移动', '联通'],
 
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
   
    console.log(biaoid)
    wx.setStorageSync('biaoidp', biaoid);
    let username = wx.getStorageSync('username');

    db.collection('productlist').where({
      _id: biaoid,
    }).get().then(res=> {
       wx.hideLoading();
      console.log(res)
      that.setData({
        post: res.result.data,
        ['post.people1']: username,
      }) 
      console.log(2,that.data.post)       
    }).catch(err=>{
      console.log(err)
    })
  },

  onId: function (e) {
    this.setData({
      ['post._id']: e.detail.value
    });
  },
 
  onpeople1: function (e) {
    this.setData({
      ['post.people1']: e.detail.value
    });

  },

  biaoTypeChange: function (e) {
    this.setData({
      ['post.defaultbiaoType']: e.detail.value
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

  filterNow: function () {
    var me = this.data.post;
    if (!me.defaultbiaoType || me.defaultbiaoType==0) {
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
    if (!me._id) {
      app.alert('序列号不能为空');
      return;
    }
   
    if (!me.defaultcardType || me.defaultcardType==0) {
      app.alert('通讯类型不能为空');
      return;
    }

    if (!me.people1) {
      app.alert('生产人不能为空');
      return;
    }
    
    let biaoid_s = wx.getStorageSync('biaoidp')
    let biaoid = parseInt(biaoid_s)

    let defaultbiaoType = me.defaultbiaoType;
    let defaultcardType = me.defaultcardType;
    let DSNUM = me.DSNUM;
    let cardID = me.cardID;
    let _id =me._id;

    var d = new Date();
    let date1 = d.getFullYear() + "-" + (d.getMonth() + 1) + "-" + d.getDate() + ' ' + d.getHours() + ':' + d.getMinutes();
    let people1 = me.people1;
    
    console.log(date1)
   
 /**
    wx.request({//请求服务器
      url: 'http://127.0.0.1:3000/',
      dataType: 'json',
      data: { '_id': biaoid, 'defaultbiaoType': defaultbiaoType, 'defaultcardType': defaultcardType, 'DSNUM': DSNUM, 'date1': date1, 'date2': date2, 'date3': date3, 'defaultarea': defaultarea, 'defaultfloor': defaultfloor, 'place': place, 'people': people },
      method: 'POST',
      success: function (res) {
        console.log('返回：'+res)
      }
    })
    
*/  wx.showLoading({
      title: '加载中...',
    })
  
    db.collection("testlist").add({
      data: {
        defaultbiaoType: defaultbiaoType,
        defaultcardType: defaultcardType,
        DSNUM: DSNUM,
        cardID:cardID,
        date1: date1,
        people1: people1,
        _id: _id
      }
    }).then(res=>{
        wx.cloud.callFunction({
          name: 'database-remove',
          // 传给云函数的参数
          data: {
            listType: 'productlist',
            biaoid: biaoid,
          }
          }).then(res => {
            var pages = getCurrentPages();//当前页面栈
            if (pages.length > 1) {
              var beforePage = pages[pages.length - 2];//获取上一个页面实例对象
              beforePage.onLoad();//触发父页面中的方法
            };
            wx.navigateBack({
              delta: 1
            })                      
        });
        wx.hideLoading()     
        wx.showToast({
          title: '提交成功',
          duration: 3000
        })              
      }).catch(err => {
        wx.hideLoading() 
        wx.showToast({
          title: '提交失败',
        })
      });     
  },   
})