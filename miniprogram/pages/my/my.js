var bmap = require('../libs/bmap-wx.min.js');
const { $Toast } = require('../../dist/base/index');
var app = getApp();
Page({
  data: {
    weatherData: '',
    motto: 'Hello World',
    defaultUrl: '../../images/avatar1.jpg',
    userTx: '',
    username: '点击头像登录',
    alllist_s:0,
    productlist_s:0,
    testlist_s:0,
    installlist_s:0,
    authority_s:0
  },


  /**
   * 生命周期函数--监听页面加载
   */
  onShow: function () {
    var userId = wx.getStorageSync('userId');
    var role = wx.getStorageSync('role');
    var openId = wx.getStorageSync('openId');
    var that = this;
    const db = wx.cloud.database();
    db.collection('users2').where({
      _openid: openId,
    }).get({
      success: function (res) {
        if (res.data.length == 0) {
          wx.setStorageSync('username', '')
          wx.setStorageSync('avatar', '')
          wx.setStorageSync('userId', '')
          wx.setStorageSync('role', '')
          that.setData({
            productlist_s: 0,
            alllist_s: 0,
            testlist_s: 0,
            installlist_s: 0,
            authority_s: 0
          });         
        };

        if (res.data[0].role !== role) {
          wx.showModal({
            title: '提示',
            content: '检测到您权限发生变换 请点击头像重新登录',
            success: function (res) {
            }
          })
        }  
      }
  })
  },

  onLoad: function () {
  //调用数据库查看当前登陆用户角色
  var that=this;
    var userId = wx.getStorageSync('userId');
    var role = wx.getStorageSync('role');
    console.log("角色："+role)

    if (role == 0) {
      that.setData({
        productlist_s: 0,
        alllist_s: 0,
        testlist_s: 0,
        installlist_s: 0,
        authority_s:0
      });
      $Toast({
        content: '您好游客'
      });
    }

    if (role == 1) {
      that.setData({
        productlist_s: 1,
        alllist_s: 0,
        testlist_s: 1,
        installlist_s: 0,
        authority_s: 0
      });
      $Toast({
        content: '您好生产员'
      });  
    }

    if (role == 2) {
      that.setData({
        testlist_s: 1,
        productlist_s: 0,
        alllist_s: 0,
        installlist_s: 1,
        authority_s: 0
      });
      $Toast({
        content: '您好检验员'
      });  
    }

    if (role == 3) {
      that.setData({
        installlist_s: 1,
        productlist_s: 0,
        alllist_s: 1,
        testlist_s: 0,
        authority_s: 0
      });
      $Toast({
        content: '您好安装员'
      });  
    }

    if (role == 4) {
      that.setData({
        alllist_s: 1,
        productlist_s: 0,
        testlist_s: 0,
        installlist_s: 0,
        authority_s: 0
      });
      $Toast({
        content: '您好维护员'
      });  
    }

    if (role == 5) {
      that.setData({
        alllist_s: 1,
        productlist_s: 1,
        testlist_s: 1,
        installlist_s: 1,
        authority_s: 1
      });
      $Toast({
        content: '您好管理员'
      });  
    }
    console.log(userId)
    const db = wx.cloud.database();
    
      

//百度api调用
    var that = this;
    var BMap = new bmap.BMapWX({
      ak: 'VdnMGqzI7rwGB9gIghN6iiBcqgAHG37m'
    });
    var fail = function (data) {
      console.log('fail!!!!')
    };
    var success = function (data) {
      console.log('success!!!');
      var weatherData = data.currentWeather[0];
      weatherData = weatherData.currentCity + '\n' + weatherData.temperature+weatherData.weatherDesc ;
      that.setData({
        weatherData: weatherData
      });
    }
    BMap.weather({
      fail: fail,
      success: success
    });
  
//用户身份信息
    let username = wx.getStorageSync('username'),
      avatar = wx.getStorageSync('avatar');
    if (username) {
      this.setData({
        username: username,
        defaultUrl: avatar
      })
    }
  },

  getUserInfoHandler: function (e) {
   var that=this;
    console.log(e)
    let d = e.detail.userInfo
    this.setData({
      userTx: d.avatarUrl,
      username: d.nickName
    })
    wx.setStorageSync('username', d.nickName)
    wx.setStorageSync('avatar', d.avatarUrl)
    
    var userId = wx.getStorageSync('userId')
    if (!userId) {
      userId = this.getUserId()
    }
    
    const db = wx.cloud.database()
    db.collection('users2').where({
      _openid: wx.getStorageSync('openId')
    }).get({
      success: res => {
        console.log('查询用户:', res)
        if (res.data && res.data.length > 0) {
          console.log('已存在')
          wx.setStorageSync("userId", res.data[0].userId)
          wx.setStorageSync('openId', res.data[0]._openid)
          wx.setStorageSync('role', res.data[0].role)
          if (res.data[0].role == 1) {
            that.setData({
              productlist_s: 1,
              alllist_s: 0,
              testlist_s: 1,
              installlist_s: 0,
              authority_s: 0
            });
            $Toast({
              content: '您好生产员'
            });    
          }

          if (res.data[0].role == 2) {
            that.setData({
              testlist_s: 1,
              productlist_s: 0,
              alllist_s: 0,
              installlist_s: 1,
              authority_s: 0
            });
            $Toast({
              content: '您好检验员'
            });    
          }

          if (res.data[0].role == 3) {
            that.setData({
              installlist_s: 1,
              productlist_s: 0,
              alllist_s: 1,
              testlist_s: 0,
              authority_s: 0
            });
            $Toast({
              content: '您好安装员'
            });    
          }

          if (res.data[0].role == 4) {
            that.setData({
              alllist_s: 1,
              productlist_s: 0,
              testlist_s: 0,
              installlist_s: 0,
              authority_s: 0
            });
            $Toast({
              content: '您好维护员'
            });    
          }

          if (res.data[0].role == 5) {
            that.setData({
              alllist_s: 1,
              productlist_s: 1,
              testlist_s: 1,
              installlist_s: 1,
              authority_s: 1
            });
            $Toast({
              content: '您好管理员'
            });    
          }

          if (res.data[0].role == 0) {
            that.setData({
              productlist_s: 0,
              alllist_s: 0,
              testlist_s: 0,
              installlist_s: 0,
              authority_s: 0
            });         
            $Toast({
              content: '您好游客'
            });    
          }  
        }      
        else {
          setTimeout(() => {
            db.collection('users2').add({
              data: {
                userId: userId,
                role:0,
                username: d.nickName,
                userTx: d.avatarUrl
              },
              success: function (res) {           
                wx.showToast({
                  title: '用户登录成功',
                })
                console.log('用户id新增成功');               
                db.collection('users2').where({
                  userId: userId
                }).get({
                  success: res => {
                    console.log(4,res)
                    wx.setStorageSync('openId', res.data[0]._openid);
                    wx.setStorageSync('role', res.data[0].role)
                  },
                  fail: err => {
                    console.log('用户_openid设置失败')
                  }
                })
              },
              fail: function (e) {
                console.log('用户id新增失败')
              }
            })
          }, 100)
        }

       
      },
      fail: err => {

      }
    })
  },

  getUserId: function () {
    var w = "abcdefghijklmnopqrstuvwxyz0123456789",
      firstW = w[parseInt(Math.random() * (w.length))];

    var userId = firstW + (Date.now()) + (Math.random() * 100000).toFixed(0)
    console.log(userId)
    wx.setStorageSync("userId", userId)

    return userId;
  },

  gomap: function () {
   wx.navigateTo({
     url: 'map/map',
   })
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  },

  //事件处理函数
  onalllist: function () {
    wx.navigateTo({
      url: 'mylist/mylist'
    })
  },

  onproductlist: function () {
    wx.navigateTo({
      url: 'productlist/productlist'
    })
  },

  ontestlist: function () {
    wx.navigateTo({
      url: 'testlist/testlist'
    })
  },

  oninstalllist: function () {
    wx.navigateTo({
      url: 'installlist/installlist'
    })
  },

  onmark: function () {
    wx.navigateTo({
      url: 'mymark/mymark'
    })
  },

  onAuthority: function () {
    wx.navigateTo({
      url: 'authority/authority'
    })
  },

  onclear: function () {
    wx.clearStorageSync();
    wx.showToast({
      title: '清除成功',
    })
      
  },

  

  
})