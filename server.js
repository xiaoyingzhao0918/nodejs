//搭建一个node api服务器=>express插件(相比较简单)
//写一些api接口


/****** 入口文件***********/
const express = require('express');  //引入express插件
const app = express()    //做一个express实例化

/*******基本插件 **********/
const con=require('./db/connect');   //引入db文件中的connect.js模块（功能用于连接数据库）
const path=require('path');  //引入path模块
const mail=require('./utils/mail');   //引入utils文件中的mail.js文件模块
const utils=require('./utils/util')   //引入utils文件中的util.js模块


/********静态目录，开启静态文件 ************/
app.use('/public', express.static(path.join(__dirname, 'public')))//静态目录 (浏览器输入localhost:3000/public/html就能访问到public文件夹中的html页面)

/********** 解析前端post请求传递的数据格式************/
const bodyParser = require('body-parser');   //引入body-parser插件
app.use(bodyParser.json())   //解析前端post方法传递的json格式的数据；
app.use(bodyParser.urlencoded({extended:true}))   //解析前端post方法传递的urlencoded(form表单)格式的数据


/*********** 路由配置 ************/
//1、路由引入（功能跟用户user登录注册相关）
const home=require('./router/userRouter/home')  //引入./router/userRouter文件中的home.js模块=>前台路由
const admin=require('./router/userRouter/admin')  //引入./router/userRouter文件中的admin.js模块=>后台(管理台)路由
app.use('/home/user/',home)  //使用前台路由home.js模块；  
//当用户前端(postman)输入localhost:3000/home/user/login(或/reg)时，会先匹配/home/user=>确认是(实现用户功能的)前台登录;然后调用前台路由home模块，在home.js模块中匹配/login；最后返回给前端数据
app.use('/admin/user/',admin)    //使用后台路由admin.js模块
//当用户前端(postman)输入localhost:3000/admin/user/login(或/reg)时，会先匹配/admin/user=>确认是(实现用户功能的)后台登录;然后调用后台路由admin模块，在admin.js模块中匹配/login；最后返回给前端数据

//2、路由引入(功能跟文件上传有关)
const adminUpload=require('./router/uploadRouter');  //引入uploadRouter.js模块
app.use('/admin/upload',adminUpload);  //使用路由adminUpload模块
//前端输入localhost:3000/admin/upload/img时，先匹配/admin/upload=>确认是上传文件；然后调用路由adminUpload模块，在该模块中匹配/img；最后返回给前端数据

//3、路由引入(功能跟食物管理有关)
const adminFood=require('./router/foodRouter/admin');   //引入router/foodRouter文件中的admin.js模块
app.use('/admin/food/',utils.verify,adminFood);  //使用路由adminFood模块
//前端输入localhost:3000/admin/food/add；先匹配/admin/food=>确认功能；再调用adminFood模块，在该模块匹配/add接口；





/************* API接口 **************/
//token验证接口
app.post('/test', utils.verify,(req,res)=>{
   
    res.send({code:0,msg:'验证ok'})
})

//获取邮箱验证码'/getEmailCode'接口
let checks={};     //用于保存邮箱账号和对应的验证码；=>服务器端的缓存一般为redis、memache
app.post('/getEmailCode', (req, res) =>{    //=>注册的接口(get()或post()方法)=>验证接口'/getEmailCode'
    //console.log(req.body)      //输出请求url中的body的值（前端用户post传递的数据）{email:'1650377149@qq.com'}
    let {email}=req.body;      //解构化赋值=>email=req.body.email；获取用户post传递的数据body中email的值(接收者邮箱地址)
    //防止薅羊毛；将邮箱email记录 在数据库；每访问一次count++ <10;终止前端的请求
    let code=parseInt(Math.random()*100000) //随机验证码
    checks[email]=code;    //将code保存在checks对象中 {email(接收者邮箱地址)：code}
    mail.send(email,code)     //调用mail模块中send()方法;=>将随机验证码code发送给用户邮箱email
    .then(()=>{  //成功；发送给用户的信息
        res.send({code:0, msg:"获取验证码ok" })
    }) 
    .catch(()=>{  ///出错;发送给用户错误信息（code表状态码，msg表返回的信息）
        res.send({code:-1, msg:"获取验证码失败" })
    })
      
})

//用户注册接口'/reg'
app.post('/reg', (req, res) =>{    //=>注册的接口(get()或post()方法)=>验证接口'/reg'
    //console.log(req.body) //(前端用户post传递的数据)req.body:{email:'1650377149@qq.com',ps:'123',code:'从收件箱查看'}
    let {email,ps,code}=req.body; //=>解构赋值；获取用户post传递url的数据body中email、ps、code的值
    //验证用户输入的验证码code是否正确
    console.log(checks);   //checks={email(接收者邮箱):code(之前发送给用户的验证码)}
    if(checks[email]==code){  //用户输入的验证码正确
        //将账号密码存入数据库省略
        res.send({code:0, msg:"注册ok" })
    }else{
        res.send({code:-1, msg:"验证码错误请重试" })
    }
    res.send('register ok')    //回复用户的信息 注册ok  （返回前端浏览器)
})

//用户登录接口'/login'（分别为get和post）
app.get('/login', (req, res) =>{    //=>登录的接口(get()或post()方法)
    console.log(req.query)     //输出请求url中的query的值（前端用户get传递的数据）
    res.send('login ok')    //回复用户的信息 登录ok  （返回前端浏览器)
})
app.post('/login', (req, res) =>{    //=>登录的接口(get()或post()方法)
    console.log(req.body)     //输出请求url中的body的值（前端用户post传递的数据）
    res.send('login ok')    //回复用户的信息 登录ok  （返回前端浏览器)
})




app.listen(3000, () => { //启动服务器；且服务器监听的端口号设是3000(即在浏览器输入http://localhost:3000才能找到主机里运行的该程序)；
    console.log('api服务器启动 port:' + 3000)
})