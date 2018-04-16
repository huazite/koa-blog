/**
 * 数据库初始化脚本
 * 
 */

var sequelize = require('./_db.js');
var Article = sequelize.import('./Article.js');
var Category = sequelize.import('./Category.js');
var User = sequelize.import('./user.js');
var Message = sequelize.import('./message.js');
var Keyword = sequelize.import('./keyword.js');
var Bloglog = sequelize.import('./bloglog.js');



// 建立模型之间的关系
Category.hasOne(Article,{foreignKey: 'category'});
Article.belongsTo(Category,{foreignKey: 'category'});

Article.hasMany(Message, {foreignKey: 'article_id'},{as: "message"});  // 会在Message数据中添加外键articleId
Message.belongsTo(Article,{foreignKey: 'article_id'});






//sequelize.sync({force: true}); //如果表已经存在，删除并且自动创建表
sequelize.sync();

exports = module.exports = sequelize;
exports.Message = Message;
exports.User = User;
exports.Keyword = Keyword;
exports.Article = Article;
exports.Category = Category;
exports.Bloglog = Bloglog;

