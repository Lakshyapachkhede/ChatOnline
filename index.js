const express = require("express");
const http = require('http');
const {Server} = require("socket.io");
require('dotenv').config();



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
    console.log("new user connect")

    socket.on("new-user-join", (name)=>{
        users[socket.id] = name;
        usersOnline++;
        io.emit("new-user-join", users[socket.id]);
        io.emit("user-count", usersOnline);
    })

    socket.on("message", (message)=>{
        if (users[socket.id] != undefined)
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



const PORT = process.env.PORT || 3000;

server.listen(PORT, "192.168.79.37",()=>{
    console.log(`Server running at ${PORT}`)
})

