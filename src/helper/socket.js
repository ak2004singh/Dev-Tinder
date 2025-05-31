const socket  = require("socket.io");
const crypto = require("crypto");
const get = (userId,targetId)=>{
    return crypto.createHash("sha256").update([userId,targetId].sort().join('_')).digest("hex")
}
const initializeSocket = (server)=>{
    const io = socket(server,{
        cors:{
            origin:"http://localhost:5173",
        },
    });
    io.on("connection",(socket)=>{
        socket.on("joinChat",({firstName1,userId,targetId})=>{
            const roomId =get(userId,targetId) ;
            console.log(`${firstName1} connected to the rrom with id  ${roomId}`);
            socket.join(roomId);
        });
        socket.on("sendMessage",({firstName1,userId,targetId,text})=>{
            const roomId =get(userId,targetId) ;
            console.log("redy to send message");
            console.log(firstName1+" "+text);
            io.to(roomId).emit("messageReceived",{firstName1,text});
        });
        socket.on("disconnect",()=>{});
    });
}
module.exports  = initializeSocket;