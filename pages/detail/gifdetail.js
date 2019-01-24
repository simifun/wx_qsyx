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
    indexN: 0,
    items: [],
    article: {},
    nextArticle: {},
    lastArticle: {},
    firstItem: {},
    imgList: [],
    interval: 2000,
    duration: 500,
    previousMargin: 0,
    nextMargin: 0,
    current: 0,
    nowItemText: "",
    open: false,
    search: false,
    nice: false,
    niceClass: "heart heart1",
    cmt: [],
    hotIndex: 0,
    hotCmt: {},
    focus: false,
    cUser: {},
    skeyword: "",
    cmtInputPlaceholder: "都让开我来开车！",
    animationData: {},
    showModalStatus: false,
    commentLoaded: false,
    actionsheet: {
      open: false,
    },
    sendInput: ""
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
      function(data) {
        that.setData({
          items: that.convert(data.data.article),
          article: data.data.article,
          nowItemText: that.data.firstItem.text,
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
  convertCmt: function(data) {
    var items = [];
    var hotIndex = 0;
    var maxNice = 0;
    var item;
    if (data.length > 0) {
      for (var i = 0; i < data.length;i++){
        item = data[i];
        item.niceClass = "heart item-heart1";
        item.publishDateStr = util.dateStr(item.publishTime);
        item.nice = false;
        items.push(item);
        if (item.niceNum > maxNice){
          maxNice = item.niceNum;
          hotIndex = i;
        }
      }
    }
    if (maxNice >= 10) {
      this.setData({
        hotIndex: hotIndex,
        hotCmt: items[hotIndex],
      })
    }
    return items;
  },
  convert: function(data) {
    var items = [];
    var arrlist = data.itits;
    var tempImgList = [];
    if (arrlist.length > 0) {
      arrlist.forEach(function(item) {
        item.imgId = majax.getImgUrl(item.imgId);
        tempImgList.push(item.imgId);
        item.imgName = item.imgId;
        item.className = "";
        items.push(item);
      });
    }
    items[0].className = 'mui-active';
    this.setData({
      firstItem: items[0],
      imgList: tempImgList
    })
    return items;
  },
  // gotoPage: function(event) {
  //   let article = event.currentTarget.dataset.bean;
  //   if (article.articleId == 0) {
  //     wx.showToast({
  //       title: '没有啦',
  //       duration: 1000
  //     });
  //   } else {
  //     wx.redirectTo({
  //       url: '../../pages/detail/gifdetail?id=' + article.articleId
  //     });
  //   }
  // },

  itemNice: function(e) {
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
      if (index == this.data.hotIndex){
        this.setData({
          hotCmt: cmt[index],
        });
      }
      // 点赞网络请求
      var params = {
        commentId: cmt[index].commentId,
      }
      majax.postData(majax.POST_NICECOMMENT, params,
        function(data) {});
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
      if (app.globalData.isNnarrow) {
        this.setData({
          nice: true,
          niceClass: "heart heart1 heartAnimation heart2",
          article: article
        });
      } else {
        this.setData({
          nice: true,
          niceClass: "heart heart1 heartAnimation",
          article: article
        });
      }
      var params = {
        articleId: this.data.id,
      }
      majax.postData(majax.ADD_NICE, params,
        function(data) {});
    }
  },
  // changePageNum: function(event) {
  //   let current = event.detail.current;
  //   let items = this.data.items;
  //   for (var j = 0; j < items.length; j++) {
  //     items[j].className = "";
  //   };
  //   items[current].className = "mui-active";

  //   this.setData({
  //     indexN: current,
  //     items: items,
  //     nowItemText: items[current].text,
  //     firstItem: items[current]
  //   })
  // },

  // refreshImg: function(event) {
  //   let index = event.currentTarget.dataset.index;
  //   let items = this.data.items;
  //   let indexN = this.data.indexN;
  //   if ("add" == event.currentTarget.id) {
  //     index = ++indexN;
  //   } else if ("minus" == event.currentTarget.id) {
  //     index = --indexN;
  //   }
  //   if (index < 0) {
  //     indexN = 0;
  //   } else if (index > items.length - 1) {
  //     indexN = items.length - 1;
  //   } else {
  //     indexN = index;
  //     for (var j = 0; j < items.length; j++) {
  //       items[j].className = "";
  //     };
  //     items[indexN].className = "mui-active"
  //   }
  //   this.setData({
  //     indexN: indexN,
  //     items: items,
  //     current: indexN,
  //     firstItem: items[indexN]
  //   })
  // },
  /**
   * 点击放大图片
   */
  openImgView: function(event) {
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
  saveImg: function(event) {
    let src = event.currentTarget.dataset.src;
    wx.showModal({
      title: '提示',
      content: '保存图片到本地？',
      success: function(res) {
        if (res.confirm) {
          wx.showLoading({
            title: '正在下载',
          });
          wx.getImageInfo({
            src: src,
            success: function(res) {
              wx.saveImageToPhotosAlbum({
                filePath: res.path,
                success: function() {
                  wx.hideLoading();
                  wx.showToast({
                    title: '保存成功',
                    icon: 'none',
                  })
                },
                fail: function() {
                  wx.hideLoading();
                  wx.showToast({
                    title: '保存失败',
                    icon: 'none',
                  })
                }
              })
            },
            fail: function() {
              wx.hideLoading();
              wx.showToast({
                title: '获取图片信息失败',
                icon: 'none',
              })
            }
          })
        } else if (res.cancel) {}
      }
    })
  },
  tap_share: function() {

  },
  tap_comment: function() {
    this.getCommentInfo(this.data.id);
  },
  postComment: function(e) {
    let comment = e.detail.value;
    if (comment) {
      this.postCommentInfo(comment);
    } else {
      wx.showToast({
        title: '请输入评论内容',
      })
    }
  },
  getCuser: function(e) {
    let cUser = e.currentTarget.dataset.cuser;
    if (cUser.userId) {
      this.setData({
        focus: true,
        cUser: cUser,
        cmtInputPlaceholder: "回复 " + cUser.nickName + "："
      })
    }
  },
  cmtBlur: function(){
    this.setData({
      focus: false,
      cUser: {},
      cmtInputPlaceholder: "都让开我来开车！"
    })
  },
  commentClose: function() {
    this.setData({
      showModalStatus: false,
    })
  },
  showModal: function() {
    // 显示遮罩层
    this.setData({
      showModalStatus: true,
    })
  },
  hideModal: function() {
    // 隐藏遮罩层
    this.setData({
      showModalStatus: false,
    })
  },
  getCommentInfo: function(articleId) {
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
      function(data) {
        wx.hideLoading();
        console.log(data)
        that.setData({
          showModalStatus: true,
          commentLoaded: true,
        })
        if (data.data.list) {
          that.setData({
            cmt: that.convertCmt(data.data.list)
          })
        }
      },
      function(res) {
        wx.hideLoading();
      });
  },
  postCommentInfo: function(comment) {
    let that = this;
    var params = {
      "article.id": this.data.id,
      "p.userid": app.globalData.userId,
      "c.userid": this.data.cUser.userId,
      "comment.dtl": comment
    };
    wx.showLoading({
      title: '请稍后...',
    });
    majax.postData(majax.POST_NEWCOMMENT, params,
      function(data) {
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
              that.setData({
                cmt: that.convertCmt(data.data.list),
                commentLoaded: true,
                sendInput: "",
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
      function(res) {
        wx.hideLoading();
      });
  },
  checkLoginUser: function(){
    if (app.globalData.userId){

    }else{

    }
  }
})