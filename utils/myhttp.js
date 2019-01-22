var SERVER_URL = 'https://qsong.fun';

var myhttp = {
  IMG_URL: SERVER_URL + "/img/",

  // 登录
  LOGIN_URL: SERVER_URL + '/user/login',
  // 获取组图文章列表
  ARTICLE_LIST: SERVER_URL + '/article/getArticleList',
  // 获取组图文章详情
  ARTICLE_DETAIL: SERVER_URL + '/article/getArticleDtl',
  // 获取文章搜索结果
  ARTICLE_SEARCH: SERVER_URL + '/article/getSearchList',
  // 检查刷新token
  REFRESH_TOKEN: SERVER_URL + '/user/token/check',
  // 文件操作
  SAVE_FILE: SERVER_URL + '/file/save',
  // 批量上传图片
  SAVE_MTFILE: SERVER_URL + '/file/savemf',
  // 批量上传图片
  ADD_NICE: SERVER_URL + '/article/postAddNice',
  POST_IMG_ARTICLE: SERVER_URL + '/article/postNewImgArticle',
  // 更新用户信息
  UPDATE_USER: SERVER_URL + '/wx/updateUserInfo',
  // 获取福利列表
  WELFARE_LIST: 'https://gank.io/api/data/福利/',

  getRootPath: function() {
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
  },

  /**
   * get请求
   */
  getData: function(url, dataParam, success,fail) {
    wx.showLoading({
      title: '正在加载...',
      icon: 'loading',
    });
    wx.request({
      url: url,
      data: dataParam,
      dataType: 'json', //服务器返回json格式数据
      success: function (res) {
        let data = res.data;
        res['statusCode'] === 200 ? success(data) : fail(res);
        wx.hideLoading();
      },
      fail: function (res) {
        wx.hideLoading();
        wx.showToast({
          title: '服务器错误，请稍后再试...',
          icon: 'loading',
          duration: 1000
        });
        fail(res)
      }
    })
  },

  /**
   * post请求
   */
  postData: function (url, dataParam, success, fail) {
    // wx.showLoading({
    //   title: '正在加载...',
    //   icon: 'loading',
    // });
    wx.request({
      url: url,
      data: dataParam,
      dataType: 'json', //服务器返回json格式数据
      method: 'POST', //HTTP请求类型
      header: {
        'content-type': 'application/x-www-form-urlencoded'
      },
      success: (res) => {
        let data = res.data;
        res['statusCode'] === 200 ? success(data) : fail(res);
        // wx.hideLoading();
      },
      fail: function(res) {
        // wx.hideLoading();
        // wx.showToast({
        //   title: '请求超时',
        //   icon: 'loading',
        //   duration: 1000
        // });
        console.log("post请求错误");
      }
    })
  },

  /**
   * post请求
   */
  postFile: function(url, dataParam, success, error) {
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
  },

  getQueryString: function(name) {
    var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)", "i");
    var r = window.location.search.substr(1).match(reg);
    if (r != null)
      return unescape(r[2]);
    return null;
  },

  getImgUrl: function(url){
    if (url.indexOf("http") == 0) {
      return url;
    } else {
      return this.IMG_URL + url;
    }
  }

}

export default myhttp
