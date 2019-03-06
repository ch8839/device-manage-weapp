// pages/home/home.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
  
  },

onLoad:function(e){
  var role = wx.getStorageSync('role');
  var userId = wx.getStorageSync('userId');
  if (!userId){
    wx.showModal({
      content: '请先登录！',
      showCancel: false,
      success: function (res) {
        if (res.confirm) {
          wx.switchTab({
            url: '../my/my'
          })
        }
      }
    });
  }
  else if (!role) {
    wx.showModal({
      content: '您没有权限！请联系管理员',
      showCancel: false,
      success: function (res) {
        if (res.confirm) {
          wx.switchTab({
            url: '../my/my'
          })
        }
      }
    });
  }

},

  
  record: function () {
    var role = wx.getStorageSync('role')
    if (!role) {
      wx.showModal({
        content: '您没有权限！请联系管理员',
        showCancel: false,
        success: function (res) {
          if (res.confirm) {
            wx.switchTab({
              url: '../my/my'
            })
          }
        }
      });
    }
    else {
      wx.navigateTo({
        url: 'record/record'
      })
    };
  },

  search: function () {
    var role = wx.getStorageSync('role')
    if (!role) {
      wx.showModal({
        content: '您没有权限！请联系管理员',
        showCancel: false,
        success: function (res) {
          if (res.confirm) {
            wx.switchTab({
              url: '../my/my'
            })
          }
        }
      });
    }
    else{
    wx.navigateTo({
      url: 'search/search'
    })
    };

    
  }

})