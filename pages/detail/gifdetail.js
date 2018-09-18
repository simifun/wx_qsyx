// pages/detail/gifdetail.js
import majax from '../../utils/myhttp.js'

Page({

  /**
   * 页面的初始数据
   */
  data: {
    id: 1,
    indexN: 0,
    items: [],
    article: {},
    nextArticle: {},
    lastArticle: {},
    firstItem: {},
    interval: 2000,
    duration: 500,
    previousMargin: 0,
    nextMargin: 0,
    current: 0,
    open: false,
    search: false,
    nice: false,
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
    this.setData({
      id: options.id
    });
    var that = this;
    var params = {
      articleId: that.data.id,
      'type': 'gif',
    }

    majax.getData(majax.ARTICLE_DETAIL, params,
      function(data) {
        that.setData({
          items: that.convert(data.data.article),
          article: data.data.article.article,
          nextArticle: data.data.article.nextArticle,
          lastArticle: data.data.article.lastArticle
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
    wx.redirectTo({
      url: '../../pages/list/gifmain'
    });
  },


  convert: function(data) {
    var items = [];
    var arrlist = data.article.itits;
    if (arrlist.length > 0) {
      arrlist.forEach(function(item) {
        item.imgId = majax.IMG_URL + item.imgId;
        item.imgName = item.imgId;
        item.className = "";
        items.push(item);
      });
    }
    items[0].className = 'mui-active';
    this.setData({
      firstItem: items[0]
    })
    return items;
  },
  gotoPage: function(event) {
    let article = event.currentTarget.dataset.item;
    if (article.articleId == 0) {
      wx.showToast({
        title: '没有啦',
        duration: 1000
      });
    } else {
      wx.redirectTo({
        url: '../../pages/detail/gifdetail?id=' + article.articleId
      });
    }
  },
  nice: function() {
    if (this.data.nice) {
      wx.showToast({
        title: '你已经赞过啦',
        duration: 1000
      });
    } else {
      let article = this.data.article;
      article.niceNum += 1;
      this.setData({
        nice: true,
        article: article
      });
      var params = {
        articleId: this.data.id,
      }
      majax.postData(majax.ADD_NICE, params,
        function(data) {});
    }
  },
  changePageNum: function (event){
    let current = event.detail.current;
    let items = this.data.items;
    for (var j = 0; j < items.length; j++) {
      items[j].className = "";
    };
    items[current].className = "mui-active";
    
    this.setData({
      indexN: current,
      items: items,
      firstItem: items[current]
    })
  },

  refreshImg: function(event) {
    let index = event.currentTarget.dataset.index;
    let items = this.data.items;
    let indexN = this.data.indexN;
    if ("add" == event.currentTarget.id) {
      index = ++indexN;
    } else if ("minus" == event.currentTarget.id) {
      index = --indexN;
    }
    if (index < 0) {
      indexN = 0;
    } else if (index > items.length - 1) {
      indexN = items.length - 1;
    } else {
      indexN = index;
      for (var j = 0; j < items.length; j++) {
        items[j].className = "";
      };
      items[indexN].className = "mui-active"
    }
    this.setData({
      indexN: indexN,
      items: items,
      current: indexN,
      firstItem: items[indexN]
    })
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
  /**
   * 长按保存图片
   */
  saveImg: function (event) {
    let src = event.currentTarget.dataset.src;
    wx.showModal({
      title: '提示',
      content: '保存图片到本地？',
      success: function (res) {
        if (res.confirm) {
          console.log('用户点击确定');
          wx.showLoading({
            title: '正在下载',
          });
          wx.getImageInfo({
            src: src,
            success: function (res) {
              wx.saveImageToPhotosAlbum({
                filePath: res.path,
                success: function () {
                  wx.hideLoading();
                  wx.showToast({
                    title: '保存成功',
                    icon: 'none',
                  })
                },
                fail: function () {
                  wx.hideLoading();
                  wx.showToast({
                    title: '保存失败',
                    icon: 'none',
                  })
                }
              })
            },
            fail: function () {
              wx.hideLoading();
              wx.showToast({
                title: '获取图片信息失败',
                icon: 'none',
              })
            }
          })
        } else if (res.cancel) {
          console.log('用户点击取消')
        }
      }
    })
  }
})