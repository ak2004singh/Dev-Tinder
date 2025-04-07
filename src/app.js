const express  = require("express");
const app =express();

app.use((req,res)=>{
    res.send("hello this time i made a server myself");
});
app.listen(4000);