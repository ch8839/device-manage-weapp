const db = wx.cloud.database()
Page({
  data: {
    installlist: [],
    installlist_num:'',
    navTab: ['待安装设备'],
    currentNavtab: "0",
    biaoTypes: ['请选择设备类型', 'G表', 'Z表', 'LG表', 'NB表', 'LoRa表', '风机远程采集终端', '水泵远程采集终端'],
    showTopToast: true,
    modalHidden3: true,
    modalHidden4: true,
    none1: 1
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    wx.showLoading({
      title: '加载中...',
    })

    //云函数请求数据库
    wx.cloud.callFunction({
      name: 'database',   // 云函数名称
      data: {
        listType: "installlist"
      },
      success: res => {
        console.log('callFunction test result: ', res)
        this.setData({
          none1: 1,
          installlist: res.result.data,
          installlist_num: res.result.data.length
        });
        
        wx.hideLoading()
      },
      fail: res => {
        this.setData({
          installlist: [],
          none1: 0,
          installlist_num: 0
        });
        wx.hideLoading()
      }
    })
  },

  switchTab: function (e) {
    this.setData({
      currentNavtab: e.currentTarget.dataset.idx
    });
  },

  back: function (e) {
    wx.switchTab({
      url: '../../my/my'
    });
  },

  select: function (e) {
    this.setData({
      installlist: this.data.installlist.reverse()
    })
  },

  confirm_one3: function (e) {
    let biaoid = wx.getStorageSync('biaoid5');
    this.setData({
      modalHidden3: true,
    });
    //移除列表中下标为index的项
    const db = wx.cloud.database();
    wx.cloud.callFunction({
      name: 'database-remove',
      // 传给云函数的参数
      data: {
        listType: 'installlist',
        biaoid: biaoid,
      },
      success: res => {
        wx.showToast({
          title: '删除成功',
        })
        this.onLoad()//删除成功重新加载
      }, fail: err => {
        wx.showToast({
          title: '删除失败',
        })
      }
    })
    console.log(biaoid)
  },
  confirm_one4: function (e) {
    let biaoid = wx.getStorageSync('biaoid6');
    this.setData({
      modalHidden4: true,
    });
    //移除列表中下标为index的项
    const db = wx.cloud.database();
    db.collection("untestlist").doc(biaoid).remove({
      success: res => {
        wx.showToast({
          title: '删除成功',
        })
        this.onLoad()//删除成功重新加载
      }, fail: err => {
        wx.showToast({
          title: '删除失败',
        })
      }
    })
    console.log(biaoid)
  },


  cancel_one3: function (e) {
    this.setData({
      modalHidden3: true
    });
  },
  cancel_one4: function (e) {
    this.setData({
      modalHidden4: true
    });
  },



  delete: function (e) {
    let biaoid = e.currentTarget.dataset.index;
    console.log(biaoid);
    wx.setStorageSync('biaoid5', biaoid);
    this.setData({
      modalHidden3: false
    })
  },
  delete2: function (e) {
    let biaoid = e.currentTarget.dataset.index;
    console.log(biaoid);
    wx.setStorageSync('biaoid6', biaoid);
    this.setData({
      modalHidden4: false
    })
  },


  detail1: function (e) {
    let biaoid = e.currentTarget.dataset.index;
    console.log('id为' + biaoid);
    wx.navigateTo({
      url: 'installlist-detail/installlist-detail?id=' + biaoid,
    });
  },


  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
})