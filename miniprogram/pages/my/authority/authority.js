// pages/my/authority/authority.js
const db = wx.cloud.database();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    rolelist:[],
    roles: ['游客','生产员', '检验员', '安装员', '维护员', '后台管理员'], 
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    wx.showLoading({
      title: '加载中...',
    })
  
    wx.cloud.callFunction({
      name: 'database',   // 云函数名称
      data: { listType: 'users2' },
      success: res => {
        console.log('callFunction test result: ', res)
        this.setData({
         rolelist: res.result.data
        });
        wx.hideLoading()
        
      },
      fail: res => {
        wx.hideLoading()
        this.setData({
          rolelist: []
        });
      }
    })  
  },

  roleChange: function (e) {
    var roleid = e.currentTarget.dataset.index;
    var role = e.detail.value;
    console.log(role.constructor)
    wx.cloud.callFunction({
      name: 'tcbRouter',   // 云函数名称
      data: {
        $url: "users", // 要调用的路由的路径，传入准确路径或者通配符*
        listType: 'users2', 
        id: roleid, 
        value: role},
      success: res => {
        console.log(res)
        this.onLoad()
        wx.showToast({
          title: '修改成功',
          duration: 2000
        })
       
      }, fail: err => {
        wx.showToast({
          title: '修改失败',
        })
      }
    })  
    
  },


delete:function(e){
  var that=this;
  var biaoid = e.currentTarget.dataset.index;
    wx.showModal({
    title: '是否删除',
    content: '',
    confirmText: "确定",
    cancelText: "取消",
    success: function (res) {
      console.log(res);
      if (res.confirm) {
        wx.cloud.callFunction({
          name: 'database-remove',
          // 传给云函数的参数
          data: {
            listType: 'users2',
            biaoid: biaoid,
          },
          success: res => {
            wx.showToast({
              title: '删除成功',
            })
            that.onLoad()
          },
         
        });
      } else {
        
      }
    }
  }); 
  }, 

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
})