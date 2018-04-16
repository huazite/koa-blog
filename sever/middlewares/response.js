/*
 * 返回码
 */
const retCode = {
    SessionExpired: -1,             //session过期
    Fail: 0,                        //失败
    Success: 1,                     //成功
    ArgsError: 2,                   //参数错误
    UserExisted: 10,                //用户已经存在
    UsernameOrPasswordError: 11,    //用户名或者密码错误      
    UserNotExist: 12,               //用户不存在    
};

// use: 用来给所有请求统一响应--统一响应中间件
//在ctx对象上挂载方法，如果在调用的是有些参数没有出入，那么相当这个参数不存在，除非采用默认值的方式
module.exports = async (ctx, next) => {
    //请求成功时
    ctx.success = ({ data, msg, retCode}) => {
        ctx.body = { code: 200, data, msg, retCode };
    };
    ctx.fail = ({ data, msg, retCode}) => {
        ctx.body = { code: 400, data, msg, retCode };
    };
    //传递给下一个中间件
    await next();
};

//这种写法不利于错误时停止中间件的执行
//请求失败时 status表示使用的是自定义状态码
// ctx.error = ({ data, msg, status, error }) => {
//     ctx.body = { code: 400 || status, data, msg, error };
// };