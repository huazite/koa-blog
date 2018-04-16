/**
 * 数据库初始化脚本
 * 
 */

const config = require('../configs/index.js')
const Sequelize = require('sequelize');


var sequelize = new Sequelize(config.mysql.database, config.mysql.user, config.mysql.password, {
    host : config.mysql.host, 
    port : config.mysql.port, 
    dialect : 'mysql',
    dialectOptions: {
        charset: 'utf8'
     },
    pool: {
        max: 5,
        min: 0,
        idle: 30000
    },
    timezone: '+08:00'
});

console.log('\n======================================')
console.log('开始连接数据库...')


exports = module.exports = sequelize;