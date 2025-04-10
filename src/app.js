const express = require("express");
const {connectDB} = require("./config/database");
const User = require("./models/user");
const app = express();
app.use(express.json());
app.get("/user",async(req,res)=>{
    try{
        const user = await User.find({email:req.body.email,password:req.body.password});
        if(user.length === 0){
            res.status(404).send("User not found");
            console.log("User not found");
        }
        else 
        {res.send(user);
        console.log("User fetched successfully");}
    }
    catch(err){
        res.status(404).send("Error in fetching users");
        console.log(err);
    }
});
app.post("/signup",async (req,res)=>{
   
    try{
        const user = new User(req.body);
        await user.save();
        res.send("Congratulations! You have signed up successfully");
        console.log("User signed up successfully");
    }
    catch(err){
        res.status(400).send("Error in signing up user");
        console.log(err);
    }
});
app.patch("/user/:userId",async(req,res)=>{
    const updatData = req.body;
    const userId = req.params?.userId;
    try{
        const changableData = ["password","gender","age","phone","bio","skills","location","project1","image"];
        const isValidOperation = Object.keys(updatData).every((key)=>changableData.includes(key));
        if(isValidOperation)
        {
            const updatedUser = await User.findByIdAndUpdate(userId,updatData,{
                new:true,
                runValidators:true
            });
            if(!updatedUser)
            {
                res.status(404).send("User not found");
                console.log("User not found");
            }
            else 
            {
                res.send("User  Data updated successfully");
                console.log("User data updated successfully",updatedUser);
            }
        }
        else 
        {
            res.status(400).send("Invalid update operation");
            console.log("Invalid update operation");
        }
    }
    catch(err){
        res.status(400).send("Error in updating user data");
        console.log(err);
    }
});
app.delete("/user",async(req,res)=>{
    const userId = req.body._id;
    try{
        const deletedUser = await User.findByIdAndDelete(userId);
        if(!deletedUser){
            res.status(404).send("User not found");
            console.log("User not found");
        }
        else 
        {
            res.send("User deleted successfully");
            console.log("User deleted successfully");
        }
        
    }
    catch(err){
        res.status(400).send("Error in deleting user data");
        console.log(err);
    }
});
connectDB().
then(()=>{
    console.log("Connected to DB");
    app.listen(3000);
})
.catch((err)=>{
    console.log(err);
});