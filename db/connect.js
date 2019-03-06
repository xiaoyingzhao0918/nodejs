
//连接数据库(自建的zxy)=>mongoose插件

var mongoose = require('mongoose');   //引入mongoose模块=>连接数据库

//1、mongoose连接数据库zxy
mongoose.connect('mongodb://localhost:27017/zxy');   //(mongodb默认占用的端口号是27017); zxy：表示要关联的数据库；

var db = mongoose.connection;   //获取连接对象进行监听

db.on('error',(err)=>{
    console.log('连接错误');
});
db.once('open', function() {
    console.log('连接ok')
});
