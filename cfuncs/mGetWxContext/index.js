// 云函数入口文件
const cloud = require('wx-server-sdk')
cloud.init()
const db = cloud.database();

// 云函数入口函数
exports.main = async (event, context) => new Promise((resolve, reject) => {
  let data = {};
  if (event.articleId) {
    db.collection('comment').add({
      // data 字段表示需新增的 JSON 数据
      data: {
        articleId: event.articleId,
        userId: event.openId,
        comment: event.comment
      }
    })
      .then(res => {
        console.log(res)
      })
  } else {
    console.log("不支持的参数");
  }
})