// 云函数入口文件
const cloud = require('wx-server-sdk')
cloud.init()
const db = cloud.database();
const _ = db.command

// 云函数入口函数
exports.main = async(event, context) => {
  try {
    let data = {};
    let userInfoList = [];
    if (event.articleId) {
      await db.collection('comment').where({
          articleId: event.articleId,
        }).get().then(res => {
          data = res.data
        });
      let openIds = [];
      for (var i = 0; i < data.length; i++) {
        openIds.push(data[i].openId);
      }
      if (openIds.length > 0) {
        await db.collection('user').where({
          _openid: _.in(openIds)
        }).get().then(res => {
          userInfoList = res.data;
          for (var i = 0; i < data.length; i++) {
            data[i].userInfo = userInfoList[i];
          }
        });
      } 
      return data;
    } else {
      console.log("不支持的参数");
      return "不支持的参数";
    }
  } catch (e) {
    console.error(e)
  }
}