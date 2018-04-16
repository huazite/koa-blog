/*
 * @Author: huazi 
 * @Date: 2018-03-05 17:59:42 
 * @Last Modified by: huazi
 * @Last Modified time: 2018-03-08 10:22:42
 * ==============验证token================
 */
const config = require('../configs');
const jwt = require('jsonwebtoken');

module.exports = async (ctx, next) => {
    //const authorization = ctx.get('authorization');
    const token = ctx.get('Cookie').split('=')[1]; 
    if(token){
        try{
            let decoded = jwt.verify(token, config.jwt.secret);
            //用户id挂载
            ctx.userId = decoded.id;
            
            let deadline = new Date()/1000;
            if(decoded.exp <= deadline){
                console.log('expired token');
                ctx.redirect('/views/admin/login.html'); //token过期，则跳转到登陆页面
            }else{
                console.log('鉴权成功!'); 
            }
        }catch(err){
            ctx.throw(401, 'expired token');      //token验证失败
        }
    }else{
        // ctx.throw(401, 'no token detected in http header Authorization');  //缺少token
        ctx.redirect('/views/admin/login.html');  //缺少token，则跳转到登陆页面
    }
    await next();
}