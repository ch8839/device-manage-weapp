//app.js
App({
  onLaunch: function () {
    if (!wx.cloud) {
      console.error('请使用 2.2.3 或以上的基础库以使用云能力')
    } else {
      wx.cloud.init({
        env: 'ch-test-788617',//这个就是环境id
        traceUser: true
      })
    }
    this.globalData = {}
    var logs = wx.getStorageSync('logs') || []
    logs.unshift(Date())
    wx.setStorageSync('logs', logs)
    this._getUserInfo(); 
  },
  
  _getUserInfo: function () {
    var userInfoStorage = wx.getStorageSync('user');
    if (!userInfoStorage) {
      var that = this;
      wx.login({
        success: function (e) {
          console.log(1,e);
          wx.cloud.callFunction({
            name: 'tcbRouter',   // 云函数名称
            data: {
              $url: "code2Session", 
              code: e.code
            },
            success: res => {
             console.log('callFunction test result: ', res)
             var openid=res.result.data.openid;
             wx.setStorageSync('openId', openid)
            },
            fail: err => {
              console.log(err)
            }
          });
          wx.getUserInfo({
            success: function (res) {
              console.log(res);
              that.globalData.g_userInfo = res.userInfo
              wx.setStorageSync('user', res.userInfo)
            },
            fail: function (res) {
              console.log(res);
            }
          })
        }
      })
    }
    else {
      this.globalData.g_userInfo = userInfoStorage;
    }
  },

  alert: function (msg) {
    wx.showModal({
      title: '提示',
      content: msg,
      success: function (res) {
      }
    });
  },

  showActionSheet: function (list){
    return new Promise((resolve,reject)=>{
      wx.showActionSheet({
        itemList: list,
        success: function (res) {
          resolve(res)
        },
        fail:function(err){
          reject(err)
        }
    })
  })
  },

  globalData: {
    userInfo: null
  }
})