//项目的配置文件(将console.log()换成utils.log();)

//=>为了在项目上线的时候,在命令行或控制台不显示一些‘给自己看的console.log()的内容’;
//需要在项目所有文件中引入该utils模块，将该文件中的所有给自己看的console.log()换成utils.log();=> 项目上线后一些内容在执行后命令行就不会输出；

const config=require('../config');  //引入config模块
const jsonWebToken=require('./jwt');   //引入jwt.js模块

let utils={
    log:function(msg){       //console.log()的封装
        if(!config.debug){return false}   
        console.log(msg)       
    },
    
    sendRes:function(err,msg,data){    //返回给前端数据(res.send())的封装
        let obj={
            err:err,
            msg:msg,
            data:data || null
        }
        res.send(obj);
    },

    //验证token合法，以及token是否超过有效期（该模块中的该方法verify()作为server.js中测试接口'/test'的中间件进行调用）
    verify:function(req,res,next){ 
        console.log(req.body.token);    //获取前端传递的数据中的token值
        let {token}=req.body;
        if(!token){res.send({code:-998,msg:'token 缺失'})}
        jsonWebToken.checkToken(token)  //调用jsonWebToken模块的checkToken()方法
        .then((data)=>{   //验证token成功，再进行时间验证，再调用next()
            console.log(data)
            //时间验证(设置过期时间)
            if(Date.now()-data.ctime >=7200000){   //data.ctime为token生成时的时间
                res.send({code:-997,msg:'token超时 重新登录'})
            }else{
                next();     //因该方法作为中间件，next()用于进行server.js中测试接口'/test'中的后续方法
            }          
        })
        .catch((err)=>{
            res.send({code:-999,msg:'token 验证失败请重新登录'})
        })   
    }
}
module.exports=utils;   //抛出去utils模块
