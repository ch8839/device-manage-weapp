const cloud = require('wx-server-sdk')
const axios = require('axios')
var rp = require('request-promise');
cloud.init({
  env: 'ch-test-788617',//这个就是环境id
})

// 云函数入口函数
exports.main = async (event, context) => {
  const resultValue = await rp('https://api.weixin.qq.com/cgi-bin/token?grant_type=client_credential&appid=wx5ab0cd093111b609&secret=40a0869724493169d38bcbdb05293b28')
  const token = JSON.parse(resultValue).access_token;
  console.log('------ TOKEN:', token);
  console.log('id:', event.id);

  const response = await axios({
    method: 'post',
    url: 'https://api.weixin.qq.com/cgi-bin/wxaapp/createwxaqrcode',
    responseType: 'stream',
    params: {
      access_token: token,
    },
    data: {
      path: event.path,
      width: 300,
    },
  });
  console.log(response.data)
  return await cloud.uploadFile({

    cloudPath: 'firecodeimages/' + event.DSNUM +event.biaoid+ '.png',
    fileContent: response.data,
    success: res => {
      console.log(res.fileID)
    },
    fail: console.error
  });


}
