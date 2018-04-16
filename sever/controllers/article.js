/*
 * @Author: huazi 
 * @Date: 2018-03-05 11:29:03 
 * @Last Modified by: huazi
 * @Last Modified time: 2018-03-16 17:52:56
 * ================文章管理控制模块================
 */
const S = require('../models/initdb.js');//sequelize缩写为S
const Op = S.Op;
const moment = require('moment');

class ArticleController{
/**前台界面逻辑 */
    //呈递主页面
    static async showIndex(ctx,next){  
        //增加阅读数量
        await S.query(
            `UPDATE bloglogs SET visit_num=visit_num+1 WHERE id=1`,
            { type: S.QueryTypes.UPDATE}
        ).catch(err => {
            ctx.throw(500, '服务器内部错误-update错误!')
        });     
        //查询文章数据
        var articles = await S.Article.findAll({
            'attributes': ['id', 'title','intro','intro_img','keyword','save_time',['category','category_id']],
            'include': [{
                'model': S.Category, 
            }],
            'limit': 5,
            'where':{
                'publish':1
            },
            'order':[
                ['id','DESC']
            ]
        });

        //格式化时间
        for(let a of articles){
            a.dataValues.save_time = moment(a.dataValues.save_time).format('YYYY-MM-DD');     
        }
        //查询置顶文章信息
        var sticks = await S.Article.findAll({
            'attributes': ['id', 'title','save_time'],
            'where':{
                [Op.and]: [
                    {'is_stick':1},
                    {'publish':1}
                ]
            },
            'limit': 10
        });
        
        //格式化时间
        for(let s of sticks){
            s.dataValues.save_time = moment(s.dataValues.save_time).format('YYYY-MM-DD');     
        }
        
        //查询分类信息：分类、数量
        var categories;
        await S.query(
            "SELECT categories.id, categories.category_name, count(articles.category) count FROM articles INNER JOIN categories ON articles.category = categories.id AND articles.publish = 1 GROUP BY articles.category, categories.category_name",
            { type: S.QueryTypes.SELECT}
        ).then(function(results){
            categories = results;
        })

        //查询keyword
        var keywords = await S.Keyword.findAll();

        await ctx.render('../views/blog/index.ejs',{
            'articles':articles,
            'sticks':sticks,
            'categories':categories,
            'keywords':keywords
        });
        
    }
     //呈现timeline界面
     static async showTimeline(ctx){
        var timeline;
        //分组查询月份数据
        await S.query(
            `SELECT DATE_FORMAT(save_time, "%Y-%m") as savetime,count(*) as 总数  FROM articles  GROUP BY DATE_FORMAT(save_time, "%Y-%m") ORDER BY savetime DESC`,
            { type: S.QueryTypes.SELECT}
        ).then(function(results){
           timeline = results;
        })

        //根据月份数据，再找出相关文章信息
        for(let r of timeline){
            await S.query(
                `SELECT id ,title, DATE_FORMAT(save_time, "%Y-%m-%d %H:%i:%s") as savetime FROM articles  where publish = 1 AND DATE_FORMAT(save_time, "%Y-%m") = "${r.savetime}" ORDER BY id DESC`,
                { type: S.QueryTypes.SELECT}
            ).then(function(results){
               r.info = results;  
            })
        }

        await ctx.render('../views/blog/timeline.ejs',{
            'category':null,
            'timeline':timeline
        });
         
     }
     //呈现分类界面
     static async showCategory(ctx){
         const category_id = ctx.params.id;

         //查询分类信息
         const category = await S.Category.findOne({
             'where':{
                 'id':category_id
             }
         })
        //查询文章数据
        var articles = await S.Article.findAll({
            'attributes': ['id', 'title','intro','intro_img','keyword','save_time'],
            'where':{
                'publish':1,
                'category':category_id
            },
            'order':[
                ['id','DESC']
            ]
        });
        //格式化时间
        for(let a of articles){
            a.dataValues.save_time = moment(a.dataValues.save_time).format('YYYY-MM-DD hh:mm:ss');     
        }

        await ctx.render('../views/blog/timeline.ejs',{
            'category':category,
            'articles':articles
        });

     }
     //呈现搜索结果界面
     static async showSearch(ctx){
        const keyword = ctx.params.keyword;
        //console.log(escape(keyword));
        
          //查询文章数据
        var articles = await S.Article.findAll({
            'attributes': ['id', 'title','intro','intro_img','keyword','save_time',['category','category_id']],
            'include': [{
                'model': S.Category, 
            }],
            'where':{
                'publish':1,
                [Op.or]:[
                    // {
                    //     title: {
                    //         [Op.like]: `%${keyword}%`
                    //     }
                    // },
                    // {
                    //     article_forhtml: {
                    //         [Op.like]: `%${escape(keyword)}%`
                    //     }
                    // },
                    {
                        keyword: {
                            [Op.like]: `%${keyword}%`
                        }
                    }
                ]
            },
            'order':[
                ['id','DESC']
            ]
        });

        //格式化时间
        for(let a of articles){
            a.dataValues.save_time = moment(a.dataValues.save_time).format('YYYY-MM-DD');     
        }

        await ctx.render('../views/blog/search.ejs',{
            'articles':articles,
            'keyword':keyword
        });
     }
     //呈现关于界面（使用文章展示，可编辑。文章publish：-1）
     static async showAbout(ctx){
        //增加阅读数量
        await S.query(
            `UPDATE articles SET read_num=read_num+1 WHERE id=1`,
            { type: S.QueryTypes.UPDATE}
        ).catch(err => {
            ctx.throw(500, '服务器内部错误-update错误!')
        });

        const article = await S.Article.findOne({
            'where':{
                'publish': -1
            }
        }).catch(err => {
            ctx.throw(500, '服务器内部错误-Article.findOne错误!')
        });

        //查询文章评论
        var messages = await S.Message.findAll({
            where:{ 
                [Op.and]: [
                    {article_id:1},
                    {reply_id:0}
                ]
            }
        });
        var msgCount = messages.length;
        //循环数据，然后再根据数据查询回复数据
        async function getReplyMsg(messages,S,callback){
            for(let m of messages){
                const replyMessages = await S.Message.findAll({
                    where:{
                        reply_id:m.dataValues.id
                    }
                });
                m.dataValues.replyMessages = replyMessages;
                
                if(replyMessages.length != 0){
                    getReplyMsg(replyMessages,S);
                }
            }
            return messages;
        }
        messages = await getReplyMsg(messages,S);

        await ctx.render('../views/blog/about.ejs',{
            'article':article,
            'msgCount':msgCount,
            'messages':JSON.stringify(messages)
        });
        
     }
     //获取单个文章(前台使用)
     static async getArticleById(ctx){
        const id = ctx.params.id;
        
        //增加阅读数量
        await S.query(
            `UPDATE articles SET read_num=read_num+1 WHERE id=${id}`,
            { type: S.QueryTypes.UPDATE}
        ).catch(err => {
            ctx.throw(500, '服务器内部错误-update错误!')
        });

        //获取文章信息
        var article = await S.Article.findOne({
            'attributes': ['id', 'title','intro_img','article_forhtml','article_list','keyword','save_time','category'],
            'where':{
                [Op.and]: [{'id': id},{'publish':1}]
            }
        }).catch(err => {
            ctx.throw(500, '服务器内部错误-Article.findOne错误!')
        });

        //处理keyword成为数组  ,并传入上一篇文章、下一篇文章    
        article.dataValues.keyword = article.dataValues.keyword.split('、');
        
        //查询分类信息
        const category = await S.Category
        .findOne({
            where:{
                id: article.dataValues.category
            }
        })
        .catch(err => {
            ctx.throw(500, '服务器内部错误-category-findAll错误!')
        });


        //查询上一个已发布的文章 
        //原始sql语句:SELECT * FROM articles WHERE id = (SELECT MAX(id) FROM articles WHERE id < 6 AND publish = 1)
        var prev = await S.Article.findAll({
            'limit':1,
            'attributes': ['id', 'title'],
            'where':{
                [Op.and]: [
                    {'id': {[Op.lt]:id}},
                    {'publish':1}
                ]
            },
            'order':[
                ['id','DESC']
            ]
        });
        //查询下一个已发布的文章 
        var next = await S.Article.findAll({
            'limit':1,
            'attributes': ['id', 'title'],
            'where':{
                [Op.and]: [
                    {'id': {[Op.gt]:id}},
                    {'publish':1}
                ]
            }
        });
        //输出为json
        var relate = {
            'prev': prev[0],
            'next': next[0]
        }
        
        //查询文章评论
        var messages = await S.Message.findAll({
            where:{ 
                [Op.and]: [
                    {article_id:id},
                    {reply_id:0}
                ]
            }
        });
        var msgCount = messages.length;
        //循环数据，然后再根据数据查询回复数据
        async function getReplyMsg(messages,S,callback){
            for(let m of messages){
                const replyMessages = await S.Message.findAll({
                    where:{
                        reply_id:m.dataValues.id
                    }
                });
                m.dataValues.replyMessages = replyMessages;
                
                if(replyMessages.length != 0){
                    getReplyMsg(replyMessages,S);
                }
            }
            return messages;
        }
        messages = await getReplyMsg(messages,S)
              

        await ctx.render('../views/blog/article.ejs',{
            'category':category,
            'article':article,
            'relate':relate,
            'msgCount':msgCount,
            'messages':JSON.stringify(messages)
        });
    }
    //获取更多文章
    static async getMoreArticles(ctx){
        const nowId = ctx.query.id;
        
        const articles = await S.Article.findAll({
            'attributes': ['id', 'title','intro','intro_img','keyword','save_time',['category','category_id']],
            'include': [{
                'model': S.Category, 
            }],
            'where':{
                'id':{
                    '$lt': nowId,  
                },
                'publish':1
            },
            'limit':5,
            'order':[
                ['id','DESC']
            ]
        }).catch(err => {
            ctx.throw(500, '服务器内部错误-getMoreArticles错误!');
        });

        //格式化时间
        for(let a of articles){
            a.dataValues.save_time = moment(a.dataValues.save_time).format('YYYY-MM-DD');     
        }
        ctx.success({
            msg: '评论成功!',
            data:articles,
            retCode:1
        });
    }






/**后台界面逻辑 */
    //新建文章页面呈现
    static async newArticle(ctx){
         //查询文章分类信息
         const categories = await S.Category
         .findAll()
         .catch(err => {
             ctx.throw(500, '服务器内部错误-category-findAll错误!')
         });

         await ctx.render('../views/admin/newArticle.ejs',{
            'categories':categories
        });
    }
    //修改文章页面呈现
    static async showArticle(ctx){
        const id = ctx.params.id;
         //根据id查询文章信息
        const article = await S.Article
        .findOne({
            'where':{
                'id':id
            }
        }).catch(err => {
            ctx.throw(500, '服务器内部错误-Article.findAll错误!')
        });
        
        //查询当前文章的分类信息
        const category = await S.Category
        .findOne({
            where:{
                id: article.dataValues.category
            }
        })
        .catch(err => {
            ctx.throw(500, '服务器内部错误-category-findAll错误!')
        });

         //查询文章分类信息，排除已查分类
        const categories = await S.Category
        .findAll({
            where:{
                id:{
                    '$ne': article.dataValues.category
                }
            }
        }).catch(err => {
            ctx.throw(500, '服务器内部错误-category-findAll错误!')
        });
         
        await ctx.render('../views/admin/showArticle.ejs',{
            'category':category,
            'categories':categories,
            'article': article
        });
    }
    //创建文章
    static async createArticle(ctx){  
        var { category,category_name,article_list, title,intro ,intro_img,keyword,publish,article_formd,article_forhtml,is_stick} = ctx.request.body;
        const now = moment().format(); 

        //如果category为-1，则创建新的分类
        if(category == '-1'){
            const newCategory = await S.Category.create({
                category_name:category_name
            }).catch(err => {
                ctx.throw(500, '服务器内部错误-category.create错误!')
            });
            category = newCategory.dataValues.id;  
        }
        
        //查询关键词是否已存在，不存在则创建新的关键词
        const keywordArr = keyword.trim().split('、');
        for(let k of keywordArr){
            const sqlKeyword = await S.Keyword.findAll({
                'where':{
                    keyword:{
                        [Op.like]:k
                    }
                }
            }).catch(err => {
                ctx.throw(500, '服务器内部错误-Keywords.findAll错误!')
            });
            
            if(sqlKeyword.length == 0 && k !=''){
                const newKeyword = await S.Keyword.create({
                    keyword:k
                }).catch(err => {
                    ctx.throw(500, '服务器内部错误-Keywords.create错误!')
                });
            }
        }
        //创建数据
        const article = await S.Article.create({
            'title': title,
            'intro': intro,
            'intro_img': intro_img,
            'keyword':keyword,
            'publish':publish,
            'save_time':now,
            'read_num':'0',
            'user_id':ctx.userId,
            'article_formd':escape(article_formd),
            'article_forhtml':escape(article_forhtml),
            'article_list':escape(article_list),
            'category':category,
            'is_stick':is_stick
        }).catch(err => {
            ctx.throw(500, '服务器内部错误-Article.create错误!')
        });
        //文章发布成功，顺便也把存储结果返回
        ctx.success({
            msg: '文章创建成功！',
            retCode:1
        });
    }
    //删除文章
    static async deleteArticleById(ctx){
        const id = ctx.params.id;
        
        let result = await S.Article.destroy({
            force: true,
            'where':{
                'id':id
            }
        }).catch((err) => {
            ctx.throw(500, '服务器内部错误-findByIdAndRemove错误!')
        });
               
        if(result){
            ctx.success({
                msg: '删除文章成功!',
                data:result,
                retCode:1
            });
        }else{
            ctx.fail({
                msg: '未查找到文章或删除失败！',
                data:result,
                retCode:2
            });
        }
    }
    //修改文章
    static async modifyArticle(ctx){
        const id = ctx.params.id;
        var { category,category_name,article_list, title ,intro,intro_img,keyword,publish,article_formd,article_forhtml,is_stick} = ctx.request.body;
        const now = moment().format(); 
        
         //如果category为-1，则创建新的分类
         if(category == '-1'){
            const newCategory = await S.Category.create({
                category_name:category_name
            }).catch(err => {
                ctx.throw(500, '服务器内部错误-category.create错误!')
            });
            category = newCategory.dataValues.id;  
        }
        
        let result = await S.Article.update({             //{ $set: ctx.request.body }也可以
            'title':title,
            'intro':intro,
            'intro_img':intro_img,
            'keyword':keyword,
            'publish':publish,
            'article_formd':escape(article_formd),
            'article_forhtml':escape(article_forhtml),
            'article_list':escape(article_list),
            'is_stick':is_stick,
            'category':category,
            'save_time':now
        },
        {
            'where':{
                'id':id
            }
        }).catch((err) => {
            ctx.throw(500, '服务器内部错误-findByIdAndUpdate错误!');
        });
        ctx.success({
            msg: '修改成功!',
            retCode:1
        });
    }
    //获取所有文章(包含未发布文章，后台使用)
    static async getAllArticles(ctx){
        const publish = ctx.query.publish;
        let results,checked;

        console.log(publish);
        
       if(publish == '0'){
            results = await S.Article
            .findAll({
                'where':{
                    publish:0
                }
            })
            .catch(err => {
                ctx.throw(500, '服务器内部错误-分页查找错误!');
            });
       }else{
            results = await S.Article
            .findAll()
            .catch(err => {
                ctx.throw(500, '服务器内部错误-分页查找错误!');
            });

            checked = 'checked';
       }

        
       await ctx.render('../views/admin/allArticles.ejs',{
            'results':results,
            'checked':checked
        });


    }

}

exports = module.exports = ArticleController;