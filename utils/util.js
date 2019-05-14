import regeneratorRuntime from '../libs/regenerator-runtime/runtime.js'
import majax from 'myhttp.js'
const app = getApp()

const formatTime = date => {
  const year = date.getFullYear()
  const month = date.getMonth() + 1
  const day = date.getDate()
  const hour = date.getHours()
  const minute = date.getMinutes()
  const second = date.getSeconds()

  return [year, month, day].map(formatNumber).join('/') + ' ' + [hour, minute, second].map(formatNumber).join(':')
}

const formatNumber = n => {
  n = n.toString()
  return n[1] ? n : '0' + n
}

/**
 * 整合评论列表
 */
function getItitCmt(comments) {
  if (!comments) {
    return [];
  }
  var json = {};
  for (var i = 0; i < comments.length; i++) {
    if (json[comments[i].ititId]){
      json[comments[i].ititId].push(comments[i]);
    }else{
      json[comments[i].ititId] = [comments[i]];
    }
  }
  return json;
}

/**
 * 获取各张图片的评论条数
 */
function getCmtCount(comments) {
  if (!comments) {
    return [];
  }
  var json = {};
  for (var i = 0; i < comments.length; i++) {
    json[comments[i].ititId] = (json[comments[i].ititId] + 1) || 1;
  }
  return json;
}

/**
 * 毫秒时间戳转换友好的显示格式
 * 输出格式：21小时前
 * @param  {[type]} time [description]
 * @return {[type]}      [description]
 */
function dateStr(date) {
  //获取js 时间戳
  var time = new Date().getTime();
  //去掉 js 时间戳后三位
  time = parseInt((time - date) / 1000);
  //存储转换值 
  var s;
  if (time < 60 * 10) {
    //十分钟内
    return '刚刚';
  } else if ((time < 60 * 60) && (time >= 60 * 10)) {
    //超过十分钟少于1小时
    s = Math.floor(time / 60);
    return s + "分钟前";
  } else if ((time < 60 * 60 * 24) && (time >= 60 * 60)) {
    //超过1小时少于24小时
    s = Math.floor(time / 60 / 60);
    return s + "小时前";
  } else if ((time < 60 * 60 * 24 * 3) && (time >= 60 * 60 * 24)) {
    //超过1天少于3天内
    s = Math.floor(time / 60 / 60 / 24);
    return s + "天前";
  } else {
    //超过3天
    var date = new Date(parseInt(date));
    return date.getFullYear() + "/" + (date.getMonth() + 1) + "/" + date.getDate();
  }
}

var checkLogin = {
  checkUser: async function(userInfo) {
    if (app.globalData.userId) {
      // 正常进入->已经获取获取到且已更新 用户信息
      console.log("正常进入->已经获取获取到且已更新 用户信息");
      return 1;
    } else if (app.globalData.userInfo) {
      // 正常进入->但未获取到userId
      if (app.globalData.openid) {
        // app.js 已经获取到了openid
        var params = this.getParams(app.globalData.openid);
        console.log("正常进入->app.js 已经获取到了openid");
        return await this.getUserId(params);
      } else {
        // 需要调用同步调用getParams获取openId，去换取userid
        var params = await this.getParams();
        console.log("正常进入->需要调用同步调用getParams获取openId，去换取userid");
        return await this.getUserId(params);
      }
    } else if (userInfo) {
      // 分享进入-> 点击button传过来的userInfo，更新并换取userid，得到userId之后应该刷新页面
      app.globalData.userInfo = userInfo;
      if (app.globalData.openid) {
        // app.js 已经获取到了openid
        var params = this.getParams(app.globalData.openid);
        console.log("分享进入->app.js 已经获取到了openid");
        return await this.getUserId(params);
      } else {
        // 需要调用同步调用getParams获取openId，去换取userid
        var params = await this.getParams();
        console.log("分享进入->需要调用同步调用getParams获取openId，去换取userid");
        return await this.getUserId(params);
      }
    } else {
      // 分享进入-> 直接初始化数据
      console.log("分享进入->直接初始化数据");
      return 0;
    }
  },
  getParams: function(openid) {
    var userInfo = app.globalData.userInfo;
    var that = this;
    var params = {
      openid: openid,
      avatarUrl: userInfo.avatarUrl,
      nickName: userInfo.nickName,
      city: userInfo.city,
      country: userInfo.country,
      province: userInfo.province,
      gender: userInfo.gender,
      language: userInfo.language,
    };
    if (openid) {
      return params;
    } else {
      // 返回的是 promise 对象
      this.getOpenId().then(function(openid) {
        params.openid = openid;
        return params;
      })
    }
  },
  getUserId: function(params) {
    return new Promise(function(resolve, reject) {
      majax.getData(majax.UPDATE_USER, params,
        function(data) {
          app.globalData.userId = data.data.userId;
          majax.getData(majax.GET_NICE, {
              userId: data.data.userId
            },
            function(data) {
              var niceInfo = data.data.niceInfo;
              niceInfo.articleIds = niceInfo.articleIds ? niceInfo.articleIds:[];
              niceInfo.commentIds = niceInfo.commentIds ? niceInfo.commentIds : [];
              niceInfo.ititIds = niceInfo.ititIds ? niceInfo.ititIds : [];
              app.globalData.niceInfo = niceInfo;
              resolve("获取登录信息成功")
            },
            function(res) {
              reject("获取登录信息失败")
            });
        },
        function(res) {
          reject(true)
        });
    });
  },
  getOpenId: function() {
    return new Promise(function(resolve, reject) {
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
                app.globalData.openid = res.data.openid;
                resolve(res.data.openid)
              }
            }
          })
        }
      })
    })
  }
}

module.exports = {
  formatTime: formatTime,
  dateStr: dateStr,
  checkLogin: checkLogin,
  getCmtCount: getCmtCount,
  getItitCmt: getItitCmt
}