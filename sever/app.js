//koa
const Koa = require('koa');
const app = new Koa();
const views = require('koa-views');



//设置模版引擎
app.use(views('./views', {
    root: __dirname + '/views',
    extension: 'ejs'
  }))

//配置文件
const config = require('./configs');

//try/catch中间件
const errorHandle = require('./middlewares/errorHandle.js');

//引入response.js
const response = require('./middlewares/response.js');

//引入路由
const router = require('./routes/index.js');


//输出请求的方法，url,和所花费的时间
app.use(async (ctx, next) => {
    let start = new Date();
    await next();
    let ms = new Date() - start;
    console.log(`${ ctx.method } ${ ctx.url } - ${ ms } ms`);
});


//bodyParser中间件
const bodyParser = require('koa-bodyparser');
app.use(bodyParser(
    {
        'formLimit':"5mb",
        "jsonLimit":"5mb",
        "textLimit":"5mb"
    }
));


//response中间件
app.use(response);

//使用errorHandle中间件
app.use(errorHandle);


//使用路由中间件
app
    .use(router.routes())
    .use(router.allowedMethods());

//监听端口
app.listen(config.app.port, () => {
    console.log('The server is running at http://localhost:' + config.app.port);
});
