module.exports = function(sequelize, DataTypes){
return sequelize.define('Article', {
        id: {
            field: 'id',  //对应mysql内数据库的名称
            type: DataTypes.INTEGER(100),
            primaryKey: true,//主键
            allowNull: false,//允许空
            autoIncrement: true,//自增长
            unique:true, //唯一的
            comment:'文章Id' //注释
        },
        title: {//文章标题
            field: 'title',  
            type: DataTypes.STRING(30),
            allowNull: false
        },
        intro: {//文章简介
            field: 'intro',  
            type: DataTypes.STRING(255),
            allowNull: false
        },
        intro_img: {//简介图片
            field: 'intro_img',  
            type: DataTypes.STRING(255)
        },
        article_formd: {//正文Markdown格式
            field: 'article_formd',  
            type: DataTypes.TEXT
        },
        article_forhtml: {//正文html格式
            field: 'article_forhtml',  
            type: DataTypes.TEXT
        },
        article_list:{
            field: 'article_list',  
            type: DataTypes.TEXT
        },
        keyword: {//关键词
            field: 'keyword',  
            type: DataTypes.STRING(50)
        },
        save_time: {
            field: 'save_time',  
            type: DataTypes.STRING(100),
            allowNull: false
        },
        publish: {
            field: 'publish',  
            type: DataTypes.BOOLEAN,
            allowNull: false
        },
        read_num: {
            field: 'read_num',  
            type: DataTypes.INTEGER(100),
            allowNull: false
        },
        user_id: {
            field: 'user_id',  
            type: DataTypes.INTEGER(10),
            allowNull: false
        },
        is_stick:{
            field: 'is_stick',  
            type: DataTypes.BOOLEAN,
            allowNull: false
        } 
    }, 
        {
            tableName: 'articles', //设置表格名
            timestamps: true,  //时间戳，启用该配置后会自动添加createdAt、updatedAt两个字段，分别表示创建和更新时间
            underscored: true,  //使用下划线，自动添加的字段会在数据段中使用“蛇型命名”规则，如：createdAt在数据库中的字段名会是created_at
            charset: 'utf8', //设置字符集
            collate: 'utf8_general_ci',
        });
}