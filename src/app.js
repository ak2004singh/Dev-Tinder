const express = require("express");
const {connectDB} = require("./config/database");
const User = require("./models/user");
const app = express();
app.use(express.json());
app.get("/user",async(req,res)=>{
    try{
        const user = await User.find({email:req.body.email});
        res.send(user);
    }
    catch(err){
        res.status(404).send("Error in fetching users");
        console.log(err);
    }
})
app.post("/signup",async (req,res)=>{
   
    const user = new User(req.body);
    await user.save().
    then(()=>{
        res.send("Account Created Successfully");
    })
    .catch((err)=>{
        res.status(400).send("Error in creating account");
        console.log(err);
    });
});
connectDB().
then(()=>{
    console.log("Connected to DB");
    app.listen(3000);
})
.catch((err)=>{
    console.log(err);
});