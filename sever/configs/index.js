const fs = require('fs');

let config = {
   admin: {
       username: 'admin',           
       password: 'admin',
       name: 'huazite'            
   },
   jwt: {
       secret: 'huazi',            
       exprisesIn: '3600s',          //以秒为单位
       langExprisesIn:'129600s'
   },
   mysql: {
       host: '10.168.2.250',
       database: 'blog',
       port: 3306,
       user: 'root',                   
       password: 'root' ,
       supportBigNumbers: true,
       multipleStatements: true,               
   },
   app: {
       port: process.env.PORT || 3000
   }
};

//可以新建一个private.js定义自己的私有配置
// if(fs.existsSync(__dirname + '/private.js')){
//     config = Object.assign(config, require('./private.js'));
// }

module.exports = config;