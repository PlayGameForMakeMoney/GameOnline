const http = require("http");
const fs = require("fs");

const server = http.createServer((req,res)=>{

// ---------------- SAVE BALANCE ----------------
if(req.method==="POST" && req.url==="/updateBalance"){

let body="";

req.on("data",chunk=>{
body+=chunk;
});

req.on("end",()=>{

const data = JSON.parse(body);

const file = JSON.parse(fs.readFileSync("data.json","utf8"));

file.user.demo = data.demo;
file.user.live = data.live;

fs.writeFileSync("data.json",JSON.stringify(file,null,2));

res.writeHead(200,{"Content-Type":"text/plain"});
res.end("saved");

});

return;
}

// ---------------- GET BALANCE ----------------
if(req.method==="GET" && req.url==="/getBalance"){

const file = JSON.parse(fs.readFileSync("data.json","utf8"));

res.writeHead(200,{"Content-Type":"application/json"});
res.end(JSON.stringify(file.user));

return;
}

// ---------------- 404 ----------------
res.writeHead(404,{"Content-Type":"text/plain"});
res.end("Not Found");

});

server.listen(3000,()=>{
console.log("Server running on port 3000");
});