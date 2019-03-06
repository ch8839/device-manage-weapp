// pages/my/mylist/mylist.js
const db = wx.cloud.database()
var $ = require('../../libs/conf.js');
var cityData = require('../../libs/city.js');

Page({

  /**
   * 页面的初始数据
   */
  data: {
  list: [],
  list_num: '',
  navTab:['全部','地图分布'],
  biaoTypes: ['请选择设备类型', 'G表', 'Z表', 'LG表', 'NB表', 'LoRa表', '风机远程采集终端', '水泵远程采集终端'],
  showTopToast: true,
  modalHidden3: true,
  modalHidden4: true,
  none1: 1,
  inputvalue2: '',
  
  start: 1,
  nodata: 0,
  current: 1,
  allpages:[],
  page_num:10, //默认一页显示设备数量
  filtrate_url: "list_page",
  filtrate_count_url: "list_count",
  biaoType:'',
  visible1:false,
  actions1: [
    {
      name: '全部',
    },
    {
      name: 'G表'
    },
    {
      name: 'Z表'
    },
    {
      name: 'LG表'
    },
    {
      name: 'NB表'
    },
    {
      name: 'LoRa表'
    },
    {
      name: '风机远程采集终端'
    },
    {
      name: '水泵远程采集终端',
    }
  ]
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options)  {
    wx.showLoading({
      title: '加载中...',
    })
    //请求第一页数据
    wx.cloud.callFunction({
      name: 'tcbRouter',   // 云函数名称
      data: {
      $url: this.data.filtrate_url, 
      listType: 'list' ,
      page_num: this.data.page_num,
      start:1,
      defaultbiaoType: this.data.biaoType
      },
      success: res => {
        console.log('callFunction test result: ', res) 
        this.setData({
          none1: 1,
          list: res.result.data.tasks.data,
          current: 1
        });
        wx.hideLoading()
      },
      fail: res => {
        wx.hideLoading()
        this.setData({
         list: [],
         none1: 0,
        });
      }
    });

    //请求设备总数量
    wx.cloud.callFunction({
      name: 'tcbRouter',   // 云函数名称
      data: {
        $url: this.data.filtrate_count_url,
        listType: 'list',
        defaultbiaoType: this.data.biaoType
      }
    }).then(res => {
      console.log(res)
      var total = res.result.data.counts.total
      var num=this.data.page_num;
      var pages = Math.ceil(total / num);   // 向上取整得到页数
      var allpages=[];
      for (var i = 1; i <= pages;i++){  
          allpages[i-1]=i   
      };
      console.log(allpages);//选择器的页码数组
      this.setData({
        list_num: total,
        pages: pages,
        allpages: allpages
      });
    })  
  },

  //上下页逻辑
  handleChange({ detail }) {
    const type = detail.type;
    if (type === 'next') {
      this.setData({
        current: this.data.current + 1
      });
    } else if (type === 'prev') {
      this.setData({
        current: this.data.current - 1
      });
    };
    this.onPage()
  },

  onPullDownRefresh: function () {
    console.log("pull down");
    wx.stopPullDownRefresh();
    this.onLoad();
  },

  //点击选择器数字后触发
  pageSelect2: function (e) {
    console.log(e)
    wx.showLoading({
      title: '加载中...',
    });
    wx.cloud.callFunction({
      name: 'tcbRouter',   // 云函数名称
      data: {
        $url: this.data.filtrate_url,
        listType: 'list',
        page_num: this.data.page_num,
        start: e.detail.page,
        defaultbiaoType: this.data.biaoType
      },
      success: res => {
        var list_page = res.result.data.tasks.data;
        console.log(list_page)
        var list = list_page;
        this.setData({
          list: list,
          current: e.detail.page
        })
        wx.hideLoading();
      },
      fail: res => {
        wx.hideLoading()
        this.setData({
          list: this.data.list,
          current:1
        });
      }
    });
  },

  //点击上下页
  onPage: function () {
    wx.showLoading({
      title: '加载中...',
    });
    wx.cloud.callFunction({
      name: 'tcbRouter',   // 云函数名称
      data: {
        $url: this.data.filtrate_url,
        listType: 'list',
        page_num: this.data.page_num,
        start: this.data.current,
        defaultbiaoType: this.data.biaoType
      },
      success: res => {
        var list_page = res.result.data.tasks.data;
        console.log(list_page)
        var list = list_page;
        this.setData({
          list: list
        })
        wx.hideLoading();
      },
      fail: res => {
        wx.hideLoading()
        this.setData({
          list: this.data.list,
        });
      }
    });
  },

  scanCode: function () {
    // 允许从相机和相册扫码
    var that = this;
    wx.scanCode({
      success: (res) => {
        this.show = "结果:" + res.result + "二维码类型:" + res.scanType + "字符集:" + res.charSet + "路径:" + res.path;
        console.log(res)
        var DSNUM_8bit = res.result.substr(6, 8)
        console.log(DSNUM_8bit)
        db.collection('list').where({
          DSNUM_8bit: DSNUM_8bit
        }).get().then(res=>{
            console.log(res)
            if (res.data.length == 0) {
              wx.showModal({
                title: '提示',
                content: '没有该设备',
              })
            }
            else {
              wx.navigateTo({
                url: 'list-detail/list-detail?id=' + res.data[0]._id,
              })
            }       
        })
      },
      fail: (res) => {
        wx.showToast({
          title: '失败',
          icon: 'success',
          duration: 2000
        })
      },
    })
  },


  oninput: function (event) {
    this.setData({
      inputvalue2: event.detail.value
    })
  },
  onClear: function (event) {
    this.setData({
      inputvalue2: ''
    })
  },

  shuru2: function (e) {
    var that=this
    let inputvalue2 = this.data.inputvalue2;
   
    db.collection('list').where({
      DSNUM_8bit: inputvalue2
    }).get({
      success: function (res) {
        console.log(res)
        if (res.data.length == 0) {
          console.log("chabudao")
          wx.showModal({
            title: '提示',
            content: '没有该设备',           
          })
        }
        else {
          that.setData({
            list: res.data
          });
        }
      }
    })
  },

  select: function (e) {
    this.setData({
      visible1:true
    })

    // wx.showActionSheet显示长度不能超过6个
    // var that=this;
    //   wx.showActionSheet({
    //     itemList: ['全部', 'G表', 'Z表', 'LG表', 'NB表', 'LoRa表', '风机远程采集终端', '水泵远程采集终端'],
    //     success: function (res) {
          
    //       if (res.tapIndex==0) {
    //         that.setData({
    //           filtrate_url: "list_page",
    //           filtrate_count_url: "list_count"
    //         })
    //         that.onLoad()
    //       };

    //       if (res.tapIndex == 1) {            
    //         that.setData({
    //           filtrate_url: "biaotype_page",
    //           filtrate_count_url:"biaotype_count",
    //           biaoType: 1
    //         })
    //         that.onLoad()         
    //       };

    //       if (res.tapIndex == 2) {
    //         that.setData({
    //           filtrate_url: "biaotype_page",
    //           filtrate_count_url: "biaotype_count",
    //           biaoType: 2
    //         })
    //         that.onLoad()    
    //       };
   
    //       if (res.tapIndex == 3) {
    //         that.setData({
    //           filtrate_url: "biaotype_page",
    //           filtrate_count_url: "biaotype_count",
    //           biaoType: 3
    //         })
    //         that.onLoad()
    //       };

    //       if (res.tapIndex == 4) {
    //         that.setData({
    //           filtrate_url: "biaotype_page",
    //           filtrate_count_url: "biaotype_count",
    //           biaoType: 4
    //         })
    //         that.onLoad()
    //       };

    //       if (res.tapIndex == 5) {
    //         that.setData({
    //           filtrate_url: "biaotype_page",
    //           filtrate_count_url: "biaotype_count",
    //           biaoType: 5
    //         })
    //         that.onLoad()
    //       };

    //       if (res.tapIndex == 6) {
    //         that.setData({
    //           filtrate_url: "biaotype_page",
    //           filtrate_count_url: "biaotype_count",
    //           biaoType: 6
    //         })
    //         that.onLoad()
    //       };

    //       if (res.tapIndex == 7) {
    //         that.setData({
    //           filtrate_url: "biaotype_page",
    //           filtrate_count_url: "biaotype_count",
    //           biaoType: 7
    //         })
    //         that.onLoad()
    //       }                               
    //   }
    // })
  },

  handleCancel1() {
    this.setData({
      visible1: false
    });
  },

  handleClickItem1({ detail }){
    const index = detail.index
    let that = this
    switch (index) {
      case 0: 
        that.setData({
          filtrate_url: "list_page",
          filtrate_count_url: "list_count"
        })
        that.handleCancel1()
        that.onLoad();
        break;
      case 1: 
        that.setData({
          filtrate_url: "biaotype_page",
          filtrate_count_url: "biaotype_count",
          biaoType: 1
        })
        that.handleCancel1()
        that.onLoad();
        break;
      case 2: 
        that.setData({
          filtrate_url: "biaotype_page",
          filtrate_count_url: "biaotype_count",
          biaoType: 2
        })
        that.handleCancel1()
        that.onLoad();
        break;
      case 3: 
        that.setData({
          filtrate_url: "biaotype_page",
          filtrate_count_url: "biaotype_count",
          biaoType: 3
        })
        that.handleCancel1()
        that.onLoad();
        break;
      case 4: 
        that.setData({
          filtrate_url: "biaotype_page",
          filtrate_count_url: "biaotype_count",
          biaoType: 4
        })
        that.handleCancel1()
        that.onLoad();
        break;
      case 5: 
        that.setData({
          filtrate_url: "biaotype_page",
          filtrate_count_url: "biaotype_count",
          biaoType: 5
        })
        that.handleCancel1()
        that.onLoad();
        break;
      case 6: 
        that.setData({
          filtrate_url: "biaotype_page",
          filtrate_count_url: "biaotype_count",
          biaoType: 6
        })
        that.handleCancel1()
        that.onLoad();
        break;
        case 7:
        that.setData({
          filtrate_url: "biaotype_page",
          filtrate_count_url: "biaotype_count",
          biaoType: 7
        })
        that.handleCancel1()
        that.onLoad()
    }
  },

  back: function (e) {
    wx.switchTab({
      url: '../../my/my'
    });
  },
  onMap: function (e) {
    wx.navigateTo({
      url: 'Map/Map'
    });
  },

  confirm_one3: function (e) {
    let biaoid = wx.getStorageSync('biaoidll');
    this.setData({
      modalHidden3: true,
    });
    
    //移除列表中下标为index的项
    wx.cloud.callFunction({
      name: 'database-remove',
      // 传给云函数的参数
      data: {
        listType: 'list',
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

  cancel_one3: function (e) {
    this.setData({
      modalHidden3: true
    });
  },

  delete: function (e) {
    let biaoid = e.currentTarget.dataset.index;
    console.log(biaoid);
    wx.setStorageSync('biaoidll', biaoid);
    this.setData({
      modalHidden3: false
    })
  },

   detail1: function (e) {
     let biaoid = e.currentTarget.dataset.index;
     console.log('id为' + biaoid);
      wx.navigateTo({
        url: 'list-detail/list-detail?id=' + biaoid,
      }); 
  },
  
})