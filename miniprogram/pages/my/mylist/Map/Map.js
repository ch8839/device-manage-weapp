// pages/my/mylist/Map/Map.js
const db = wx.cloud.database()
var $ = require('../../../libs/conf.js');
Page({

  /**
   * 页面的初始数据
   */
  data: {
    markers: [],
    info:'',
    longitude: '',
    latitude: '',
    area: '',
    count:''
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {

    var that = this;
    $.map.getRegeo({
      success(data) {
        that.setData({
          latitude: data[0].latitude,
          longitude: data[0].longitude,
        });
      }
    })

    wx.cloud.callFunction({
      name: 'database', // 云函数名称
      data: {
        listType: 'list'
      },
      success: res => {
        console.log('callFunction test result: ', res)
        console.log(': ', res.result.data[0].latitude)
        var markers = [];
        var arr = res.result.data;
        console.log(arr)
        //去掉重复的坐标
        for (var i = 0; i < arr.length; i++) {
          for (var j = i + 1; j < arr.length; j++) {
            if (arr[i].longitude == arr[j].longitude && arr[i].latitude == arr[j].latitude) {
              ++i
            }
          }                  
          markers.push({
            id: i,
            iconPath: '../../../../images/marker2.png',
            longitude: arr[i].longitude,
            latitude: arr[i].latitude
          })
        }
        //对数组id进行按递进顺序重新排列，方便之后取值
        for (var m = 0; m < markers.length;m++){
          markers[m].id=m
        }                       
        console.log(markers)
        that.setData({
          markers: markers
        });
        wx.hideLoading()
      },
      fail: res => {
        wx.hideLoading()
        this.setData({
          markers: []
        });
      }
    })
  },

  makertap: function (e) {
    console.log(e)
    var markers = this.data.markers
    var i=e.markerId

    //这里需要用数组整体赋值来改变点击marker颜色变化，如果只setData点击的marker[i]颜色变换会报错
    for (var k = 0; k < markers.length;k++){
      if(k==i){
        this.data.markers[k].iconPath = '../../../../images/marker1.png'
      }else{
        this.data.markers[k].iconPath = '../../../../images/marker2.png'
      }
    }
    this.setData({
      markers: this.data.markers
    })
    wx.cloud.callFunction({
      name: 'tcbRouter',   // 云函数名称
      data: {
        $url: 'markerinfo' ,
        listType: 'list',
        longitude: markers[i].longitude,
        latitude: markers[i].latitude,
      }
     }).then(res=>{
       console.log(res)
       this.setData({
        area:res.result.data.info.data[0].area,
        count: res.result.data.info.data.length
       })
     })
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function() {

  }
})