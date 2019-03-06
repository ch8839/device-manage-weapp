const cloud = require('wx-server-sdk')
const TcbRouter = require('tcb-router')
const rp = require('request-promise');
const axios = require('axios')
cloud.init({
  env: 'ch-test-788617',//这个就是环境id
})

const db = cloud.database();

// 云函数入口函数
exports.main = async (event, context) => {
  const app = new TcbRouter({ event });
  app.use(async (ctx, next) => {
    ctx.data = {};
    await next(); // 执行下一中间件
  });

  //获取用户Openid
  app.router('code2Session', async (ctx, next) => {
    const JSCODE = event.code;
    const resultValue = await rp('https://api.weixin.qq.com/sns/jscode2session?appid=wx5ab0cd093111b609&secret=40a0869724493169d38bcbdb05293b28&js_code='+JSCODE+'&grant_type=authorization_code')
    const result_code = JSON.parse(resultValue);
    console.log('------ openid :', result_code );
    ctx.data.openid = result_code.openid;
    await next(); // 执行下一中间件
  }, async (ctx) => {
    // ctx.body 返回数据到小程序端
    ctx.body = { code: 0, data: ctx.data };
  })

//获取accesstoken

  app.router('repair', async (ctx, next) => {
    const DSNUM=event.DSNUM;
    const biaoid = event.biaoid;
    const biaoType = event.biaoType;
    const area = event.area;
    const problem = event.problem;
    const info = event.info;
    const username = event.username;
    const formId = event.formId;
    const time=event.time
    console.log(2,formId)
    

    const resultValue = await rp('https://api.weixin.qq.com/cgi-bin/token?grant_type=client_credential&appid=wx5ab0cd093111b609&secret=40a0869724493169d38bcbdb05293b28');
    const token = JSON.parse(resultValue).access_token;
    console.log('------ token :', token);

    const response = await axios({
      method: 'post',
      url: 'https://api.weixin.qq.com/cgi-bin/message/wxopen/template/send?access_token='+token,
      data: {
        touser: "oSXAE5jfckJ49KRAIGYffs5z2gVM" ,
        template_id:"H44ifiDryWQUUWZ2cMbuXlDprYJrq6osbJf2e428IGw",
        page:"/pages/my/mylist/list-detail/list-detail?id="+ biaoid,
        form_id:formId,
        data:{
          "keyword1": { "value": username},
          "keyword2": { "value": time},
          "keyword3": { "value": area},
          "keyword4": { "value": biaoType},
          "keyword5": { "value": DSNUM},
          "keyword6": { "value": problem },
          "keyword7": { "value": info},
        }
      }
    });
    console.log(response.data)
    await next(); // 执行下一中间件
  }, async (ctx) => {
    // ctx.body 返回数据到小程序端
    ctx.body = { code: 0};
  })

  

 //获取单页数据
  app.router('list_page', async (ctx, next) => {
    const MAX_LIMIT = event.page_num;
    const list_c = event.listType;
    const start=event.start-1;
    console.log(start)
    const countResult = await db.collection(list_c).count()
    const total = countResult.total
    // 计算需分几次取
    const batchTimes = Math.ceil(total / MAX_LIMIT)
    // 承载所有读操作的 promise 的数组
    ctx.data.tasks = await db.collection(list_c).skip(start * MAX_LIMIT).limit(MAX_LIMIT).get()
    console.log(ctx.data.tasks);
    await next(); // 执行下一中间件
  }, async (ctx) => {
    // ctx.body 返回数据到小程序端
    ctx.body = { code: 0, data: ctx.data };
  })
  

//按表类型获取数据
  app.router('biaotype_page', async (ctx, next) => {
    const MAX_LIMIT = event.page_num;
    const list_c = event.listType;
    const start = event.start - 1;
    const defaultbiaoType = event.defaultbiaoType;
    console.log(start)
    
    ctx.data.tasks = await db.collection(list_c).where({
      defaultbiaoType: defaultbiaoType
    }).skip(start * MAX_LIMIT).limit(MAX_LIMIT).get()
    console.log(ctx.data.tasks);
    await next(); // 执行下一中间件
  }, async (ctx) => {
    // ctx.body 返回数据到小程序端
    ctx.body = { code: 0, data: ctx.data };
  })
 
 //获取不同类型表设备数量
  app.router('biaotype_count', async (ctx, next) => {
    const list_c = event.listType;
    const defaultbiaoType = event.defaultbiaoType;
    ctx.data.counts = await db.collection(list_c).where({
      defaultbiaoType: defaultbiaoType
    }).count()
    console.log(ctx.data.counts);
    await next(); // 执行下一中间件
  }, async (ctx) => {
    // ctx.body 返回数据到小程序端
    ctx.body = { code: 0, data: ctx.data };
  })

//获取总设备数量
  app.router('list_count', async (ctx, next) => {
    const list_c = event.listType;
    ctx.data.counts = await db.collection(list_c).count()
    console.log(ctx.data.counts);
    await next(); // 执行下一中间件
  }, async (ctx) => {
    // ctx.body 返回数据到小程序端
    ctx.body = { code: 0, data: ctx.data };
  })

//获取map上marker点的信息
  app.router('markerinfo', async (ctx, next) => {
    const list_c = event.listType;
    const longitude = event.longitude;
    const latitude = event.latitude;
    ctx.data.info = await db.collection(list_c).where({
      longitude: longitude,
      latitude: latitude
    }).get()
    console.log(ctx.data.info);
    await next(); // 执行下一中间件
  }, async (ctx) => {
    // ctx.body 返回数据到小程序端
    ctx.body = { code: 0, data: ctx.data };
  })
 
 //修改用户角色
  app.router('users', async (ctx, next) => {
    const list_c = event.listType;
    const roleid = event.id;
    const role = event.value;
    try {
      return await db.collection(list_c).doc(roleid).update({
        // data 传入需要局部更新的数据
        data: {
          role: role
        }
      })
    } catch (e) {
      console.error(e)
    } 
  })

//修改设备信息
  app.router('list', async (ctx, next) => {
    const list_c = event.listType;
    const biaoid = event.biaoid;
    const defaultbiaoType = event.defaultbiaoType;
    const defaultcardType = event.defaultcardType;
    const DSNUM = event.DSNUM;
    const DSNUM_8bit= event.DSNUM_8bit
    const date1 = event.date1;
    const people1 = event.people1;
    
    const date2 = event.date2;
    const defaultquality = event.defaultquality;
    const people2 = event.people2;

    const area = event.area;
    const latitude = event.latitude;
    const longitude = event.longitude;
    const location_d = event.location_d;
    const date3 = event.date3;
    const people3 = event.people3;
    
    try {
      return await db.collection(list_c).doc(biaoid).update({

        data: {
          defaultbiaoType: defaultbiaoType,
          defaultcardType: defaultcardType,
          DSNUM: DSNUM,
          DSNUM_8bit: DSNUM_8bit,
          date1: date1,
          people1: people1,
          defaultquality: defaultquality,
          date2: date2,
          people2: people2,
          area: area,
          latitude: latitude,
          longitude: longitude,
          location_d: location_d,
          date3: date3,
          people3: people3,
        }
      })
    } catch (e) {
      console.error(e)
    } 
  })
  return app.serve();
}