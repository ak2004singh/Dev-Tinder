const express = require("express");
const authRouter = express.Router();
const User = require("../models/user");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
//  sign up route
authRouter.post("/signup", async(req,res)=>{
    
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
//   Sign in route
authRouter.post("/signin",async(req,res)=>{
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
            res.json({
                message:"User signed in successfully",
                data:{
                    user:{
                        id:user._id,
                        name:user.firstName + " " + user.lastName,
                        email:user.email,
                        age:user.age,
                        phone:user.phone,
                        Image:user.image,
                        bio:user.bio,   
                        project:user.project1,
                        location:user.location

                    }}
            });
            console.log("User signed in successfully");
        }
        catch(err){
            res.status(404).send("Error in fetching users : Invalid credentials \n Please enter valid credentials \n ");
            console.log(err.message);
        }
});
// log out route
authRouter.post("/logout",async(req,res)=>{
    try{
        
        res.cookie("token",null,{httpOnly:true}).
        status(200).send("User logged out successfully");
        console.log("User logged out successfully");
    }
    catch(err){
        res.status(404).send("Error in logging out user ");
        console.log(err.message);
    }
});


module.exports = authRouter;