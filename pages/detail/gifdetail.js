// pages/detail/gifdetail.js
var majax = require('../../utils/myhttp.js')
Page({

  /**
   * 页面的初始数据
   */
  data: {
    id: 1,
    items: [],
    article: {},
    nextArticle: {},
    lastArticle: {},
    firstItem: {},
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    this.setData({
      id: options.id
    });
    var that = this;
    var params = {
      articleId: that.data.id,
      typeName: '动图',
    }

    majax.getData(majax.ARTICLE_DETAIL, params,
        function (data) {
          that.setData({
            hotvideo: data.data.list
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

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function() {

  },
  gotoMain: function() {
    wx.navigateTo({
      url: '../../pages/list/gifmain'
    });
  },


  convert: function(data) {
    var items = [];
    var arrlist = data.article.itits;
    if (arrlist.length > 0) {
      arrlist.forEach(function(item) {
        item.imgId = IMG_URL + item.imgId;
        item.imgName = item.imgId;
        item.className = "";
        items.push(item);
      });
    }
    items[0].className = 'mui-active';
    article.firstItem = items[0];
    article.article = data.article;
    lnArticle.nextArticle = data.nextArticle;
    lnArticle.lastArticle = data.lastArticle;
    return items;
  }

})