var SERVER_URL = 'https://qsong.fun';
var IMG_URL = SERVER_URL + "/img/";

// 登录
var LOGIN_URL = SERVER_URL + '/user/login';
// 获取组图文章列表
var ARTICLE_LIST = SERVER_URL + '/article/getArticleList';
// 获取组图文章详情
var ARTICLE_DETAIL = SERVER_URL + '/article/getArticleDtl';
// 获取文章搜索结果
var ARTICLE_SEARCH = SERVER_URL + '/article/getSearchList';
// 检查刷新token
var REFRESH_TOKEN = SERVER_URL + '/user/token/check';
// 文件操作
var SAVE_FILE = SERVER_URL + '/file/save';
// 批量上传图片
var SAVE_MTFILE = SERVER_URL + '/file/savemf';
// 批量上传图片
var ADD_NICE = SERVER_URL + '/article/postAddNice';
var POST_IMG_ARTICLE = SERVER_URL + '/article/postNewImgArticle';
// 获取福利列表
var WELFARE_LIST = 'https://gank.io/api/data/福利/';

function getRootPath() {
  //获取当前网址  
  var curWwwPath = window.document.location.href;
  //获取主机地址之后的目录，
  var pathName = window.document.location.pathname;
  var pos = curWwwPath.indexOf(pathName);
  //获取主机地址，如： http://localhost:8081  
  var localhostPaht = curWwwPath.substring(0, pos);
  //获取带"/"的项目名，如：/chuchai 
  var projectName = pathName.substring(0, pathName.substr(1).indexOf('/') + 1);
  //判断是否存在端口号或者上下文
  if (projectName == '/h5mobpm') {
    return ("");
  } else {
    return (projectName);
  }
}

/**
 * get请求
 */
function getData(url, dataParam, success) {
  console.log("getData:" + JSON.stringify(dataParam));
  wx.showLoading({
    title: '正在加载...',
    icon: 'loading',
  });
  wx.request({
    url: url,
    data: dataParam,
    dataType: 'json', //服务器返回json格式数据
    success: (res) => {
      let data = res.data;
      res['statusCode'] === 200 ? success(data) : this.fail();
      wx.hideLoading();
    },
    fail: function(res) {
      wx.hideLoading();
      wx.showToast({
        title: '请求超时',
        icon: 'loading',
        duration: 1000
      });
    }
  })
}

/**
 * post请求
 */
var postData = function(url, dataParam, success, error) {
  console.log("postData:" + JSON.stringify(dataParam));

  mui.ajax(url, {
    data: dataParam,
    dataType: 'json', //服务器返回json格式数据
    type: 'post', //HTTP请求类型
    timeout: 30000, //超时时间设置为30秒
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8'
    },
    success: function(data) {
      console.log("data:" + JSON.stringify(data));
      success(data);
    },
    error: function(xhr, type, errorThrown) {
      console.log(xhr.status);
      console.log(xhr.responseText);
      if (xhr.status == 200) {
        success(xhr.responseText);
      } else if (xhr.status == 401) {
        //同一账号多设备登录处理
        hiddenSonicLadingItem();
        mui.toast(JSON.parse(xhr.responseText).message);
        logoutAction();
      } else {
        error(xhr, type, errorThrown);
      }
    }
  });
}

/**
 * post请求
 */
var postFile = function(url, dataParam, success, error) {
  var xhr = new XMLHttpRequest();
  xhr.open("post", url, true);
  xhr.onload = function() {
    if (this.status == 200) {
      success(this.responseText);
    } else {
      console.log("文件上传失败...");
      error(this);
    }
  };
  xhr.send(dataParam);
}

/**
 * put方式
 */
var putData = function(url, dataParam, success, error) {
  console.log("putData:" + JSON.stringify(dataParam));
  var xhr = new XMLHttpRequest();
  xhr.onreadystatechange = function() {
    switch (this.readyState) {
      case 0:
        break;
      case 1:
        break;
      case 2:
        break;
      case 3:
        break;
      case 4:
        if (this.status == 200) {
          console.log("putData请求成功...");
          console.log(this.responseText);
          success(this.responseText);

        } else if (this.status == 401) {
          console.log("putData同一账号多设备登录了");
          console.log(this.responseText);
          hiddenWaiting();
          mui.toast(JSON.parse(xhr.responseText).message);
          logoutAction();

        } else {
          console.log("putData请求失败...");
          error(this);
        }
        break;
      default:
        break;
    }
  };

  xhr.open("PUT", url, false);
  xhr.setRequestHeader("x-requested-with", "XMLHttpRequest");
  xhr.setRequestHeader("Content-Type", "application/json");
  xhr.setRequestHeader("deviceId", localStorage.getItem("deviceId"));
  xhr.setRequestHeader("jwt", localStorage.getItem("token"));
  xhr.send(JSON.stringify(dataParam));
}

/**
 * delete方式
 */
var deleteData = function(url, dataParam, success, error) {
  console.log("deleteData:" + JSON.stringify(dataParam));

  var xhr = new XMLHttpRequest();
  xhr.onreadystatechange = function() {
    switch (this.readyState) {
      case 0:
        break;
      case 1:
        break;
      case 2:
        break;
      case 3:
        break;
      case 4:
        if (this.status == 200) {
          console.log("deleteData请求成功...");
          console.log(this.responseText);
          success(this.responseText);

        } else if (this.status == 401) {
          console.log("deleteData同一账号多设备登录了");
          console.log(this.responseText);
          mui.toast(JSON.parse(xhr.responseText).message);
          logoutAction();

        } else {
          console.log("deleteData请求失败...");
          error(this);
        }
        break;
      default:
        break;
    }
  };

  xhr.open("DELETE", url, false);
  xhr.setRequestHeader("x-requested-with", "XMLHttpRequest");
  xhr.setRequestHeader("Content-Type", "application/json");
  xhr.setRequestHeader("deviceId", localStorage.getItem("deviceId"));
  xhr.setRequestHeader("jwt", localStorage.getItem("token"));
  xhr.send(JSON.stringify(dataParam));
}

// 下载
var downloadFile = function(url, dataParam, success, error) {
  console.log("downloadFile:" + JSON.stringify(dataParam));

  var xhr = new XMLHttpRequest();
  xhr.onreadystatechange = function() {
    switch (this.readyState) {
      case 0:
        break;
      case 1:
        break;
      case 2:
        break;
      case 3:
        break;
      case 4:
        if (this.status == 200) {
          console.log("请求成功start...");
          var response = this.response;
          var name = xhr.getResponseHeader("Content-disposition");
          console.log("name is:" + name);
          var filename = name.substring(20, name.length);
          //          	var blob = new Blob([xhr.response], {type: 'text/xls'});
          var theurl = window.URL.createObjectURL(xhr.response);
          console.log("url is:" + theurl);

          var link = document.createElement('a');
          link.href = theurl;
          link.download = filename;
          link.click();

          //          	var csvUrl = URL.createObjectURL(blob);
          //		        img.src = window.URL.createObjectURL(response);
          console.log(response);
          success();

        } else if (this.status == 401) {
          console.log("putData同一账号多设备登录了");
          console.log(this.responseText);
          mui.toast(JSON.parse(xhr.responseText).message);
          logoutAction();

        } else {
          console.log("请求失败start...");
          error(this);
        }
        break;
      default:
        break;
    }
  };

  xhr.open("GET", url, false);
  xhr.responseType = "blob";
  xhr.setRequestHeader("x-requested-with", "XMLHttpRequest");
  xhr.setRequestHeader("Content-Type", "application/json");
  xhr.setRequestHeader("deviceId", localStorage.getItem("deviceId"));
  xhr.setRequestHeader("jwt", localStorage.getItem("token"));
  xhr.send(JSON.stringify(dataParam));
}

/**
 * 目前该请求只用于检查更新，故不对其拼接deciveid
 */
var postDataWithoutOriUrlAndHeader = function(url, dataParam, success, error) {
  console.log("postDataWithoutOriUrlAndHeader:" + JSON.stringify(dataParam));

  mui.ajax(url, {
    data: dataParam,
    dataType: 'json', //服务器返回json格式数据
    type: 'post', //HTTP请求类型
    timeout: 30000, //超时时间设置为30秒
    success: function(data) {
      console.log("data:" + JSON.stringify(data));
      success(data);
    },
    error: function(xhr, type, errorThrown) {
      console.log(xhr.status);
      console.log(xhr.responseText);
      error(xhr, type, errorThrown);
    }
  });
}

function myErrorAlert(type) {
  if (type == "timeout") {
    mui.alert('网络请求超时，请检查网络!');
  } else if (type == "error") {
    mui.alert('网络请求失败!');
  } else if (type == "abort") {
    mui.alert('异常终止!');
  } else if (type == "parsererror") {
    mui.alert('解析错误!');
  } else if (type == "null") {
    mui.alert('空');
  } else {
    mui.alert('操作失败!');
  }
}

function getQueryString(name) {
  var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)", "i");
  var r = window.location.search.substr(1).match(reg);
  if (r != null)
    return unescape(r[2]);
  return null;
}

module.exports = {
  getData: getData,
  LOGIN_URL: LOGIN_URL,
  ARTICLE_DETAIL: ARTICLE_DETAIL,
  ARTICLE_LIST: ARTICLE_LIST,
  ARTICLE_SEARCH: ARTICLE_SEARCH,
  REFRESH_TOKEN: REFRESH_TOKEN,
  SAVE_FILE: SAVE_FILE,
  SAVE_MTFILE: SAVE_MTFILE,
  ADD_NICE: ADD_NICE,
  POST_IMG_ARTICLE: POST_IMG_ARTICLE,
  ADD_NICE: ADD_NICE,
  WELFARE_LIST: WELFARE_LIST,
  IMG_URL: IMG_URL,
}
