//创建一个socket服务器(用ws模块)

const WebSocket = require('ws')  //引入ws模块
const ws = new WebSocket.Server({ port: 8080 },()=>{ //开启一个socket服务器  监听端口号为8080  即在前端必须输入localhost:8080/
    console.log('socket服务器开启')
})


let clients = []   //客户端(前端)数组

//只要有一个前端(客户端)连接上，就触发connection事件
ws.on('connection', (client) => {   //client表连接上的客户端对象
    console.log('客户端连接');   

    clients.push(client);  //将每个client对象存入clients数组
    //服务器端主动发给前端(client)的消息 
    client.send('欢迎光临');  

    //当服务器端收到前端client消息时触发messag事件
    client.on('message', (msg) =>{  //msg为服务器端收到的前端(client)发送过来的消息
        console.log(msg);
        // if(msg=='push'){
        //     pushMsg();  //调用pushMsg()函数
        // }
    })

    client.on('close', () => {
        delete clients[client.name]
        console.log(client.name + ' 离开了~')
    })
})


//服务器端(向每个前端)推送消息
function pushMsg(msg){
    for (let index = 0; index < clients.length; index++) {
        clients[index].send(msg)       //给每个client推送消息msg  
    }
}

module.exports={pushMsg}  //将该文件socket-server.js作为一个模块抛出去； 同时抛出去该模块中的方法pushMsg()