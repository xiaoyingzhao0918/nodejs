//发送邮箱验证码的一个自定义模块mail.js (用promise解决异步函数send()的回调)

const nodemailer = require("nodemailer");   //引入nodemailer插件模块



//创建邮件发送方对象，即创建发送邮箱验证码的请求对象(transporter)
  let transporter = nodemailer.createTransport({
    //在node_modules/nodemailer/lib/well-known/serverces.json中查看
    host: "smtp.qq.com",    //发送方的邮箱服务器
    port: 465,          //qq邮箱端口号 
    secure: true, // true for 465, false for other ports
    auth: {
      user: '1650377149@qq.com', //发送方邮箱账户(自己的)
      pass: 'wirulahonopiciig' //发送方邮箱的安全密码  （pop3、smtp生成的授权码）
    }
  });



//实现发送邮箱验证码的功能=>方法send()

function send(toMail,code,cb){   //参数toMail:接收方邮箱地址；code：发送的邮箱验证码；cb回调函数
  return new Promise((resolve,reject)=>{
    
      //发送的内容
      let mailOptions = {
          from: '"Fred Foo 👻" <1650377149@qq.com>', // 发送方邮箱地址(自己的)
          to: toMail, // 接收方们的邮箱地址
          subject: "1709注册验证码", // Subject line
          text: `欢迎注册，你的验证码是${code};5分钟有效`, // plain text body
      };

      //发送邮件 调用transporter对象的sendMail(发送的信息，fn)方法；
      transporter.sendMail(mailOptions,(err,info)=>{  
          console.log(err);
          console.log(info);
          if(err){ //如果失败
              reject();     
          }else{  //成功
              resolve();
         }
      })
  })
}

//send('1650377149@qq.com',12345);
module.exports={send};   //将send(对象)模块抛出去
