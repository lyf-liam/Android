var mysql = require('mysql')
var connection = mysql.createConnection({
  host: '42.192.249.36',
  port: '3306',
  user: 'root',
  password: 'root',
  database: 'data'
});


// //开始链接数据库
// connection.connect(function(err){
//     if(err){
//         console.log(`mysql连接失败: ${err}!`);
//     }else{
//         console.log("mysql连接成功!");
//     }
// });




module.exports = connection;