// pages/my/testlist/testlist.js
const db = wx.cloud.database()

Page({

  /**
   * 页面的初始数据
   */
  data: {
    testlist: [],
    collect: [],
    testlist_num:'',
    untestlist_num: '',
    navTab: ['检验设备', '不合格设备'],
    currentNavtab: "0",
    biaoTypes: ['请选择设备类型', 'G表', 'Z表', 'LG表', 'NB表', 'LoRa表', '风机远程采集终端', '水泵远程采集终端'],
    showTopToast: true,
    modalHidden3: true,
    modalHidden4: true,
    none1: 1,
    none2: 1,
    text1: '暂时没有待检测设备！',
    text2: '暂时没有不合格设备！',
    start1:1,
    nodata:0
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
        listType: 'testlist',
      },
      success: res => {
        console.log('callFunction test result: ', res)
        this.setData({
          none1: 1,
          testlist: res.result.data,
          testlist_num: res.result.data.length
        });
        wx.hideLoading()
      },
      fail: res => {
        this.setData({
          none1: 0,
          testlist: [],
          testlist_num: 0
        }); 
        wx.hideLoading()      
      }     
    });
  },

  switchTab: function (e) {
    this.setData({
      currentNavtab: e.currentTarget.dataset.idx
    });
    if (this.data.currentNavtab==1){
    wx.cloud.callFunction({
      name: 'database',   // 云函数名称
      data: {
        listType: 'untestlist',
      },
      success: res => {
        console.log('callFunction test result: ', res)
        this.setData({
          none2: 1,
          untestlist: res.result.data,
          untestlist_num: res.result.data.length
        });
        wx.hideLoading()
      },
      fail: res => {
        this.setData({
          none2: 0,
          untestlist: [],
          untestlist_num: 0
        });
        wx.hideLoading()
      }
    })
    }
  },

  onPullDownRefresh: function () {
    console.log("pull down");
    wx.stopPullDownRefresh();
    this.onLoad();
  },

  back: function (e) {
    wx.switchTab({
      url: '../../my/my'
    });
  },

  select: function (e) {
    this.setData({
      testlist: this.data.testlist.reverse()
    })
  },

  select2: function (e) {
    this.setData({
      untestlist: this.data.untestlist.reverse()
    })
  },

  confirm_one3: function (e) {
    let biaoid = wx.getStorageSync('biaoid3');
    this.setData({
      modalHidden3: true,
    });
    //移除列表中下标为index的项
    const db = wx.cloud.database();
    wx.cloud.callFunction({
      name: 'database-remove',
      // 传给云函数的参数
      data: {
        listType: 'testlist',
        biaoid: biaoid,
      },
      success: res => {
        wx.showToast({
          title: '删除成功',
        })
        this.onLoad()//删除成功重新加载
      },
      fail: res => {
        wx.showToast({
          title: '删除失败',
        })
      }
    });
  },
  
  confirm_one4: function (e) {
    let biaoid = wx.getStorageSync('biaoid4');
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

  

  delete1: function (e) {
    let biaoid = e.currentTarget.dataset.index;
    console.log(biaoid);
    wx.setStorageSync('biaoid3', biaoid);
    this.setData({
      modalHidden3: false
    })
  },
  delete2: function (e) {
    let biaoid = e.currentTarget.dataset.index;
    console.log(biaoid);
    wx.setStorageSync('biaoid4', biaoid);
    this.setData({
      modalHidden4: false
    })
  },


  detail1: function (e) {
    let biaoid = e.currentTarget.dataset.index;
    console.log('id为' + biaoid);
    wx.navigateTo({
      url: 'testlist-detail/testlist-detail?id=' + biaoid,
    });
  },
  detail2: function (e) {
    let biaoid = e.currentTarget.dataset.index;
    console.log('id为' + biaoid);
    wx.navigateTo({
      url: 'untestlist-detail/untestlist-detail?id=' + biaoid,
    });
  },


  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
})