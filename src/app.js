const express = require("express");
const {connectDB} = require("./config/database");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const cookieParser = require("cookie-parser");
const User = require("./models/user");
const {auth} = require("./ak/auth");
const app = express();
app.use(express.json());
app.use(cookieParser());
app.get("/user/signin",async(req,res)=>{
    try{
        const plainTextPassword = req.body.password;
        const user = await User.findOne({email:req.body.email});
        if(!user)
        {
            throw new Error("Invalid credentials");
        }
        const isValid = await bcrypt.compare(plainTextPassword,user.password);
        if(!isValid)
        {
            throw new Error("Invalid credentials");
        }
        const token = jwt.sign({ id: user._id }, "Aditya",{expiresIn:"1h"});
        res.cookie("token",token,{httpOnly:true});
        res.send("User signed in successfully");
        console.log("User signed in successfully");
    }
    catch(err){
        res.status(404).send("Error in fetching users : Invalid credentials \n Please enter valid credentials \n ");
        console.log(err.message);
    }
});
app.post("/user/signup",async (req,res)=>{
   
    try{
        const email = req.body.email;
        const duplicate = await User.findOne({email});
        if(duplicate)
        {
            throw new Error("Email already exists");
        }
        const user = new User(req.body);
        const password = user.password;
        const passwordHash = await bcrypt.hash(password,10);
        user.password  = passwordHash;
        await user.save();
        res.send("Congratulations! You have signed up successfully");
        console.log("User signed up successfully");
    }
    catch(err){
        res.status(404).send("Error in signing up user \n Please enter valid credentials \n ");
        console.log(err.message);
    }
});
app.patch("/user/update",auth,async(req,res)=>{
    const updatData = req.body;
    const userId = req.userId;
    try{
        const changableData = ["password","gender","age","phone","bio","skills","location","project1","image"];
        const isValidOperation = Object.keys(updatData).every((key)=>changableData.includes(key));
        if(isValidOperation)
        {
            if(updatData.password)
            {
                const password = updatData.password;
                const passwordHash = await bcrypt.hash(password,10);
                updatData.password  = passwordHash;
            }
            const updatedUser = await User.findByIdAndUpdate(userId,updatData,{
                new:true,
                runValidators:true
            });
            if(!updatedUser)
            {
                throw new Error("User not found");
            }
            res.send("User  Data updated successfully");
            console.log("User data updated successfully",updatedUser);
            
        }
        throw new Error("Invalid update data");
    }
    catch(err){
        res.status(404).send("Error in updating user data");
        console.log(err);
    }
});
app.delete("/user/delete",auth,async(req,res)=>{
    const userId = req.userId;
    console.log(userId);
    console.log("User ID",userId);
    try{
        const deletedUser = await User.findByIdAndDelete(userId);
        if(!deletedUser){
            throw new Error("User not found");
        }
        else 
        {
            res.send("User deleted successfully");
            console.log("User deleted successfully");
        }
        
    }
    catch(err){
        res.status(400).send("Error in deleting user data"+err.message);
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