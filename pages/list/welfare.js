// pages/list/welfare.js
import majax from '../../utils/myhttp.js'
const app = getApp()
var ps = 5;
var pn = 1;

Page({
  /**
   * 页面的初始数据
   */
  data: {
    note: [],
    nice: false,
    open: false,
    search: false,
    skeyword: "",
    offset: {
      open: false,
      showme: false,
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
  tap_ch: function (e) {
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
  onLoad: function() {
    var that = this;
    var params = {
      ps: ps,
      pn: 1,
    };
    majax.getData(majax.WELFARE_LIST + params.ps + "/" + params.pn, "",
      function(data) {
        that.setData({
          note: data.results
        })
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
    var that = this;
    var params = {
      ps: ps,
      pn: ++pn,
    };
    majax.getData(majax.WELFARE_LIST + params.ps + "/" + params.pn, "", 
      function(data) {
        that.setData({
          note: that.data.note.concat(data.results)
        })
      });
  },
  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function() {

  },
  /**
 * 点击放大图片
 */
  openImgView: function (event) {
    let src = event.currentTarget.dataset.src;
    wx.previewImage({
      urls: [src],
    })
  },
})