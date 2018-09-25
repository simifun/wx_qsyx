// pages/list/result.js
import majax from '../../utils/myhttp.js'
const app = getApp()

Page({

  /**
   * 页面的初始数据
   */
  data: {
    items: [],
    open: false,
    search: false,
    nice: false,
    skeyword: "",
    offset: {
      open: false,
    },
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
  /**
   * 打开/关闭侧栏offset
   */
  tap_ch: function(e) {
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
          wx.redirectTo({
            url: '../../pages/list/result?item=' + data.data.list
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
    var app = getApp();
    this.setData({
      items: this.convert(app.globalData.searchResult)
    });
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

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function() {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function() {

  },
  convert: function(arrlist) {
    var items = [];
    if (arrlist == null || arrlist.length < 0) {
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
    } else if (item.typeName == "视频") {
      wx.navigateTo({
        url: '../../pages/detail/videodetail?id=' + item.articleId
      });
    } else {
      wx.navigateTo({
        url: '../../pages/detail/dzdetail?id=' + item.articleId
      });
    }
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
      expire: parseInt(new Date().getTime() / 1000) + 604800 //计算7天后的过期时间时间戳
    }
    formIds.push(data); //将data添加到数组的末尾
    app.globalData.gloabalFomIds = formIds; //保存推送码并赋值给全局变量
  }
})