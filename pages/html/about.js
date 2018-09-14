// pages/html/about.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    wx: "xiaoqs0707",
    qq: "917437934",
    email: "xiaoqs0707@qq.com",
    webUrl: 'https://qsong.fun'
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {

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
  openWx: function() {
    var self = this;
    wx.setClipboardData({
      data: self.data.wx,
      success: function(res) {
        // wx.showModal({
        //   title: '提示',
        //   content: '已将微信号复制到粘贴板，请在微信添加好友',
        //   success: function (res) {
        //     if (res.confirm) {
        //       console.log('确定')
        //     } else if (res.cancel) {
        //       console.log('取消')
        //     }
        //   }
        // })
      }
    });
  },
  openQQ: function() {
    var self = this;
    wx.setClipboardData({
      data: self.data.qq,
      success: function(res) {
        // wx.showModal({
        //   title: '提示',
        //   content: '已将QQ号复制到粘贴板，请在QQ添加好友',
        //   success: function (res) {
        //     if (res.confirm) {
        //       console.log('确定')
        //     } else if (res.cancel) {
        //       console.log('取消')
        //     }
        //   }
        // })
      }
    });
  },
  openEmail: function() {
    var self = this;
    wx.setClipboardData({
      data: self.data.email,
      success: function(res) {}
    });
  },
  openWeb: function() {
    var self = this;
    wx.setClipboardData({
      data: self.data.webUrl,
      success: function(res) {}
    });
  },
})