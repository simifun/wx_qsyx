//app.js
App({
  onLaunch: function() {
    // 展示本地存储能力
    var logs = wx.getStorageSync('logs') || []
    logs.unshift(Date.now())
    wx.setStorageSync('logs', logs)
    var that = this;

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
            if (res.data.openid){
              that.globalData.openid = res.data.openid
            }
          }
        })
      }
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
  },
  onHide: function(){
    console.log("小程序隐藏到后台");
    this.postFormId();
  },
  globalData: {
    openid: null,
    userInfo: null,
    searchResult: null,
    itemList: null,
    gloabalFomIds: null
  },
  postFormId: function(){
    if (this.globalData.gloabalFomIds.length){
      console.log("本次收集formId：");
      console.log(this.globalData.gloabalFomIds);
    }else{
      console.log("本次收集formId为空");
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
        that.globalData.gloabalFomIds = [];
        that.globalData.openid = null;
        console.log(data);
      },
      fail: function (res) {
        console.log("post请求错误");
      }
    })
  }
})