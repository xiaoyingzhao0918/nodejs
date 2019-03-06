//数据模型（功能跟食物操作相关）
/*node的mongoose插件操作数据库
    3. 创建schema对象
    4. 将schema对象转换为数据模型   
    将该文件作为模块抛出去；(在router下的文件中进行引入)
    5. 对数据模型(users)执行增删改查操作(进行数据库操作) => 在路由文件（router/userRouter/admin.js或home.js）中进行 
*/

var mongoose = require('mongoose');   //引入mongoose模块
//2、创建 schema对象(理解成一个表头)
var FoodSchema = new mongoose.Schema({
    name:{type:String,required:true},     //required:不能空
    price:{type:Number,required:true},
    imgPath:{type:String,required:true},  //图片路径
    desc:{type:String,required:true},    //描述
    type:{type:String,required:true},
    num:{type:Number, required:true}        //default:默认值
});

//3、将schema对象转换为数据模型(foods)
let foods = mongoose.model('foods', FoodSchema); //参数1(foods)(自动在数据库创建成复数形式foods)：是集合的名字; 参数2(FoodSchema)：与数据模型关联的schema对象

module.exports=foods;   //将该文件作为模块抛出去；(在router下的文件中进行引入)

//4、对数据模型(foods)执行增删改查操作（进行数据库操作）=>=> 在路由文件（router/foodRouter/admin.js）中进行 