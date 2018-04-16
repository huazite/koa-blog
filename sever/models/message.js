module.exports = function(sequelize, DataTypes){
    return sequelize.define('Message',  
 {
     id: {
         field: 'id',  
         type: DataTypes.INTEGER(100),
         primaryKey: true,
         allowNull: false,
         autoIncrement: true
     },
     msg_name: {
         field: 'msg_name',  
         type: DataTypes.STRING(30),
         allowNull: false
     },
     msg_email: {
        field: 'msg_email',  
        type: DataTypes.STRING(30)
    },
    msg_blog: {
        field: 'msg_blog',  
        type: DataTypes.STRING(30)
    },
    msg: {
        field: 'msg',  
        type: DataTypes.STRING(255),
        allowNull: false
    },
    msg_avatar: {
        field: 'msg_avatar',  
        type: DataTypes.STRING(255),
        allowNull: false
    },
    reply_id: {
        field: 'reply_id',  
        type: DataTypes.INTEGER(100),
        allowNull: false
    },
    article_id: {
        field: 'article_id',  
        type: DataTypes.INTEGER(100),
        allowNull: false
    },
    save_time: {
        field: 'save_time',  
        type: DataTypes.STRING(100),
        allowNull: false
    }
 }, {
         tableName: 'messages', //设置表格名
         timestamps: true,  //时间戳，启用该配置后会自动添加createdAt、updatedAt两个字段，分别表示创建和更新时间
         underscored: true,  //使用下划线，自动添加的字段会在数据段中使用“蛇型命名”规则，如：createdAt在数据库中的字段名会是created_at
         charset: 'utf8', //设置字符集
         collate: 'utf8_general_ci'
     });
 }
 