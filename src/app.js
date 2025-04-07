const express  = require("express");
const app =express();
app.get("/user",(req,res)=>{
    res.send({firstname:"Aditya",lastname:"Singh"});
});
app.post("/user",(req,res)=>{
    console.log("data saved to the data base successfully");
    res.send({status:"success"});
});
app.listen(4000);