/*
 * @Author: huazi 
 * @Date: 2018-03-05 18:00:24 
 * @Last Modified by: huazi
 * @Last Modified time: 2018-03-05 18:00:44
 * ===================创建token===========
 */
const config = require('../configs');
const jwt = require('jsonwebtoken');
//返回一个token
module.exports = (userId,rememberFlag) => {
    var rememberFlag = rememberFlag || false;
    let privateKey = config.jwt.secret;
    let expiresIn;

    //判断用户是否让记住登录信息，记住时为长时间
    if(rememberFlag){
        expiresIn = config.jwt.langExprisesIn;
    }else{
        expiresIn = config.jwt.exprisesIn;
    }
    const token = jwt.sign({
            'id': userId,              //签发id
        }, privateKey, {
            expiresIn
        });
    return token;
};