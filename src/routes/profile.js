const express  = require("express");
const profileRouter = express.Router();
const User = require("../models/user");
const bcrypt = require("bcrypt");
const {auth}= require("../helper/auth");
const jwt = require("jsonwebtoken");
// profile edit router
profileRouter.patch("/profile/edit",auth,async(req,res)=>{
    const updatData = req.body;
    const userId = req.userId;
    try{
        const changableData = ["firstName","lastName","gender","age","phone","bio","skills","location","project1","image"];
        const isValidOperation = Object.keys(updatData).every((key)=>changableData.includes(key));
        if(isValidOperation)
        {
            const updatedUser = await User.findByIdAndUpdate(userId,updatData,{
                new:true,
                runValidators:true
            });
            if(!updatedUser)
            {
                throw new Error("User not found");
            }
            res.json({
                message:"User data updated successfully",
                user:updatedUser
            });
            
            
        }
        else 
        {
            throw new Error("Invalid update data");
        }
    }
    catch(err){
        res.status(404).send("Error in updating user data");
        console.log(err);
    }
});
// profile view router 
profileRouter.get("/profile/view",auth,async(req,res)=>{
   try{
    const userId = req.userId;
    const user  =  await User.findById(userId).select("-password");
    if(!user)
    {
        throw new Error("User not found");
    }
    res.json({
        messsage:"user data fetched successfully",
        user:user
    });
   }
   catch(err)
   {
        res.status(404).send("Error in fetching user data");
        console.log(err.message);
        console.log(err);
   }
});
// profile password update router 
profileRouter.patch("/profile/password/:pass",auth,async(req,res)=>{
    try{
    const userId = req.userId;
    const password = req.params?.pass;
    console.log("Password is : ",password);
    if(!password)
    {
        return res.status(400).send("Password is required");
    }
    const user = await User.findById(userId);
    if(!user)
    {
        return res.status(404).send("User not found");
    }
    const validPassword = await bcrypt.compare(password,user.password);
    if(!validPassword)
    {
        return res.status(400).send("Invalid password");
    }
    const newPassword = req.body.password;
    if(!newPassword)
    {
        return res.status(400).send("New password is required");
    }
    const passwordHash = await bcrypt.hash(newPassword,10);
    user.password = passwordHash;
    await user.save();
    res.send("Password updated successfully");
}
catch(err){
    res.status(404).send("Error in updating user password"+err.message);
    console.log(err);
}
});
module.exports = profileRouter;