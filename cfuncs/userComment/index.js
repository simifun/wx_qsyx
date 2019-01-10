// 云函数入口文件
const cloud = require('wx-server-sdk')

cloud.init()

// 云函数入口函数
exports.main = async (event, context) => {
  let data = event.data;
  let openIds = [];
  for (var i = 0; i < data.length; i++) {
    openIds.push(data.openId);
  }
  if (openIds.length > 0) {
    userInfoList = await db.collection('user').where({
      _openid: _.in(openIds)
    }).get();
  } 
  for (var i = 0; i < data.length; i++) {
    data[i].userInfo = userInfoList[i];
  }
  return date;
}