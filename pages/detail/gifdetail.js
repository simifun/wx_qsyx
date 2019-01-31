// pages/detail/gifdetail.js
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
    nowItemText: "",
    open: false,
    search: false,
    nice: false,
    loading: true,
    niceClass: "heart heart1",
    cmt: [],
    hotIndex: 0,
    hotCmt: null,
    focus: false,
    cUser: {},
    skeyword: "",
    cmtInputPlaceholder: "都让开我来开车！",
    animationData: {},
    showModalStatus: false,
    commentLoaded: false,
    actionsheet: {
      actionSheetHidden: false,
    },
    homebtn: false,
    login: {
      showModal: false,
    },
    sendInput: ""
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    wx.showLoading({
      title: '加载中...',
    })
    this.setData({
      id: options.id,
      homebtn: app.globalData.share
    });
    if (app.globalData.isNnarrow) {
      this.setData({
        niceClass: "heart heart1 heart2",
      });
    }
    var that = this;
    var params = {
      articleId: that.data.id,
      'type': 'gif',
    }
    majax.getData(majax.ARTICLE_DTL, params,
      function (data) {
        let check = util.checkLogin.checkUser();
        if (!data) {
          wx.showToast({
            title: '获取数据失败，请重试',
            icon: 'none',
            duration: 2000,
          })
        } else {
          check.then(function (res) {
            if (res == 0) {
              that.setData({
                login: { showModal: true }
              });
            }
            that.setData({
              items: that.convert(data.data.article),
              article: data.data.article,
              nowItemText: that.data.firstItem.text,
            });
            setTimeout(function () {
              wx.hideLoading();
              that.setData({
                loading: false
              });
            }, 150)
          });
        }
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
  onShareAppMessage: function (res) {
    return {
      title: this.data.article.articleTitle,
      imageUrl: majax.getImgUrl(this.data.article.articleImg),
      path: '/pages/detail/gifdetail?id=' + this.data.id
    }
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
      this.setData({
        hotIndex: hotIndex,
        hotCmt: items[hotIndex],
      })
    }
    return items;
  },
  convert: function (data) {
    var items = [];
    var arrlist = data.itits;
    var tempImgList = [];
    var niceInfo = app.globalData.niceInfo;
    if (niceInfo && niceInfo.articleIds) {
      var nice = niceInfo.articleIds.indexOf(data.articleId) == -1 ? false : true;
      if (nice) {
        this.setData({
          nice: nice,
          niceClass: "heart heart-niced",
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
    let cmt = this.data.cmt;
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
      this.setData({
        cmt: cmt,
      });
      if (index == this.data.hotIndex && this.data.hotCmt) {
        this.setData({
          hotCmt: cmt[index],
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
  tap_home: function () {
    app.globalData.share = false;
    this.setData({
      homebtn: false
    });
    wx.redirectTo({
      url: '../../pages/html/home'
    });
  },
  tap_nice: function (e) {
    let userInfo = e.detail.userInfo;
    if (!userInfo) {
      wx.showToast({
        title: '未登录无法点赞',
        duration: 2000,
        icon: 'none'
      });
      return;
    };
    if (this.data.nice) {
      wx.showToast({
        title: '你已经赞过啦',
        duration: 1000
      });
    } else {
      let that = this;
      let article = this.data.article;
      article.niceNum += 1;
      let check = util.checkLogin.checkUser(userInfo);
      check.then(function (res) {
        that.setData({
          items: that.convert(article),
        });
        if (that.data.nice) {
          wx.showToast({
            title: '你已经赞过啦',
            duration: 1000
          });
          return;
        }
        if (app.globalData.isNnarrow) {
          that.setData({
            nice: true,
            niceClass: "heart heart1 heartAnimation heart2",
            article: article
          });
        } else {
          that.setData({
            nice: true,
            niceClass: "heart heart1 heartAnimation",
            article: article
          });
        }
        var params = {
          articleId: that.data.id,
          userId: app.globalData.userId,
        }
        majax.postData(majax.ADD_NICE, params,
          function (data) {
            app.globalData.niceInfo.articleIds.push(article.articleId);
          });
      })
    }
  },
  /**
   * 点击放大图片
   */
  openImgView: function (event) {
    let src = event.currentTarget.dataset.src;
    console.log(src)
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
    let indexN = this.data.indexN;
    let src = this.data.items[indexN].imgId;
    if (src.indexOf("n.sinaimg.cn") > -1) {
      src = src.replace(/http/g, "https")
    }
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
  ascancel: function () {
    this.setData({
      actionsheet: {
        actionSheetHidden: !this.data.actionsheet.actionSheetHidden,
      }
    });
  },
  tap_share: function (e) {
    let userInfo = e.detail.userInfo;
    if (!userInfo) {
      wx.showToast({
        title: '未登录无法转发',
        duration: 2000,
        icon: 'none'
      });
      return;
    }
    let check = util.checkLogin.checkUser(userInfo);
    var that = this;
    check.then(function (res) {
      that.setData({
        items: that.convert(that.data.article),
        actionsheet: {
          actionSheetHidden: !that.data.actionsheet.actionSheetHidden,
        }
      });
    })
  },
  tap_comment: function (e) {
    let userInfo = e.detail.userInfo;
    if (!userInfo) {
      wx.showToast({
        title: '未登录无法评论',
        duration: 2000,
        icon: 'none'
      });
      return;
    }
    let check = util.checkLogin.checkUser(userInfo);
    let that = this;
    check.then(function (res) {
      that.getCommentInfo(that.data.id);
    });
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
      this.setData({
        focus: true,
        cUser: cUser,
        cmtInputPlaceholder: "回复 " + cUser.nickName + "："
      })
    }
  },
  cmtBlur: function () {
    this.setData({
      focus: false,
      cUser: {},
      cmtInputPlaceholder: "都让开我来开车！"
    })
  },
  commentClose: function () {
    this.setData({
      showModalStatus: false,
    })
  },
  showModal: function () {
    // 显示遮罩层
    this.setData({
      showModalStatus: true,
    })
  },
  hideModal: function () {
    // 隐藏遮罩层
    this.setData({
      showModalStatus: false,
    })
  },
  getCommentInfo: function (articleId) {
    if (this.data.commentLoaded) {
      this.setData({
        showModalStatus: true,
      });
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
        that.setData({
          showModalStatus: true,
          commentLoaded: true,
        })
        if (data.data.list) {
          that.setData({
            items: that.convert(that.data.article),
            cmt: that.convertCmt(data.data.list)
          })
        }
      },
      function (res) {
        wx.hideLoading();
      });
  },
  postCommentInfo: function (comment) {
    let check = util.checkLogin.checkUser();
    let that = this;
    check.then(function (res) {
      if (res == 0) {
        that.setData({
          login: {
            showModal: true
          }
        });
        return;
      }
      var params = {
        "article.id": that.data.id,
        "p.userid": app.globalData.userId,
        "c.userid": that.data.cUser.userId,
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
                let article = that.data.article;
                article.cm_count += 1;
                that.setData({
                  cmt: that.convertCmt(data.data.list),
                  commentLoaded: true,
                  sendInput: "",
                  article: article
                })
              }
            },
            function (res) {
              wx.hideLoading();
            });
          that.setData({
            commentLoaded: false,
          })
        },
        function (res) {
          wx.hideLoading();
        });
    });
  },
  hideLoginModal: function () {
    this.setData({
      login: {
        showModal: false
      }
    });
  },
  /**
   * 对话框取消按钮点击事件
   */
  onCancel: function () {
    this.hideLoginModal();
  },
  /**
   * 对话框确认按钮点击事件
   */
  onConfirm: function (e) {
    this.hideLoginModal();
    let userInfo = e.detail.userInfo;
    if (!userInfo) {
      wx.showToast({
        title: '你拒绝了登录',
        duration: 2000,
        icon: 'none'
      });
      return;
    }
    let check = util.checkLogin.checkUser(userInfo);
    let that = this;
    check.then(function (res) {
      that.setData({
        items: that.convert(that.data.article),
      });
    })
  }
})