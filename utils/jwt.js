/*
无状态请求  保证用户的登录状态=>有两种方案
1、服务器端的session + 前端的cookie
2、jwt jsonWebToken =>是目前最流行的跨域身份验证解决方案
  用户登录=> 服务器端产生一个token(加密字符串)(Json对象) =>发送给前端
    前端将token 进行保存   (服务器不保存任何会话数据，即服务器变为无状态，使其更容易扩展。)
    前端发起数据请求(jq的ajax请求)的时候携带token
    服务器端 验证token 是否合法 => 如果合法则继续操作 不合法则终止操作
    
token的使用场景  无状态请求  保证用户的登录状态 第三方登录(微博、扣扣登陆)(token+auth2.0)

先下载第三方插件 $ npm install jsonwebtoken

var jwt = require('jsonwebtoken');  //引入jsonwebtoken插件
const fs=require('fs');
const path=require('path');

let palyload={'id':'用户id'}        //载荷(json对象格式)
let secret='zxy_wx';   //密钥    

一、hash加密   加密格式：hs256 (加密和解密都是同一密钥串，任意字符串 保存在服务器端) 
1、服务器生成token =>通过签名，密钥加密palyload                  
var token = jwt.sign(palyload,secret); //为防止用户篡改数据，在生成token时添加签名=>jwt.sign();参数:1 palyload(json对象格式);2 密钥(任意)
console.log(token);
=>eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IueUqOaIt2lkIiwiaWF0IjoxNTUxNzAzOTkzfQ.ci1xVkas2IznKCKbYMzEBSniKUgr5Gic5G0WxfwsRtQ
2、(当前端每次携带token请求的时候) 服务器验证token是否合法，并密钥解密token =>decoded
var decoded = jwt.verify(token, secret);  //jwt.verify()参数：1:前端携带的token； 2：自设的密钥
console.log(decoded) //输出解码的
=>{ id: '用户id', iat: 1551704388 }



二、非对称加密 通过私钥产生token 再通过公钥解密token
产生公钥和私钥的命令行指令：
产生私钥：openssl genrsa -out ./private_key.pem 1024  //将私钥保存在./private_key.pem(相对路径)文件中 （1024代表私钥长度）
产生公钥：openssl rsa -in ./private_key.pem -pubout -out ./public_key.pem  //将公钥保存在./public_key.pem文件中

1、读取私钥和公钥
let private_key=fs.readFileSync(path.join(__dirname,'./private_key.pem'))
let public_key=fs.readFileSync(path.join(__dirname,'./public_key.pem'))
2、服务器生成token=>通过签名，私钥加密palyload
var token=jwt.sign(palyload,private_key,{algorithm:'RS256'})
console.log(token);
=>eyJhbGciOiJSUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IueUqOaIt2lkIiwiaWF0IjoxNTUxNzA2NDM3fQ.N7VURTYtC-A2RBXDTTc9CubTVnLHe91UrmEW539z2KfOGVYRJezUffMB3pHLsYXpRqyJNirdrX0U8Y7sJkJAq-HvsSi1dZUrK-FyD53fuVmQ7kRXKsaQVtd4FKstFvLjHktMGu-DaHv87zbKY-CdLpRc5Rk6o_a75lvpdpGVZY8
3、服务器验证token是否合法 并公钥解密token=>decoded
var decoded=jwt.verify(token,public_key);
console.log(decoded);
*/


/*
一、hash加密   加密格式：hs256 (加密和解密都是同一密钥串，任意字符串 保存在服务器端) 
引入jwt模块
载荷playload：需要传递的数据信息
let token=jwt.sign(载荷，密钥串)
验证token是否合法
jwt.vertify('需要验证的token信息'，'密钥串')

二、非对称加密 通过私钥产生token 再通过公钥(由私钥产生)解密token
let token=jwt.sign(载荷，私钥，{RS256})
jwt.vertify('需要验证的token信息'，公钥)

*/


//封装成模块
const jwt=require('jsonwebtoken');
const secret='zxy_wx'    //任意密钥串
function creatToken(palyload){   //生成token
    palyload.ctime=Date.now();   //生成token的时间戳
    return jwt.sign(palyload,secret)
}
function checkToken(token){    //验证token
    return new Promise((resovle,reject)=>{
        jwt.verify(token,secret,(err,data)=>{
            if(err){reject('token 验证失败')}
            resovle(data);
        })
    })
}
//将模块抛出去
module.exports={
    creatToken,checkToken
}
