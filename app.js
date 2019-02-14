//app.js
App({
  onLaunch: function (options) {
    // 展示本地存储能力
    var logs = wx.getStorageSync('logs') || []
    logs.unshift(Date.now())
    wx.setStorageSync('logs', logs)
    var that = this;
    //云开发初始化
    wx.cloud.init({
      env: 'qsong-45ced0',
      traceUser: true
    })
    // 获取用户信息
    wx.getSetting({
      success: res => {
        if (res.authSetting['scope.userInfo']) {
          // 已经授权，可以直接调用 getUserInfo 获取头像昵称，不会弹框
          wx.getUserInfo({
            success: res => {
              // 可以将 res 发送给后台解码出 unionId
              this.globalData.userInfo = res.userInfo
              // 由于 getUserInfo 是网络请求，可能会在 Page.onLoad 之后才返回
              // 所以此处加入 callback 以防止这种情况
              if (this.userInfoReadyCallback) {
                this.userInfoReadyCallback(res)
              }
            }
          })
        }
      }
    })
    // 登录
    wx.login({
      success: res => {
        // 发送 res.code 到后台换取 openId, sessionKey, unionId
        wx.request({
          url: 'https://qsong.fun/wx/wxlogin',
          data: {
            code: res.code,
          },
          success: res => {
            if (res.data.openid) {
              that.globalData.openid = res.data.openid
              that.globalData.isNnarrow = res.data.showme;
            }
          }
        })
      }
    })
    // 判断是否由分享进入小程序
    if (options.scene == 1007 || options.scene == 1008) {
      this.globalData.share = true
    } else {
      this.globalData.share = false
    };
    // 获取手机系统信息
    wx.getSystemInfo({
      success: res => {
        if (res.screenHeight >= res.screenWidth * 2) {
          that.globalData.isNnarrow = true;
        }
      }
    })
  },
  onHide: function () {
    this.postFormId();
  },
  globalData: {
    openid: null,
    userId: 0,
    userInfo: null,
    searchResult: null,
    itemList: null,
    gloabalFomIds: null,
    isNnarrow: false,
    niceInfo: null,
    share: false,  // 分享默认为false
    showme: false,
  },
  postFormId: function () {
    if (!this.globalData.gloabalFomIds) {
      return;
    }
    var params = {
      formItem: JSON.stringify(this.globalData.gloabalFomIds)
    };
    var that = this;
    wx.request({
      url: "https://qsong.fun/wx/postFormId",
      data: params,
      dataType: 'json', //服务器返回json格式数据
      success: (res) => {
        let data = res.data;
        that.globalData.gloabalFomIds = null;
      },
      fail: function (res) {
        console.log("post请求错误");
      }
    })
  }
})