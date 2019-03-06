//数据模型（功能跟用户操作相关）
/*node的mongoose插件操作数据库
    3. 创建schema对象
    4. 将schema对象转换为数据模型   
    将该文件作为模块抛出去；(在router下的文件中进行引入)
    5. 对数据模型(users)执行增删改查操作(进行数据库操作) => 在路由文件（router/userRouter/admin.js或home.js）中进行 
*/

var mongoose = require('mongoose');   //引入mongoose模块
//2、创建 schema对象(理解成一个表头)=>UserSchema
var UserSchema = new mongoose.Schema({
    name:{type:String,required:true},     //required:不能空
    pass:{type:String,required:true},
    age:{type:String, default:25}        //default:默认值
});

//3、将schema对象转换为数据模型(users)
let users = mongoose.model('users', UserSchema); //参数1(user)(自动在数据库创建成复数形式users)：是集合的名字; 参数2(UserSchema)：与数据模型关联的schema对象

module.exports=users;   //将该文件作为模块抛出去；(在router下的文件中进行引入)

//4、对数据模型(users)执行增删改查操作（进行数据库操作）=>=> 在路由文件（router/userRouter/admin.js或home.js）中进行 