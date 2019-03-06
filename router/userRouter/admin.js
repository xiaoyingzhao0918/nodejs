//后台(管理平台)路由=>（功能跟用户user相关）

var express = require('express')   //引入express模块
var router = express.Router()    //创建路由的实例

const userModel=require('../../db/model/userModel')   //引入db/model文件夹中的userModel.js模块(=>数据模型user)
const jsonWebToken=require('../../utils/jwt');  //引入utils文件中的jwt.js模块

//后台注册接口
router.post('/reg',(req,res)=>{
    console.log(req.body);   //获取数据(用户浏览器输入的url中的数据)
   
    //对数据模型(users)执行增删改查操作（=>进行数据库操作）
    userModel.insertMany({name:'wangxiao',pass:798})  //向数据库中的数据模型(集合)users中添加一条数据(对象格式)
    .then((data)=>{
        res.send('admin reg ok')
    })
    .catch((err)=>{
        console.log(err)
        res.send('注册失败')
    })
})


//后台登录接口(获取后端产生的token，并返回给前端)
router.post('/login',(req,res)=>{
    let token=jsonWebToken.creatToken({id:'这里是用户的id'})  //调用jsonWebToken模块的creatToken()方法
    res.send({code:0,msg:'login ok',data:{token}})   //将token返回前端
})

//验证token接口
router.post('/test',(req,res)=>{
    console.log(req.body.token);    //获取前端传递的数据中的token值
    if(!req.body.token){return res.send({code:-5,msg:'token 缺失'})}
    jsonWebToken.checkToken(req.body.token)  //调用jsonWebToken模块的checkToken()方法
    .then(()=>{
        res.send({code:0,msg:'check ok'})   
    })
    .catch(()=>{
        res.send({code:-999,msg:'token 验证失败请重新登录'})
    })   
})



module.exports = router   //抛出路由模块