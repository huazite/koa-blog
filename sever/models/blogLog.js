module.exports = function(sequelize, DataTypes){
    return sequelize.define('bloglog',  
 {
     id: {
         field: 'id',  
         type: DataTypes.INTEGER(100),
         primaryKey: true,
         allowNull: false,
         autoIncrement: true
     },
     visit_num: {
         field: 'visit_num',  
         type: DataTypes.INTEGER(255),
         allowNull: false
     }
 }, {
         tableName: 'bloglogs', //设置表格名
         timestamps: true,  //时间戳，启用该配置后会自动添加createdAt、updatedAt两个字段，分别表示创建和更新时间
         underscored: true,  //使用下划线，自动添加的字段会在数据段中使用“蛇型命名”规则，如：createdAt在数据库中的字段名会是created_at
         charset: 'utf8', //设置字符集
         collate: 'utf8_general_ci'
     });
 }
 