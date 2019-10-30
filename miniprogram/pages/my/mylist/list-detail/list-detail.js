// pages/my/mylist/list-detail/list-detail.js
const db = wx.cloud.database();
const app = getApp();

Page({
  /**
   * 页面的初始数据
   */
  data: {
    navTab: ['设备信息','图片'],
    currentNavtab: "0", 
    post:{},
    list:[], 
    biaoTypes: ['请选择设备类型', 'G表', 'Z表', 'LG表', 'NB表', 'LoRa表', '风机远程采集终端', '水泵远程采集终端'],
    cardTypes: ['请选择通讯类型', '电信', '移动', '联通'],
    qualitys: ['合格', '不合格'],
    location: '',
    chooseFiles: '',
    savebutton:true
  },

  /**
   * 生命周期函数--监听页面加载
   */
    onLoad: function (options) {
      var role = wx.getStorageSync('role');
      if (role == 5 || role == 4) {
        this.setData({
          savebutton:false
        })
      }
      wx.showLoading({
        title: '加载中...',
      })
      var that = this;
      var biaoid = options.id;  
      wx.setStorageSync('biaoidl', biaoid);
      console.log("查询"+ biaoid)
    
       db.collection('list').doc(biaoid).get()
      .then(res=>{
          that.setData({
            post:res.data
          })
          wx.hideLoading();
          console.log(res.data);               
         })
    },

  back:function(){
    var pages = getCurrentPages();//当前页面栈
    wx.navigateBack({
      delta: 1
    }) 
  },

  onPic:function(){
    wx.navigateTo({
      url: 'picture/picture?id=' + this.data.post._id+'&DSNUM='+this.data.post.DSNUM+'&cardID='+this.data.post.cardID,
    })
  },

  onRepair: function (e) {
    var DSNUM = this.data.post.DSNUM;
    var defaultbiaoType = this.data.post.defaultbiaoType;
    var area = this.data.post.area;
    wx.navigateTo({
      url: 'repair/repair?DSNUM=' + DSNUM + '&defaultbiaoType=' + defaultbiaoType + '&area=' + area,
    })
  },

  onMap: function (e) {
    var latitude = this.data.post.latitude;
    var longitude = this.data.post.longitude;
    wx.navigateTo({
      url: 'detail-address/detail-address?current_latitude='+latitude+'&current_longitude='+longitude,
    });
  },

  dateChange1: function (event) {
    this.setData({
      ['post.date1']: event.detail.value
    })
  },

  onpeople1: function (e) {
    this.setData({
      ['post.people1']: e.detail.value
    });
  },

  biaoTypeChange: function (e) {
    this.setData({
      ['post.defaultbiaoType']: parseInt(e.detail.value)
    })
  },

  cardTypeChange: function (e) {
    this.setData({
      ['post.defaultcardType']: e.detail.value
    })
  },

  onDSNUM: function (e) {
    this.setData({
      ['post.DSNUM']: e.detail.value
    });
  },

  dateChange2: function (e) {
    this.setData({
      ['post.date2']: e.detail.value
    })
  },

  onpeople2: function (e) {
    this.setData({
      ['post.people2']: e.detail.value
    });
  },

  onQuality: function (e) {
    this.setData({
      ['post.defaultquality']: e.detail.value
    })
  },

  dateChange3: function (e) {
    this.setData({
      ['post.date3']: e.detail.value
    })
  },

  onpeople3: function (e) {
    this.setData({
      ['post.people3']: e.detail.value
    });
  },

  onLocation: function (e) {
    this.setData({
      ['post.location_d']: e.detail.value
    });
  },
 

  filterNow: function (e) {
    var me = this.data.post;
    if (!me.defaultbiaoType || me.defaultbiaoType == 0) {
      app.alert('表类型不能为空');
      return;
    }
    if (!me.DSNUM) {
      app.alert('DSNUM不能为空');
      return;
    }
    if (!me.defaultcardType || me.defaultcardType == 0) {
      app.alert('通讯类型不能为空');
      return;
    }
    if (!me.date1) {
      app.alert('生产日期不能为空');
      return;
    }
    if (!me.people1) {
      app.alert('生产人不能为空');
      return;
    }
    if (!me.defaultquality) {
      app.alert('请选择是否合格');
      return;
    }
    
    if (!me.date2) {
      app.alert('检验日期不能为空');
      return;
    }
    if (!me.people2) {
      app.alert('检验人不能为空');
      return;
    }
    if (!me.area) {
      app.alert('安装区域不能为空');
      return;
    }
    if (!me.location_d) {
      app.alert('详细地址不能为空');
      return;
    }
    if (!me.date3) {
      app.alert('安装日期不能为空');
      return;
    }
    if (!me.people3) {
      app.alert('安装人不能为空');
      return;
    }
    var role = wx.getStorageSync('role');
    if (role == 3) {
      app.alert('你没有该权限！');
      return;
    }
    if (!me.area) {
      app.alert('请选择合适的区域！');
      return;
    }

    let biaoid = wx.getStorageSync('biaoidl')

    let defaultbiaoType = me.defaultbiaoType;
    let defaultcardType = me.defaultcardType;
    let DSNUM = me.DSNUM;
    let DSNUM_s = DSNUM.replace(/\ /g, "");//空格替换
    let DSNUM_8bit = DSNUM_s.substr(DSNUM_s.length - 8, 8)
    let date1 = me.date1;
    let people1 = me.people1;

    
    let date2 = me.date2;
    let defaultquality = me.defaultquality;
    console.log(defaultquality)
    let people2 = me.people2;

    let area = me.area;
    let location;
    let longitude;
    let latitude;
    if (this.data.location==''){
      longitude = me.longitude;
      latitude = me.latitude
    }else{
      location = this.data.location.split(',');
      longitude = parseFloat(location[0]);
      latitude = parseFloat(location[1]);
    }
    
    let location_d = me.location_d;
    let date3 = me.date3;
    let people3 = me.people3;
    
    wx.cloud.callFunction({
      name: 'tcbRouter',   
      data: {
        $url: "list", 
        biaoid: biaoid, 
        listType: 'list', 
        defaultbiaoType: defaultbiaoType,
        defaultcardType: defaultcardType,
        DSNUM: DSNUM,
        DSNUM_8bit: DSNUM_8bit,
        date1: date1,
        people1: people1,
        defaultquality: defaultquality,
        date2: date2,
        people2: people2,
        area: area,
        latitude: latitude,
        longitude: longitude,
        location_d: location_d,
        date3: date3,
        people3: people3,

      }, success: res => {
            var pages = getCurrentPages();//当前页面栈
            if (pages.length > 1) {
              var beforePage = pages[pages.length - 2];//获取上一个页面实例对象
              beforePage.onLoad();//触发父页面中的方法
            };
            wx.navigateBack({
              delta: 1
            })     
        wx.showToast({
          title: '修改成功',
          duration: 1000
        })
        console.log(res)
      }, fail: err => {
        console.log(err);
        wx.showToast({
          title: '修改失败',
        })
      }
    })  
  }
})