const S = require('../models/initdb.js');//sequelize缩写为S
const Op = S.Op;
const moment = require('moment');
const gravatar = require('gravatar');
class MessageController{
    //添加评论
    static async createMessage(ctx){
        const {msg_name,msg_email,msg_blog,msg,reply_id,article_id} = ctx.request.body;
        const now = moment().format(); 
        const retro = encodeURI('http://www.hezz.top/blog/imgs/avatar.jpg');
        //使用gravata头像
        const url = gravatar.url(msg_email, {s: '60', r: 'g', d: retro});
        /**
         * 参数：s:头像size（1--2048像素均可）
         *      r:头像的健康程度，可分
         *                          g：适合在任何受众类型的所有网站上显示。
         *                          pg：可能包含粗鲁的手势，穿着挑衅的个人，较不体面的话语或轻微的暴力。
         *                          r：可能包含诸如严酷的亵渎，强烈的暴力，裸体或使用毒品等。
         *                          x：可能包含铁杆性意象或极其令人不安的暴力。
         *      d:可自定义缺省图片：经过编码的图片地址（如果不设置，默认头像）
         * 
         */
        
        const message = await S.Message.create({
            'msg_name':msg_name,
            'msg_email':msg_email,
            'msg_blog':msg_blog,
            'msg':msg,
            'msg_avatar':url,
            'reply_id':reply_id,
            'article_id':article_id,
            'save_time':now
        }).catch(err => {
            ctx.throw(500, '服务器内部错误-Message.create错误!');
        });

        ctx.success({
            msg: '评论成功!',
            retCode:1
        });

    }
}

exports = module.exports = MessageController;