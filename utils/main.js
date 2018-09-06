/*******offcanvas.js 侧滑菜单栏开始******/
//侧滑容器父节点
var offCanvasWrapper = mui('offCanvasWrapper');
var offCanvasWrapperDom = document.getElementById("offCanvasWrapper");
////主界面容器
var offCanvasInner = document.getElementById("offCanvasInner");

offCanvasInner.addEventListener('drag', function (event) {
  event.stopPropagation();
});

////菜单容器
//var offCanvasSide = document.getElementById("offCanvasSide");
var offCanvasBtn = document.getElementById('offCanvasBtn');
//<!--侧滑菜单部分-->
init();

function init() {
  var aside = document.createElement('aside');
  aside.setAttribute('class', 'mui-off-canvas-left');
  aside.setAttribute('id', 'offCanvasSide');

  var offCanvasSideScroll = document.createElement('div');
  offCanvasSideScroll.setAttribute('class', 'mui-scroll-wrapper');

  var scroll = document.createElement('mui-scroll');
  scroll.setAttribute('class', 'mui-scroll');
  //增加关闭蒙版
  var backdrop = document.createElement('div');
  backdrop.setAttribute('class', 'mui-off-canvas-backdrop');

  var title = document.createElement('div');
  title.setAttribute('class', 'title');
  title.innerHTML = "轻松一下";
  title.addEventListener('tap', function (e) {
    mui.openWindow("../html/home.html")
  });

  var about = document.createElement('div');
  about.setAttribute('class', 'title');
  about.innerHTML = "联系我们";
  about.addEventListener('tap', function (e) {
    mui.openWindow("../html/about.html")
  });

  var home = document.createElement('div');
  home.setAttribute('class', 'title');
  home.setAttribute('style', 'margin-bottom: 25px;');
  home.innerHTML = "首页";
  var contentDiv = document.createElement('div');
  home.addEventListener('tap', function (e) {
    mui.openWindow("../html/home.html")
  });
  var contentxml =
    '<ul class="mui-table-view mui-table-view-chevron mui-table-view-inverted">' +
    '<li id="video" class="mui-table-view-cell">' +
    '<a class="mui-navigate-right">视频</a>' +
    '</li>' +
    '<li id="gif" class="mui-table-view-cell">' +
    '<a class="mui-navigate-right">动图</a>' +
    '</li>' +
    '<li id="zt" class="mui-table-view-cell">' +
    '<a class="mui-navigate-right">组图</a>' +
    '</li>' +
    '<li id="fl" class="mui-table-view-cell">' +
    '<a class="mui-navigate-right">福利</a>' +
    '</li>' +
    '</ul>';
  contentDiv.innerHTML = contentxml;
  scroll.appendChild(title);
  scroll.appendChild(home);
  scroll.appendChild(contentDiv);
  scroll.appendChild(about);

  offCanvasSideScroll.appendChild(scroll);
  aside.appendChild(offCanvasSideScroll);
  offCanvasWrapperDom.appendChild(aside);
  offCanvasInner.appendChild(backdrop);

  document.getElementById("video").addEventListener('tap', function (e) {
    mui.openWindow("../html/videomain.html")
  });
  document.getElementById("gif").addEventListener('tap', function (e) {
    mui.openWindow("../html/gifmain.html")
  });
  document.getElementById("zt").addEventListener('tap', function (e) {
    mui.openWindow("../html/ztmain.html")
  });
  document.getElementById("fl").addEventListener('tap', function (e) {
    mui.openWindow("../html/welfare.html")
  });
}

function gotoMain() {
  mui.openWindow("../html/gifmain.html");
}

//主界面和侧滑菜单界面均支持区域滚动；
mui('#offCanvasSideScroll').scroll();
mui('#offCanvasContentScroll').scroll();
/*******offcanvas.js 侧滑菜单栏结束******/

/*******myloading.js 等待加载开始******/
//扩展mui.showLoading
(function ($, window) {
  //显示加载框
  $.showLoading = function (message, type) {
    if ($.os.plus && type !== 'div') {
      $.plusReady(function () {
        plus.nativeUI.showWaiting(message);
      });
    } else {
      var html = '';
      html += '<i class="mui-spinner mui-spinner-white"></i>';
      html += '<p class="text">' + (message || "数据加载中") + '</p>';

      //遮罩层
      var mask = document.getElementsByClassName("mui-show-loading-mask");
      if (mask.length == 0) {
        mask = document.createElement('div');
        mask.classList.add("mui-show-loading-mask");
        document.body.appendChild(mask);
        mask.addEventListener("touchmove", function (e) {
          e.stopPropagation();
          e.preventDefault();
        });
      } else {
        mask[0].classList.remove("mui-show-loading-mask-hidden");
      }
      //加载框
      var toast = document.getElementsByClassName("mui-show-loading");
      if (toast.length == 0) {
        toast = document.createElement('div');
        toast.classList.add("mui-show-loading");
        toast.classList.add('loading-visible');
        document.body.appendChild(toast);
        toast.innerHTML = html;
        toast.addEventListener("touchmove", function (e) {
          e.stopPropagation();
          e.preventDefault();
        });
      } else {
        toast[0].innerHTML = html;
        toast[0].classList.add("loading-visible");
      }
    }
  };

  //隐藏加载框
  $.hideLoading = function (callback) {
    if ($.os.plus) {
      $.plusReady(function () {
        plus.nativeUI.closeWaiting();
      });
    }
    var mask = document.getElementsByClassName("mui-show-loading-mask");
    var toast = document.getElementsByClassName("mui-show-loading");
    if (mask.length > 0) {
      mask[0].classList.add("mui-show-loading-mask-hidden");
    }
    if (toast.length > 0) {
      toast[0].classList.remove("loading-visible");
      callback && callback();
    }
  }
})(mui, window);
/*******myloading.js 等待加载结束******/

/*******searchbar.js 顶部搜索栏开始******/
var menuWrapper = document.getElementById("menu-wrapper");
var menu = document.getElementById("menu");
var menuWrapperClassList = menuWrapper.classList;
var backdrop = document.getElementById("menu-backdrop");
var info = document.getElementById("info");
var searchBtn = document.getElementById("searchBtn");

backdrop.addEventListener('tap', toggleMenu);
document.getElementById("openSearch").addEventListener('tap', toggleMenu);

//下沉菜单中的点击事件
mui('#menu').on('tap', 'a', function () {
  toggleMenu();
  info.innerHTML = '你已选择：' + this.innerHTML;
});
mui('#menu').on('tap', "#searchBtn", function () {
  var keywords = document.getElementById("searchInput").value;
  var params = {
    keywords: keywords
  }
  getData(ARTICLE_SEARCH, params,
    function (data) {
      mui.hideLoading(); //隐藏后的回调函数
      if (data.success === true) {
        localStorage.setItem("searchresult", JSON.stringify(data.data.list));
        mui.openWindow("../html/searchresult.html");
      } else {
        mui.toast("查无结果");
      }
    },
    function (xhr, type, errorThrown) {
      mui.hideLoading(); //隐藏后的回调函数
      mui.toast("服务器错误，请稍后再试");
    });
});
var busying = false;

function toggleMenu() {
  if (busying) {
    return;
  }
  busying = true;
  if (menuWrapperClassList.contains('mui-hidden')) {
    menuWrapper.classList.remove('mui-hidden')
  }
  if (menuWrapperClassList.contains('mui-active')) {
    document.body.classList.remove('menu-open');
    menuWrapper.className = 'menu-wrapper fade-out-up animated';
    menu.className = 'menu bounce-out-up';
    setTimeout(function () {
      backdrop.style.opacity = 0;
      menuWrapper.classList.add('hidden');
    }, 500);
  } else {
    document.body.classList.add('menu-open');
    menuWrapper.className = 'menu-wrapper fade-in-down animated mui-active';
    menu.className = 'menu bounce-in-down';
    backdrop.style.opacity = 1;
  }
  setTimeout(function () {
    busying = false;
  }, 500);
}
/*******searchbar.js 顶部搜索栏结束******/

/*******my_ajax.js 网络请求部分开始******/
// 测试系统地址
// var SERVER_URL = 'http://127.0.0.1:8090';
// 正式系统地址
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
var getData = function (url, dataParam, success, error) {
  console.log("getData:" + JSON.stringify(dataParam));

  mui.ajax(url, {
    data: dataParam,
    dataType: 'json', //服务器返回json格式数据
    type: 'get', //HTTP请求类型
    timeout: 30000, //超时时间设置为30秒
    success: function (data) {
      console.log("data:" + JSON.stringify(data));
      success(data);
    },
    error: function (xhr, type, errorThrown) {
      console.log(xhr.status);
      console.log(xhr.responseText);
      //同一账号多设备登录处理
      if (xhr.status == 401) {
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
var postData = function (url, dataParam, success, error) {
  console.log("postData:" + JSON.stringify(dataParam));

  mui.ajax(url, {
    data: dataParam,
    dataType: 'json', //服务器返回json格式数据
    type: 'post', //HTTP请求类型
    timeout: 30000, //超时时间设置为30秒
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8'
    },
    success: function (data) {
      console.log("data:" + JSON.stringify(data));
      success(data);
    },
    error: function (xhr, type, errorThrown) {
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
var postFile = function (url, dataParam, success, error) {
  var xhr = new XMLHttpRequest();
  xhr.open("post", url, true);
  xhr.onload = function () {
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
var putData = function (url, dataParam, success, error) {
  console.log("putData:" + JSON.stringify(dataParam));
  var xhr = new XMLHttpRequest();
  xhr.onreadystatechange = function () {
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
var deleteData = function (url, dataParam, success, error) {
  console.log("deleteData:" + JSON.stringify(dataParam));

  var xhr = new XMLHttpRequest();
  xhr.onreadystatechange = function () {
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
var downloadFile = function (url, dataParam, success, error) {
  console.log("downloadFile:" + JSON.stringify(dataParam));

  var xhr = new XMLHttpRequest();
  xhr.onreadystatechange = function () {
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
var postDataWithoutOriUrlAndHeader = function (url, dataParam, success, error) {
  console.log("postDataWithoutOriUrlAndHeader:" + JSON.stringify(dataParam));

  mui.ajax(url, {
    data: dataParam,
    dataType: 'json', //服务器返回json格式数据
    type: 'post', //HTTP请求类型
    timeout: 30000, //超时时间设置为30秒
    success: function (data) {
      console.log("data:" + JSON.stringify(data));
      success(data);
    },
    error: function (xhr, type, errorThrown) {
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
/*******my_ajax.js 网络请求部分结束******/

/*******畅言 三方评论 ******/
//(function(){ 
//var appid = 'cytNEHvD4'; 
//var conf = 'prod_64b2c48f973a27674ff429798323a2c6'; 
//var width = window.innerWidth || document.documentElement.clientWidth; 
//if (width < 960) { 
//window.document.write('<script id="changyan_mobile_js" charset="utf-8" type="text/javascript" src="http://changyan.sohu.com/upload/mobile/wap-js/changyan_mobile.js?client_id=' + appid + '&conf=' + conf + '"><\/script>'); } else { var loadJs=function(d,a){var c=document.getElementsByTagName("head")[0]||document.head||document.documentElement;var b=document.createElement("script");b.setAttribute("type","text/javascript");b.setAttribute("charset","UTF-8");b.setAttribute("src",d);if(typeof a==="function"){if(window.attachEvent){b.onreadystatechange=function(){var e=b.readyState;if(e==="loaded"||e==="complete"){b.onreadystatechange=null;a()}}}else{b.onload=a}}c.appendChild(b)};loadJs("http://changyan.sohu.com/upload/changyan.js",function(){window.changyan.api.config({appid:appid,conf:conf})}); } })();

/*******避免出现双滚动条******/
mui('.mui-scroll-wrapper').scroll({
  deceleration: 0.1, //flick 减速系数，系数越大，滚动速度越慢，滚动距离越小，默认值 0.0006 
  indicators: false  //隐藏一条滚动条 增大减速系数。。。
});