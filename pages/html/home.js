// pages/html/home.js
var majax = require('../../utils/myhttp.js')
var pn = 1;
var ps = 5;

Page({

  /**
   * 页面的初始数据
   */
  data: {
    open: false,
    search: false,
    hotvideo: [],
    hotlist: [],
    uptodatelist: [],
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    this.getHotlist();
    this.getHotvideo();
    this.getupdate();
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
    pn = 1;
    // this.getHotlist();
    // this.getHotvideo();
    this.getupdate();
  },
  /**
   * 页面相关事件处理函数--监听用户上拉触底
   */
  onReachBottom: function() {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function() {
    var params = {
      ps: ps,
      pn: ++pn,
    };

    var that = this;
    majax.getData(majax.ARTICLE_LIST, params,
      function(data) {
        that.setData({
          uptodatelist: that.data.uptodatelist.concat(that.convert(data.data.list))
        })
      });
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function() {

  },
  tap_ch: function (e) {
    if (this.data.open) {
      this.setData({
        open: false
      });
    } else {
      this.setData({
        open: true
      });
    }
  },
  tap_search: function (e) {
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
  getHotvideo: function(e) {
    var params = {
      ps: 1,
      pn: 1,
      sort: 'read',
      typeName: '视频'
    };
    var that = this;
    majax.getData(majax.ARTICLE_LIST, params,
      function(data) {
        that.setData({
          hotvideo: data.data.list
        })
      });
  },

  getHotlist: function(e) {
    var params = {
      ps: ps,
      pn: 1,
      sort: 'read'
    };
    var that = this;
    majax.getData(majax.ARTICLE_LIST, params,
      function(data) {
        that.setData({
          hotlist: that.convertHotList(data.data.list)
        })
      });
  },
  getupdate: function(e) {
    var params = {
      ps: ps,
      pn: 1,
    };

    var that = this;
    majax.getData(majax.ARTICLE_LIST, params,
      function(data) {
        that.setData({
          uptodatelist: that.convert(data.data.list)
        })
        wx.showToast({
          title: '已刷新',
          duration: 1000
        });
      });
  },

  convertHotList: function(arrlist) {
    var items = [];
    var i = 1;
    if (arrlist.length > 0) {
      arrlist.forEach(function(item) {
        item.classname = "label label-" + i++;
        item.publishTime = item.publishTime.split(" ")[0];
        item.articleImg = majax.IMG_URL + item.articleImg;
        items.push(item);
      });
    }
    return items;
  },

  convert: function(arrlist) {
    var items = [];
    if (arrlist == null || arrlist.length<0) {
      wx.showToast({
        title: '没了更多了',
        duration: 1000
      });
      pn--;
      return [];
    }
    // wx.showToast({
    //   title: '加载成功',
    //   duration: 1000
    // });
    if (arrlist.length > 0) {
      arrlist.forEach(function(item) {
        item.publishTime = item.publishTime.split(" ")[0];
        item.articleImg = majax.IMG_URL + item.articleImg;
        items.push(item);
      });
    }
    return items;
  },
  openDetail: function(e) {
    // console.log(e);
    var item = e.currentTarget.dataset.bean
    if (item.typeName == "组图") {
      wx.navigateTo({
        url: '../../pages/detail/ztdetail?id=' + item.articleId
      });
    } else if (item.typeName == "动图") {
      wx.navigateTo({
        url: '../../pages/detail/gifdetail?id=' + item.articleId
      });
    } else {
      wx.navigateTo({
        url: '../../pages/detail/videodetail?id=' + item.articleId
      });
    }
  }
})