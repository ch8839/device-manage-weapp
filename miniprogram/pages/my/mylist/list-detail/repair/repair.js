// pages/my/mylist/list-detail/repair/repair.js

const db = wx.cloud.database();
Page({
  /**
   * 页面的初始数据
   */
  data: {
    problem: [{
      id: 1,
      name: '设备信息有误',
    }, {
      id: 2,
      name: '信号不正常'
    }, {
      id: 3,
      name: '问题3'
    }, {
      id: 4,
      name: '问题4',
    }],
    checked: false,
    position: 'left',
    current: [],
    biaoTypes: ['请选择设备类型', 'G表', 'Z表', 'LG表', 'NB表', 'LoRa表', '风机远程采集终端', '水泵远程采集终端'],
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    console.log(options)
    this.setData({
      DSNUM:options.DSNUM,
      defaultbiaoType: options.defaultbiaoType,
      area:options.area
    })
  },
  handleFruitChange(e) {
    const index = this.data.current.indexOf(e.detail.value);
    index === -1 ? this.data.current.push(e.detail.value) : this.data.current.splice(index, 1);
    this.setData({
      current: this.data.current
    });
    console.log(this.data.current)
  },
  
  onExtra: function (e) {
    this.setData({
      extra_describe: e.detail.value
    })
  },

  onSubmit(e){
    let biaoid = wx.getStorageSync('biaoidl');
    let info = this.data.extra_describe;
    let username = wx.getStorageSync('username');
    let formId=e.detail.formId;
    let biaoType = this.data.biaoTypes[this.data.defaultbiaoType]
    console.log(formId)
    console.log(formId.constructor)
    wx.showLoading({
      title: '提交中',
    })
    var d = new Date();
    const time = d.getFullYear() + "-" + (d.getMonth() + 1) + "-" + d.getDate() + ' ' + d.getHours() + ':' + d.getMinutes();
    wx.cloud.callFunction({
      name: 'tcbRouter',
      data: {
        $url: "repair",
        DSNUM: this.data.DSNUM,
        biaoType: biaoType,
        area:this.data.area,
        problem: this.data.current.toString(),
        info: info,
        username: username,
        formId: formId,
        biaoid:biaoid,
        time:time
      }
      }).then(res=>{
           console.log(res)
      })

    db.collection("repair-list").add({
      data: {
        problem: this.data.current,
        info:info,
        biaoid: biaoid,
      }
    }).then( res => {
      wx.hideLoading()
      
      wx.showToast({
        title: '提交成功',
        duration: 1500,
        success:res=>{
          wx.navigateBack({
            delta: 1
          })
        }
       })
      }).catch ( err => {
        wx.hideLoading()
        console.log(err);
        wx.showToast({
          title: '提交失败',
        })
    })  
  },
  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
})