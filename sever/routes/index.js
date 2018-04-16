const config = require('../configs'),
      Router = require('koa-router'),
      router = new Router(),
      A = require('../controllers/article.js'),
      //T = require('../controllers/tag.js'),
      U = require('../controllers/user.js'),
      //M = require('../controllers/me.js'),
      M = require('../controllers/message.js'),
      O = require('../controllers/oa.js'),
      checkToken = require('../middlewares/checkToken.js');


/* HTTP动词
    GET     //查询
    POST    //新建
    PUT     //替换
    PATCH   //更新部分属性
    DELETE  //删除指定ID的文档
*/

router
//**前台 */
//页面渲染
    .get('/',A.showIndex)                       //显示主页
    .get('/articles/:id', A.getArticleById)     //获取单个文章
    .get('/timeline',A.showTimeline)            //获取时间线界面
    .get('/search/:keyword',A.showSearch)       //获取搜索界面
    .get('/categories/:id',A.showCategory)      //获取分类文档界面
    .get('/about',A.showAbout)                  //获取关于界面（文章publish:-1）
//数据获取、推送
    .post('/articles/createMsg',M.createMessage)  //创建评论
    .get('/getMoreArticles',A.getMoreArticles)  //获取更多文章


//**后台 */
//页面渲染
    .get('/oa/',checkToken,O.showAdmin)                     //显示主页面
    .get('/oa/newArticle',checkToken, A.newArticle)            //显示新建文章markdown界面 
    .get('/oa/articles/:id', checkToken, A.showArticle)     //显示特定文章信息
//ajax请求     
    .post('/oa/articles', checkToken, A.createArticle)                     //创建文章
    .delete('/oa/articles/:id', checkToken, A.deleteArticleById)           //删除文章
    .patch('/oa/articles/:id', checkToken, A.modifyArticle)                //修改文章
    .get('/oa/allArticles', checkToken,A.getAllArticles)                   //获取所有文章

    .post('/oa/login', U.login)
    .post('/oa/register',U.register)                                        //用户登录

    
    
/** 
    .get('/me', M.getMeInfo)                       //获取个人信息
    .patch('/me', checkToken, M.modifyMeInfo);                   //更改个人信息
*/  
exports = module.exports = router;


