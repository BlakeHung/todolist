// 小步測試
const http = require ('http');
const { v4: uuidv4 } = require('uuid');
const errHandle = require('./errorHandle');
const todos = [];

const requestListener = (req, res) => {
    console.log(req.url);
    console.log(req.method);
    const headers = {
        'Access-Control-Allow-Headers': 'Content-Type, Authorization, Content-Length, X-Requested-With',
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'PATCH, POST, GET,OPTIONS,DELETE',
        'Content-Type': 'application/json'
    }
    let body = "";
    let nums = 0;
    req.on('data', chunk => {
        console.log(chunk)
        body+= chunk;
    })
    if(req.url=='/todos' && req.method == 'GET') {
        res.writeHead(200,headers);
        res.write(JSON.stringify({
            "status": "success",
            "data": todos,
        }));
        res.end();
    } else if(req.url=='/todos' && req.method == 'POST') {
        req.on('end', ()=>{
            try{
                const title = JSON.parse(body).title;
                if(title !== undefined){
                    const todo = {
                        "title" : title,
                        "id": uuidv4()
                    }
                    todos.push(todo);
                    res.writeHead(200,headers);
                    res.write(JSON.stringify({
                        "status": "success",
                        "data": todos,
                    }));
                    // console.log(JSON.parse(body).title);
                    res.end();
                } else {
                    errHandle(res)
                }
            }catch(error){
                errHandle(res)
            }
        })
    }else if(req.url=='/todos' && req.method == 'OPTIONS') {
        res.writeHead(200,headers);
        res.end();
    } else if (req.url.startsWith('/todos/') && req.method == 'PATCH') {
        req.on('end',()=>{
            try{
                const todo  = JSON.parse(body).title;
                const id = req.url.split('/').pop();
                const index = todos.findIndex(element=> element.id == id)
                if(todo !== undefined && index !== -1) {
                    todos[index].title = todo
                    res.writeHead(200,headers);
                    res.write(JSON.stringify({
                        "status": "success",
                        "data": todos,
                    }));
                    res.end();
                } else{
                    errHandle(res);
                }
            } catch{
                errHandle(res);
            }
        })
    }else if (req.url.startsWith("/todos/") && req.method == "DELETE"){
        const id = req.url.split('/').pop();
        const index = todos.findIndex(element => element.id == id);
        console.log(id, index)
        if (index !== -1) {
            todos.splice(index, 1)
            res.writeHead(200,headers);
            res.write(JSON.stringify({
                "status": "success",
                "data": todos,
            }));
            res.end();
        } else {
            errHandle(res);
        }
    } else {
        res.writeHead(200,headers);
        res.write("not found");
        res.end();
    }
}
const server = http.createServer(requestListener);
server.listen(3005)
// console.log('hello world')