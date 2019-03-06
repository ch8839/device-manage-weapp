// pages/my/productlist/productlist.js
// pages/my/testlist/testlist.js
const db = wx.cloud.database()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    productlist: [],
    collect: [],
    navTab: ['全部'],
    currentNavtab: "0",
    biaoTypes: ['请选择设备类型', 'G表', 'Z表', 'LG表', 'NB表', 'LoRa表', '风机远程采集终端', '水泵远程采集终端'],
    showTopToast: true,
    modalHidden3: true,
    modalHidden4: true,
    none1:1,
    text: '暂时没有待录入设备！',
    productlist_num:''
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
      data: { listType:'productlist'},
      success: res => {        
        console.log('callFunction test result: ', res)
       this.setData({
         none1: 1,
         productlist_num: res.result.data.length,
         productlist:res.result.data
       });
        wx.hideLoading() 
      },
      fail:res => {                 
        wx.hideLoading() 
        this.setData({
          none1: 0,
          productlist:[],
          productlist_num:0
        }); 
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
     productlist:this.data.productlist.reverse()
   })
  },

  confirm_one3: function (e) {
    let biaoid = wx.getStorageSync('biaoid2');
    this.setData({
      modalHidden3: true,
    });
    //移除列表中下标为index的项
    const db = wx.cloud.database();
    wx.cloud.callFunction({
      name: 'database-remove',
      // 传给云函数的参数
      data: {
        listType: 'productlist',
        biaoid: biaoid,
      },
      success: res =>{
        wx.showToast({
          title: '删除成功',
        })
        this.onLoad()//删除成功重新加载
      },
        fail: res =>{
        wx.showToast({
          title: '删除失败',
        })}
    });
  },

  cancel_one3: function (e) {
    this.setData({
      modalHidden3: true
    });
  },

  delete: function (e) {
    let biaoid = e.currentTarget.dataset.index;
    console.log(biaoid);
    wx.setStorageSync('biaoid2', biaoid);
    this.setData({
      modalHidden3: false
    })
  },

  detail1: function (e) {
    let biaoid = e.currentTarget.dataset.index;
    console.log('id为' + biaoid);
    wx.navigateTo({
      url: 'productlist-detail/productlist-detail?id=' + biaoid,
    });
  },


  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
})