
//管理平台(后台)路由=>（功能跟食物food相关）

var express = require('express')   //引入express模块
var router = express.Router()    //创建路由的实例

const foodModel=require('../../db/model/foodModel')   //引入db/model文件夹中的foodModel.js模块(=>数据模型foods)

//1、添加食品    
/*
method：post
url:接口'/addFood' 
parms:name,price,imgPath,desc,type,num
*/
router.post('/addFood',(req,res)=>{
    //接收数据
    let {name,price,imgPath,desc,type,num}=req.body;   //解构赋值
    //将数据插入数据库（对数据模型(foods)执行增删改查操作）
    foodModel.insertMany({name,price,imgPath,desc,type,num})
    //返回数据
    .then((data)=>{   
        res.send({code:0, msg:'add ok'})
    })
    .catch((err)=>{
        console.log(err);
        res.send({code:-1, msg:'add fail'})
    }) 
})

//2、查询食品 =>分页查询 模糊查询  分类查询  排序
/*
 method：post
 url:接口'/getFood' 
*/
router.post('/getFood',(req,res)=>{
    //查询数据（对数据模型(foods)执行增删改查操作）
    foodModel.find()
    //返回数据
    .then((data)=>{      //data为数据库返回的查询的数据
        console.log(data);   
        res.send({code:0, msg:'select ok',data:data})
    })
    .catch((err)=>{
        console.log(err);
        res.send({code:-1, msg:'select fail'})
    }) 
})
//2、通过_id查询食品 
/*
 method：post
 url:接口'/getFoodById' 
 parms:_id
*/
router.post('/getFoodById',(req,res)=>{
    //查询数据（对数据模型(foods)执行增删改查操作）
    let {_id}=req.body;
    foodModel.find({_id})    //根据_id值查询数据
    //返回数据
    .then((data)=>{      //data为数据库返回的查询的数据
        console.log(data);   
        res.send({code:0, msg:'select ok',data:data})
    })
    .catch((err)=>{
        console.log(err);
        res.send({code:-1, msg:'select fail'})
    }) 
})
//2、分类查询(通过_id查询食品) 
/*
 method：post
 url:接口'/getFoodById' 
 parms:type
*/
router.post('/getFoodByType',(req,res)=>{
    //查询数据（对数据模型(foods)执行增删改查操作）
    let {type}=req.body;
    foodModel.find({type})   //根据type值查询数据
    //返回数据
    .then((data)=>{      //data为数据库返回的查询的数据
        console.log(data);   
        res.send({code:0, msg:'select ok',data:data})
    })
    .catch((err)=>{
        console.log(err);
        res.send({code:-1, msg:'select fail'})
    }) 
})
//2、模糊查询(通过关键字查询食品) 
/*
 method：post
 url:接口'/getFoodByKw' 
 parms:keyword
*/
router.post('/getFoodByKw',(req,res)=>{   
    let {keyword}=req.body;  //获取前端传递的关键字
    let reg=new RegExp(keyword)
    //查询数据（对数据模型(foods)执行增删改查操作）
    foodModel.find( { $or:[ {name:{$regex:reg}}, {desc:{$regex:reg}} ] } )   //根据name或desc中的关键字进行模糊查询数据
    //返回数据
    .then((data)=>{      //data为数据库返回的查询的数据
        console.log(data);   
        res.send({code:0, msg:'select ok',data:data})
    })
    .catch((err)=>{
        console.log(err);
        res.send({code:-1, msg:'select fail'})
    }) 
})
//2、通过页码查询食品 
/*
 method：post
 url:接口'/getFoodByPage' 
 parms:
*/
router.post('/getFoodByPage',(req,res)=>{
    //获取前端传递的数据
    let page=req.body.page || 1;   //page当前页(默认设是1)
    let pageSize=req.body.pageSize || 3    //pageSize每页显示数据的个数(默认设是3)
    let result={count:0,lists:[]}       
    //查询数据（对数据模型(foods)执行增删改查操作）
    foodModel.find()
    .then((data)=>{
        result.count=data.length;    //获取数据库数据的总条数
        return foodModel.find().skip(Number((page-1)*pageSize)).limit(Number(pageSize))  //分页 每页显示pageSize条数据
    })
    //返回数据
    .then((data)=>{      //data为数据库返回的查询的数据
        console.log(data);   
        res.send({code:0, msg:'get ok',data:data})
    })
    .catch((err)=>{
        console.log(err);
        res.send({code:-1, msg:'get fail'})
    }) 
})



//3、修改食品 
/*
 method：post
 url:接口'/updataFood' 
 parms:_id,name,price,imgPath,desc,type,num
*/
router.post('/updataFood',(req,res)=>{
    //获取前端发送的数据
    let _id=req.body._id;
    let {name,price,imgPath,desc,type,num}=req.body;   //解构赋值
    //修改数据（对数据模型(foods)执行增删改查操作）
    foodModel.updateOne({_id:_id},{name,price,imgPath,desc,type,num})
    //返回数据
    .then((data)=>{      
        res.send({code:0, msg:'updata ok'})
    })
    .catch((err)=>{
        console.log(err);
        res.send({code:-1, msg:'updata fail'})
    }) 
})

//4、删除食品 =>单独删除  批量删除 
/*
 method：post
 url:接口'/delFood' 
 parms: _id
*/
router.post('/delFood',(req,res)=>{
    //获取前端发送的数据
    let _id=req.body._id;
    //删除数据（对数据模型(foods)执行增删改查操作）
    foodModel.remove({_id:_id})  //只根据参数_id删除数据
    //返回数据
    .then((data)=>{    
        console.log(data)  
        res.send({code:0, msg:'del ok'})
    })
    .catch((err)=>{
        console.log(err);
        res.send({code:-1, msg:'del fail'})
    }) 
})


module.exports = router   //抛出路由模块

