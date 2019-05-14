var SERVER_URL = 'https://qsong.fun';

var myhttp = {
  IMG_URL: SERVER_URL + "/img/",

  // 登录
  LOGIN_URL: SERVER_URL + '/user/login',
  // 获取主页列表信息
  GET_HOME: SERVER_URL + '/article/getWxHomeList',
  // 获取组图文章列表
  ARTICLE_LIST: SERVER_URL + '/article/getArticleList',
  // 获取组图文章详情
  ARTICLE_DETAIL: SERVER_URL + '/article/getArticleDtl',
  // 获取文章详情（包括评论条数）
  ARTICLE_DTL: SERVER_URL + '/article/getArticle',
  // 获取文章搜索结果
  ARTICLE_SEARCH: SERVER_URL + '/article/getSearchList',
  // 检查刷新token
  REFRESH_TOKEN: SERVER_URL + '/user/token/check',
  // 文件操作
  SAVE_FILE: SERVER_URL + '/file/save',
  // 批量上传图片
  SAVE_MTFILE: SERVER_URL + '/file/savemf',
  // 点赞文章
  ADD_NICE: SERVER_URL + '/article/postAddNice',
  // 分享文章
  ADD_ARTICLE_SHARE: SERVER_URL + '/article/addArticleShare',
  // 点赞图片
  ADD_ITIT_NICE: SERVER_URL + '/article/addItitNice',
  // 分享图片
  ADD_ITIT_SHARE: SERVER_URL + '/article/addItitShare',
  // 更新用户信息
  UPDATE_USER: SERVER_URL + '/wx/updateUserInfo',
  // 获取福利列表
  WELFARE_LIST: 'https://gank.io/api/data/福利/',
  // 获取评论列表
  GET_COMMENTLIST: SERVER_URL + '/comment/wxGetCommentList',
  // 发送评论列表
  POST_NEWCOMMENT: SERVER_URL + '/comment/wxPostNewComment',
  // 点赞评论
  POST_NICECOMMENT: SERVER_URL + '/comment/wxPostNice',
  // 获取点赞信息
  GET_NICE: SERVER_URL + '/user/getNice',
  // 获取分享图片
  GET_SHAREIMG: SERVER_URL + '/file/getShareImg',
 
  
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
    wx.request({
      url: url,
      data: dataParam,
      dataType: 'json', //服务器返回json格式数据
      success: function (res) {
        let data = res.data;
        res['statusCode'] === 200 ? success(data) : fail(res);
      },
      fail: function (res) {
        console.log("get请求错误");
        fail(res)
      }
    })
  },

  /**
   * post请求
   */
  postData: function (url, dataParam, success, fail) {
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
      },
      fail: function(res) {
        console.log("post请求错误");
        fail(res)
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
