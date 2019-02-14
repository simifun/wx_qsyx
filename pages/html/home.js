// pages/html/home.js
// var majax = require('../../utils/myhttp.js')
import majax from '../../utils/myhttp.js'
const app = getApp()
const db = wx.cloud.database()
var pn = 1;
var ps = 3;

Page({
  /**
   * 页面的初始数据
   */
  data: {
    hotlist: [],
    uptodatelist: [],
    giflist: [],
    dzlist: [],
    ztlist: [],
    videolist: [],
    hidden: true,
    nice: false,
    open: false,
    search: false,
    skeyword: "",
    showme: false,
    loading: true,
    offset: {
      open: false,
      showme: false,
    },
    userInfo: {},
    hasUserInfo: false,
    canIUse: wx.canIUse('button.open-type.getUserInfo')
  },
  //事件处理函数
  bindViewTap: function() {
    wx.navigateTo({
      url: '../logs/logs'
    })
  },
  stopPageScroll: function() {
    return;
  },
  /**
   * 获取搜索框输入的值
   */
  skeyword: function(e) {
    this.data.skeyword = e.detail.value;
  },
  tap_tomain: function(e){
    let type = e.currentTarget.dataset.type;
    wx.navigateTo({
      url: '../../pages/list/' + type + 'main'
    });
  },
  // 催更
  tap_update: function(){
    wx.showToast({
      title: '已通知小编，努力更新ing',
      icon:'none',
      duration: 2000
    })
  },
  /**
   * 打开/关闭侧栏offset
   */
  tap_ch: function(e) {
    if (this.data.open) {
      this.setData({
        open: false,
        offset: {
          open: false,
          showme: app.globalData.showme
        }
      });
    } else {
      this.setData({
        open: true,
        offset: {
          open: true,
          showme: app.globalData.showme
        }
      });
    }
  },
  /**
   * 打开/关闭搜索框
   */
  tap_search: function(e) {
    if (this.data.search) {
      this.setData({
        search: false
      });
    } else {
      this.setData({
        search: true
      });
    }
  },
  /**
   * 执行搜索
   */
  search: function(e) {
    var params = {
      keywords: this.data.skeyword
    }
    majax.getData(majax.ARTICLE_SEARCH, params,
      function(data) {
        if (data.success === true) {
          var app = getApp();
          app.globalData.searchResult = data.data.list;
          wx.redirectTo({
            url: '../../pages/list/result'
          });
        } else {
          wx.showToast({
            title: '查无结果',
            duration: 1000
          });
        }
      });
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    wx.showLoading({
      title: '加载中...',
    })
    var that = this;
    Promise
      .all([this.getHotlist(), this.getupdate()])
      .then(function(results) {
        that.setData({
          showme: app.globalData.showme
        })
        setTimeout(function(){
          wx.hideLoading();
          that.setData({
            loading: false
          })
        },200)
      });
    let articleId = options.id;
    let articleType = options.type;
    if (articleId && articleType) {
      if (articleType == "zt") {
        wx.navigateTo({
          url: '../../pages/detail/ztdetail?id=' + articleId
        });
      } else if (item.typeName == "gif") {
        wx.navigateTo({
          url: '../../pages/detail/gifdetail?id=' + articleId
        });
      } else if (item.typeName == "video") {
        wx.navigateTo({
          url: '../../pages/detail/videodetail?id=' + articleId
        });
      } else {
        wx.navigateTo({
          url: '../../pages/detail/dzdetail?id=' + articleId
        });
      }
    }
  },
  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function() {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function() {
    this.setData({
      hidden: false
    })
  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function() {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function() {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function() {

  },
  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function() {
    // var params = {
    //   ps: ps,
    //   pn: ++pn,
    // };

    // var that = this;
    // majax.getData(majax.ARTICLE_LIST, params,
    //   function(data) {
    //     that.setData({
    //       uptodatelist: that.data.uptodatelist.concat(that.convert(data.data.list))
    //     })
    //   });
  },
  /**
   * 检查更新用户信息到用户表
   */
  onGotUserInfo: function(e) {
    var userInfo = e.detail.userInfo;
    app.globalData.userInfo = app.globalData.userInfo ? app.globalData.userInfo : userInfo;
    if (app.globalData.userId == 0 && app.globalData.openid) {
      var params = {
        openid: app.globalData.openid,
        avatarUrl: userInfo.avatarUrl,
        nickName: userInfo.nickName,
        city: userInfo.city,
        country: userInfo.country,
        province: userInfo.province,
        gender: userInfo.gender,
        language: userInfo.language,
      };
      var that = this;
      majax.getData(majax.UPDATE_USER, params,
        function(data) {
          app.globalData.userId = data.data.userId;
          majax.getData(majax.GET_NICE, {
              userId: data.data.userId
            },
            function(data) {
              var niceInfo = data.data.niceInfo;
              niceInfo.articleIds = niceInfo.articleIds ? niceInfo.articleIds : [];
              niceInfo.commentIds = niceInfo.commentIds ? niceInfo.commentIds : [];
              niceInfo.ititIds = niceInfo.ititIds ? niceInfo.ititIds : [];
              app.globalData.niceInfo = niceInfo;
            },
            function(res) {});
        },
        function(res) {});
    }
  },
  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function() {

  },
  /**
   * 收集推送用的formId
   */
  formSubmit: function(e) {
    let formId = e.detail.formId;
    this.dealFormIds(formId); //处理保存推送码
    let type = e.currentTarget.dataset.type;
    //根据type的值来执行相应的点击事件
    if ("openDetail" == type) {
      this.openDetail(e);
    }
  },
  dealFormIds: function(formId) {
    let formIds = app.globalData.gloabalFomIds; //获取全局数据中的推送码gloabalFomIds数组
    if (!formIds) formIds = [];
    let data = {
      openId: app.globalData.openid,
      formId: formId,
      //计算7天后的过期时间时间戳
      expire: parseInt(new Date().getTime() / 1000) + 604800
    }
    formIds.push(data); //将data添加到数组的末尾
    app.globalData.gloabalFomIds = formIds; //保存推送码并赋值给全局变量
  },
  
  getHotlist: function(e) {
    var params = {
      ps: 9,
      pn: 1,
      sort: 'read'
    };
    var that = this;
    return new Promise(function(resolve, reject) {
      majax.getData(majax.ARTICLE_LIST, params,
        function(data) {
          that.setData({
            hidden: false,
            hotlist: that.convert(data.data.list)
          });
          resolve('2');
        });
    })
  },
  getupdate: function(e) {
    var params = {
      ps: ps,
    };
    var that = this;
    return new Promise(function(resolve, reject) {
      majax.getData(majax.GET_HOME, params,
        function(data) {
          that.setData({
            giflist: that.convert(data.data.list.gif),
            dzlist: that.convert(data.data.list.dz),
            ztlist: that.convert(data.data.list.zt),
            videolist: that.convert(data.data.list.video),
          });
          resolve('1');
        });
    })
  },
  convert: function(arrlist) {
    var items = [];
    if (arrlist == null || arrlist.length < 0) {
      wx.showToast({
        title: '没了更多了',
        duration: 1500
      });
      pn--;
      return [];
    }

    if (arrlist.length > 0) {
      arrlist.forEach(function(item) {
        item.publishTime = item.publishTime.split(" ")[0];
        item.articleImg = majax.getImgUrl(item.articleImg);
        items.push(item);
      });
    }
    return items;
  },
  openDetail: function(e) {
    var item = e.currentTarget.dataset.bean
    if (item.typeName == "组图") {
      wx.navigateTo({
        url: '../../pages/detail/ztdetail?id=' + item.articleId
      });
    } else if (item.typeName == "动图") {
      wx.navigateTo({
        url: '../../pages/detail/gifdetail?id=' + item.articleId
      });
    } else if (item.typeName == "视频") {
      wx.navigateTo({
        url: '../../pages/detail/videodetail?id=' + item.articleId
      });
    } else {
      wx.navigateTo({
        url: '../../pages/detail/dzdetail?id=' + item.articleId
      });
    }
  }
})