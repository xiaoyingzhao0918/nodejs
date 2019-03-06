//前台路由=>（功能跟用户user相关）

var express = require('express')   //引入路由模块
var router = express.Router()    //创建路由的实例

//前台注册接口
router.post('/reg',(req,res)=>{
    console.log(req.body);
    res.send('前台home reg ok')
})

//前台登录接口
router.post('/login',(req,res)=>{
    res.send('home login ok')
})


module.exports = router   //抛出路由模块