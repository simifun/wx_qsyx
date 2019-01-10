// 云函数入口文件
const cloud = require('wx-server-sdk')
cloud.init()
const db = cloud.database();

// 云函数入口函数
exports.main = async (event, context) => {
  try {
    return await db.collection('comment').add({
      // data 字段表示需新增的 JSON 数据
      data: {
        articleId: event.articleId,
        comment: event.comment,
        openId: event.openId
      }
    })
  } catch (e) {
    console.error(e)
  }
}