const express = require("express");
const http = require('http');
const {Server} = require("socket.io");
const {getIPAddress} = require("./utils");

const app = express();
const server = http.createServer(app);
const io = new Server(server);

app.use(express.static('public'));

app.get("/", (req, res)=>{
    res.sendFile("index.html")
})


users = {}
usersOnline = 0;


io.on("connection", (socket)=>{
    
    io.emit("user-count", usersOnline);

    socket.on("new-user-join", (name)=>{
        users[socket.id] = name;
        usersOnline++;
        io.emit("new-user-join", users[socket.id]);
        io.emit("user-count", usersOnline);
    })

    socket.on("message", (message)=>{
        socket.broadcast.emit("message", {name: users[socket.id], message: message});
    })

    socket.on("disconnect", () => {
        if (users[socket.id]) {
            io.emit("user-left", users[socket.id]);
            delete users[socket.id];
            usersOnline--;
            io.emit("user-count", usersOnline);
        }
    });

})



PORT = 8000;
IP = "0.0.0.0";

server.listen(PORT, IP, ()=>{
    console.log(`Server running at ${IP}:${PORT}`)
})

