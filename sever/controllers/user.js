/*
 * @Author: huazi 
 * @Date: 2018-03-05 11:28:27 
 * @Last Modified by: huazi
 * @Last Modified time: 2018-03-06 13:21:56
 * ================用户管理控制模块================
 */

const S = require('../models/initdb.js');//sequelize缩写为S
const Op = S.Op;
const md5 = require('md5');
const config = require('../configs');
const createToken = require('../utils/createToken.js');
const moment = require('moment');

//返回数据格式
//{ msg: '', success: boolean, data: {} }
//注意ctx.success在条件分支语句中需要加return,不然继续往下执行

class UserController{
    static async register(ctx){
        let now = moment();

        const { uEmail, uName ,uPsw,uBlog} = ctx.request.body;

        let result = await S.User
            .findOne({
                'where':{
                    user_name:uName
                }
            })
            .catch(err => {
                ctx.throw(500, '服务器内部错误-findUser错误！');
            });

        //判断用户名称是否已经存在
        if(result){
            return ctx.success({
                msg: '用户名已存在!',
                retCode:10
            })
        }else{
            //创建用户
            var user = await S.User.create({
                user_name: uName,
                password: uPsw,
                user_email: uEmail,
                user_blog: uBlog,
                avatar: '/imgs/avatar.jpg',
                last_login: now
            })
            .catch((err) => {
                ctx.throw(500, '服务器内部错误-create错误!');
            });
            
            return ctx.success({
                data: user,
                msg: '添加成功!',
                retCode:1
            });
        }
    }


    //用户登录(创建token)
    static async login(ctx){
        const { username, password ,remember} = ctx.request.body;
        var rememberFlag = false;
        if(remember == 'on'){
            rememberFlag = true;
        }
        if(!username){
            return ctx.fail({
                msg: '用户名不能为空!',
                retCode:2
            })
        }
        if(!password){
            return ctx.fail({
                msg: '密码不能为空!',
                retCode:2
            })
        }
        let result = await S.User
            .findOne({
                'where':{
                    '$or': [
                        {'user_name': username},
                        {'user_email': username}
                    ]
                }
            })
            .catch(err => {
                ctx.throw(500, '服务器内部错误-findUser错误！');
            });
                
        if(result){
            if(result.password === password){ //md5(password)
                let token = createToken(result.id,rememberFlag);
                return ctx.success({
                    data: {
                        // uid: result.id,
                        // username: result.user_name,
                        // createTime: result.created_at,
                        token
                    },
                    msg: '登录成功!',
                    retCode:1
                });
            }else{
                return ctx.fail({
                    msg: '密码错误!',
                    retCode:11
                })
            }
        }else{
            return ctx.fail({
                msg: '用户名不存在!',
                retCode:12
            })
        }

    }
    //用户退出(由前台控制即可)
    
    //更新用户资料(到时再看看需要记录什么资料信息)
    static async updateUserMsg(ctx){
        ctx.success({
            msg: '通过!'
        });
    }
    //重置密码
    static async resetPwd(ctx){
        const uid = ctx.request.body.id;
        const password = md5(ctx.request.body.password);
        await User
            .findByIdAndUpdate(uid, {
                password
            })
            .exec()
            .catch(err => {
                ctx.throw(500, '服务器内部错误-modifyPwd错误！');
            });
        ctx.success({
            msg: '更改管理员密码成功!',
            success: true
        });
    }
}

exports = module.exports = UserController;