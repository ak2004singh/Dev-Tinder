const socket  = require("socket.io");
const initializeSocket = (server)=>{
    console.log("hit the triger");
    const io = socket(server,{
        cors:{
            origin:"http://localhost:5173",
        },
    });
    io.on("connection",(socket)=>{
        socket.on("joinChat",({firstName,userId,targetId})=>{
            const roomId = [userId,targetId].sort().join('_');
            console.log(`${firstName} connected to the rrom with id  ${roomId}`);
            socket.join(roomId);
        });
        socket.on("sendMessage",()=>{});
        socket.on("disconnect",()=>{});
    });
}
module.exports  = initializeSocket;