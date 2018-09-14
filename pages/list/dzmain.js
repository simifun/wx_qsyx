// pages/list/dzmain.js
import majax from '../../utils/myhttp.js'
var pn = 1;
var ps = 10;

Page({
  /**
   * 页面的初始数据
   */
  data: {
    items: [],
    open: false,
    search: false,
    skeyword: "",
    offset: {
      open: false,
    },
  },
  stopPageScroll: function () {
    return;
  },
  /**
   * 获取搜索框输入的值
   */
  skeyword: function (e) {
    this.data.skeyword = e.detail.value;
  },
  /**
   * 打开/关闭侧栏offset
   */
  tap_ch: function (e) {
    if (this.data.open) {
      this.setData({
        open: false,
        offset: {
          open: false,
        }
      });
    } else {
      this.setData({
        open: true,
        offset: {
          open: true,
        }
      });
    }
  },
  /**
   * 打开/关闭搜索框
   */
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
  /**
   * 执行搜索
   */
  search: function (e) {
    var params = {
      keywords: this.data.skeyword
    }
    majax.getData(majax.ARTICLE_SEARCH, params,
      function (data) {
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
  onLoad: function (options) {
    this.refresh();
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {

  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {
    this.refresh();

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {
    var params = {
      ps: ps,
      pn: ++pn,
      typeName: '段子'
    };
    var that = this;
    majax.getData(majax.ARTICLE_LIST, params,
      function (data) {
        that.setData({
          items: that.data.items.concat(that.convert(data.data.list))
        });
        // wx.showToast({
        //   title: '已刷新',
        //   duration: 1000
        // });
      });
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  },
  refresh: function () {
    var params = {
      ps: ps,
      pn: 1,
      typeName: '段子'
    };

    var that = this;
    majax.getData(majax.ARTICLE_LIST, params,
      function (data) {
        that.setData({
          items: that.convert(data.data.list)
        })
        // wx.showToast({
        //   title: '已刷新',
        //   duration: 1000
        // });
      });
  },
  convert: function (arrlist) {
    var items = [];
    if (arrlist == null || arrlist.length < 0) {
      wx.showToast({
        title: '没了更多了',
        duration: 1000
      });
      pn--;
      return [];
    }
    if (arrlist.length > 0) {
      arrlist.forEach(function (item) {
        item.publishTime = item.publishTime.split(" ")[0];
        if (item.articleUrl){
          item.articleUrl = majax.IMG_URL + item.articleUrl;
        }
        item.nice = false;
        items.push(item);
      });
    }
    return items;
  },
  openDetail: function (e) {
    // console.log(e);
    var item = e.currentTarget.dataset.bean
    wx.navigateTo({
      url: '../../pages/detail/dzdetail?id=' + item.articleId
    });
  },
  nice: function (event) {
    let index = event.currentTarget.dataset.index;
    let items = this.data.items;
    if (items[index].nice) {
      wx.showToast({
        title: '你已经赞过啦',
        duration: 1000
      });
    } else {
      items[index].niceNum += 1;
      items[index].nice = true;
      this.setData({
        items: items
      });
      var params = {
        articleId: items[index].articleId,
      }
      majax.postData(majax.ADD_NICE, params,
        function (data) { });
    }
  },
})