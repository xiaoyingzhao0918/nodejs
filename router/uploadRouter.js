/*实现功能： 文件上传 
前端：
    1、通过<input type='file'> 文件域  =>获取文件
    2、将获取的文件信息转化为formdata数据格式   注意key值的前后端同一
    3、通过(jquery)ajax进行上传 
        文件上传数据不需要缓存
        文件上传的数据类型 不需要jquery进行默认格式处理(contentype:false)
后端：
    1、获取前端上传的文件数据(formdata数据格式)
        通过第三方插件获取 multer（$ npm insatll multer）
        { fieldname: 'hehe',  //上传数据的key值
        originalname: '35D8710927EF6526B97B9C4BCDEAB574.jpg',
        encoding: '7bit',
        mimetype: 'image/jpeg',
        destination: 'uploads/',  //临时路径
        filename: 'bc1aff4a59bd2122f501444c28675c29',
        path: 'uploads\\bc1aff4a59bd2122f501444c28675c29',
        size: 23847 }
    2、将文件数据进行处理
    3、将文件数据写入本地
*/

var express = require('express')   //引入express模块
var router = express.Router()    //创建路由的实例

const fs=require('fs');
const path=require('path');

var multer  = require('multer')  //引入multer模块
var upload = multer({ dest: 'uploads/' })  //指定上传的缓存目录
//1、文件(图片)上传接口'/img' => 获取前端上传的文件数据(formdata数据格式)
router.post('/img',upload.single('hehe'),(req,res)=>{    //upload.single()单文件上传；参数：为上传的文件(图片)的key值(postman上传的时候key值必须写该参数)
    console.log(req.file);     //输出上传的文件信息
    /* { fieldname: 'hehe',  //上传数据的key值
        originalname: '35D8710927EF6526B97B9C4BCDEAB574.jpg',
        encoding: '7bit',
        mimetype: 'image/jpeg',
        destination: 'uploads/',  //临时路径
        filename: 'bc1aff4a59bd2122f501444c28675c29',
        path: 'uploads\\bc1aff4a59bd2122f501444c28675c29',
        size: 23847 }
    */

    //2、根据将文件(图片)信息，将数据进行处理
     //2.1、限制图片后缀名：只允许后缀名为png jpg jpeg gif的文件图片上传：
    let mimetype=req.file.mimetype;  //获取文件图片的格式
    let ext=mimetype.split('/')[1];  //获取图片格式的后缀名
    if(['jpg','png','gif','jpeg'].indexOf(ext)==-1){
        return res.send({code:-2,msg:'非法格式'});  //返回前端的数据
    }
     //2.2、限制文件(图片)大小(通过文件信息中的size进行设置  省略)
    //3、读取文件(图片)并将文件写入本地
    let imgPath=req.file.path;  //获取图片路径
    let name=(new Date()).getTime()+parseInt(Math.random()*100000);   //文件(图片)名必须不重复
    fs.readFile(imgPath,(err,data)=>{   //读取该路径下的文件(图片)=>data
        if(err){return res.send({code:-1,msg:'上传失败'})}
        //再将文件(图片)写入静态目录public下的img文件中(图片名：${name}.${ext})
        fs.writeFile(path.join(__dirname,`../public/img/${name}.${ext}`),data,'binary',(err)=>{   
            if(err){return res.send({code:-1,msg:'上传失败'})}
            //向前端返回数据，包括该图片的路径(不返域名和主机地址，只返相对路径，在前端再进行绝对路径的拼接)
            let url=`/public/img/${name}.${ext}`;
            return res.send({code:0,msg:'上传图片ok',data:url}) 
        })
    })

})

module.exports=router;






