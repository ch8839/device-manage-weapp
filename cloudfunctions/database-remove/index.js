// 云函数入口文件
const cloud = require('wx-server-sdk')

cloud.init({
  env: 'ch-test-788617',//这个就是环境id
})
const db = cloud.database()
cloud.init()

// 云函数入口函数
exports.main = async (event, context) => {
  const list_c = event.listType;
  const biaoid = event.biaoid;
  try {
    return await db.collection(list_c).where({
      _id: biaoid
    }).remove()
  } catch (e) {
    console.error(e)
  }
}