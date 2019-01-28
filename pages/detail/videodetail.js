// pages/detail/videodetail.js
import majax from '../../utils/myhttp.js'
import util from '../../utils/util.js'
const app = getApp()

Page({
  /**
   * 页面的初始数据
   */
  data: {
    id: 1,
    items: [],
    article: {},
    firstItem: {},
    imgList: [],
    interval: 2000,
    duration: 500,
    previousMargin: 0,
    nextMargin: 0,
    current: 0,
    indexN: 0,
    skeyword: "",
    actionsheet: {
      open: false,
    },
    bottombar: {
      showModalStatus: false,
      cUser: {},
      article: {},
      nice: false,
      niceClass: "heart heart1",
      cmt: [],
      hotIndex: 0,
      hotCmt: null,
      focus: false,
      cmtInputPlaceholder: "都让开我来开车！",
      commentLoaded: false,
      nowItemText: "",
      sendInput: ""
    },
  },
  stopPageScroll: function () {
    return;
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.setData({
      id: options.id
    });
    if (app.globalData.isNnarrow) {
      let bottombar = this.data.bottombar;
      bottombar.niceClass = "heart heart1 heart2";
      this.setData({
        bottombar: bottombar
      });
    }
    var that = this;
    var params = {
      articleId: that.data.id,
      'type': 'video',
    }
    majax.getData(majax.ARTICLE_DTL, params,
      function (data) {
        let bottombar = that.data.bottombar;
        bottombar.article = data.data.article;
        bottombar.nowItemText = that.data.firstItem.text;
        that.setData({
          items: that.convert(data.data.article),
          article: data.data.article,
          bottombar: bottombar
        })
      });
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

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  },
  
  convertCmt: function (data) {
    var items = [];
    var hotIndex = 0;
    var maxNice = 0;
    var item;
    var niceInfo = app.globalData.niceInfo;
    if (data.length > 0) {
      for (var i = 0; i < data.length; i++) {
        item = data[i];
        item.niceClass = "heart item-heart1";
        item.publishDateStr = util.dateStr(item.publishTime);
        if (niceInfo && niceInfo.commentIds) {
          item.nice = niceInfo.commentIds.indexOf(item.commentId) == -1 ? false : true;
          item.niceClass = item.nice ? "heart item-heart-niced" : "heart item-heart1";
        }
        items.push(item);
        if (item.niceNum > maxNice) {
          maxNice = item.niceNum;
          hotIndex = i;
        }
      }
    }
    if (maxNice >= 5) {
      let bottombar = this.data.bottombar;
      bottombar.hotIndex = hotIndex;
      bottombar.hotCmt = items[hotIndex];
      this.setData({
        bottombar: bottombar
      })
    }
    return items;
  },
  convert: function (data) {
    var items = [];
    var arrlist = data.itits;
    var tempImgList = [];
    var niceInfo = app.globalData.niceInfo;
    console.log(niceInfo)
    if (niceInfo && niceInfo.articleIds) {
      var nice = niceInfo.articleIds.indexOf(data.articleId) == -1 ? false : true;
      if (nice) {
        let bottombar = this.data.bottombar;
        bottombar.nice = nice;
        bottombar.niceClass = "heart heart-niced";
        this.setData({
          bottombar: bottombar
        })
      }
    }
    if (arrlist.length > 0) {
      arrlist.forEach(function (item) {
        item.imgId = majax.getImgUrl(item.imgId);
        tempImgList.push(item.imgId);
        item.imgName = item.imgId;
        item.className = "";
        items.push(item);
      });
    }
    this.setData({
      firstItem: items[0],
      imgList: tempImgList
    })
    return items;
  },
  changePageNum: function (event) {
    let current = event.detail.current;
    let items = this.data.items;
    this.setData({
      indexN: current,
      items: items,
      firstItem: items[current]
    })
  },
  itemNice: function (e) {
    let cmt = this.data.bottombar.cmt;
    let index = e.currentTarget.dataset.index;
    if (cmt[index].nice) {
      wx.showToast({
        title: '你已经赞过啦',
        duration: 1000
      });
    } else {
      cmt[index].niceClass = "heart item-heart1 heartAnimation";
      cmt[index].nice = true;
      cmt[index].niceNum += 1;
      let bottombar = this.data.bottombar;
      bottombar.cmt = cmt;
      this.setData({
        bottombar: bottombar
      });
      if (index == this.data.bottombar.hotIndex && this.data.bottombar.hotCmt) {
        this.setData({
          bottombar: {
            hotCmt: cmt[index],
          }
        });
      }
      // 点赞网络请求
      var params = {
        commentId: cmt[index].commentId,
        userId: app.globalData.userId,
      }
      majax.postData(majax.POST_NICECOMMENT, params,
        function (data) {
          app.globalData.niceInfo.commentIds.push(params.commentId);
        });
    }
  },
  nice: function () {
    let bottombar = this.data.bottombar;
    console.log(bottombar)
    console.log(bottombar.nice)
    console.log(bottombar.article)

    if (bottombar.nice) {
      wx.showToast({
        title: '你已经赞过啦',
        duration: 1000
      });
    } else {
      let article = this.data.article;
      article.niceNum += 1;
      if (app.globalData.isNnarrow) {
        bottombar.nice = true;
        bottombar.niceClass = "heart heart1 heartAnimation heart2";
        bottombar.article = article;
        this.setData({
          bottombar: bottombar,
          article: article
        });
      } else {
        bottombar.nice = true;
        bottombar.niceClass = "heart heart1 heartAnimation";
        bottombar.article = article;
        this.setData({
          bottombar: bottombar,
          article: article
        });
      }
      var params = {
        articleId: this.data.id,
        userId: app.globalData.userId,
      }
      majax.postData(majax.ADD_NICE, params,
        function (data) {
          app.globalData.niceInfo.articleIds.push(article.articleId);
        });
    }
  },
  /**
   * 点击放大图片
   */
  openImgView: function (event) {
    let src = event.currentTarget.dataset.src;
    let that = this;
    wx.previewImage({
      urls: that.data.imgList,
      current: src
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
        } else if (res.cancel) { }
      }
    })
  },
  tap_share: function () {

  },
  tap_comment: function () {
    this.getCommentInfo(this.data.id);
  },
  postComment: function (e) {
    let comment = e.detail.value;
    if (comment) {
      this.postCommentInfo(comment);
    } else {
      wx.showToast({
        title: '请输入评论内容',
      })
    }
  },
  getCuser: function (e) {
    let cUser = e.currentTarget.dataset.cuser;
    if (cUser.userId) {
      let bottombar = this.data.bottombar;
      bottombar.focus = true;
      bottombar.cUser = cUser;
      bottombar.cmtInputPlaceholder = "回复 " + cUser.nickName + "：";
      this.setData({
        bottombar: bottombar,
      })
    }
  },
  cmtBlur: function () {
    let bottombar = this.data.bottombar;
    bottombar.focus = false;
    bottombar.cUser = {};
    bottombar.cmtInputPlaceholder = "都让开我来开车！";
    this.setData({
      bottombar: bottombar
    })
  },
  commentClose: function () {
    let bottombar = this.data.bottombar;
    bottombar.showModalStatus = false;
    this.setData({
      bottombar: bottombar
    })
  },
  showModal: function () {
    // 显示遮罩层
    let bottombar = this.data.bottombar;
    bottombar.showModalStatus = true;
    this.setData({
      bottombar: bottombar
    })
  },
  hideModal: function () {
    // 隐藏遮罩层
    let bottombar = this.data.bottombar;
    bottombar.showModalStatus = false;
    this.setData({
      bottombar: bottombar
    })
  },
  getCommentInfo: function (articleId) {
    if (this.data.bottombar.commentLoaded) {
      let bottombar = this.data.bottombar;
      bottombar.showModalStatus = true;
      this.setData({
        bottombar: bottombar
      })
      return;
    }
    wx.showLoading({
      title: '正在加载',
    });
    let that = this;
    var params = {
      articleId: articleId
    };
    majax.getData(majax.GET_COMMENTLIST, params,
      function (data) {
        wx.hideLoading();
        console.log(data)
        let bottombar = that.data.bottombar;
        bottombar.showModalStatus = true;
        bottombar.commentLoaded = true;
        that.setData({
          bottombar: bottombar
        })
        if (data.data.list) {
          let bottombar = that.data.bottombar;
          bottombar.cmt = that.convertCmt(data.data.list);
          that.setData({
            bottombar: bottombar
          })
        }
      },
      function (res) {
        wx.hideLoading();
      });
  },
  postCommentInfo: function (comment) {
    let that = this;
    var params = {
      "article.id": this.data.id,
      "p.userid": app.globalData.userId,
      "c.userid": this.data.bottombar.cUser.userId,
      "comment.dtl": comment
    };
    wx.showLoading({
      title: '请稍后...',
    });
    majax.postData(majax.POST_NEWCOMMENT, params,
      function (data) {
        var params = {
          articleId: that.data.id
        };
        majax.getData(majax.GET_COMMENTLIST, params,
          function (data) {
            wx.hideLoading();
            wx.showToast({
              title: '评论成功！',
            });
            if (data.data.list) {
              let bottombar = that.data.bottombar;
              let article = that.data.article;
              article.cm_count += 1;
              bottombar.cmt = that.convertCmt(data.data.list);
              bottombar.commentLoaded = true;
              bottombar.sendInput = "";
              bottombar.article = article;
              that.setData({
                article: article,
                bottombar: bottombar
              })
            }
          },
          function (res) {
            wx.hideLoading();
          });
        let bottombar = that.data.bottombar;
        bottombar.commentLoaded = false;
        that.setData({
          bottombar: bottombar
        })
      },
      function (res) {
        wx.hideLoading();
      });
  },
  checkLoginUser: function () {
    if (app.globalData.userId) {

    } else {

    }
  }
})