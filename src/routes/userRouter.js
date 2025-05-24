const express = require("express");
const userRouter = express.Router();
const  User  = require("../models/user");
const {auth}=require("../helper/auth");
const connectionRequest = require("../models/connectionRequest");
const populateData = "firstName lastName gender age phone bio image skills location ";
userRouter.get("/user/requests/received",auth,async(req,res)=>{
    try{
        const userId = req.userId;
        const requests = await connectionRequest.find({receiverId:userId,
            status:"interested"
        }).populate("senderId",populateData);
        if(requests.length === 0)
        {
            return res.status(200).json({message:"No requests received",
                requests:[]
            });
        }
        const requestsData = requests.map((data)=>{
            return data.senderId;
        }); 
        res.status(200).json({
            message: "you have received the following requests",
            requests: requestsData
        });
    }
    catch(err)
    {
        res.status(404).json({message:"error in loading the requests received \n "+err.message});
    }
});

userRouter.get("/user/connections",auth,async(req,res)=>{
    try
    {
        const userId = req.userId;
        const first = await connectionRequest.find({senderId:userId,status:"accepted"}).populate("receiverId",populateData);
        let connectionsData = first.map((val)=>{
            return val.receiverId;
        });
        const second = await connectionRequest.find({receiverId:userId,status:"accepted"}).populate("senderId",populateData);
        connectionsData = connectionsData.concat(second.map((val)=>{
            return val.senderId;
        }));
        if(connectionsData.length === 0)
        {
            return res.status(200).json({message:"You Have 0 Connections , Please Explore More"});
        }
        res.status(200).json({
            message:"Yor connections : ",
            connections:connectionsData
        });
    }
    catch(err)
    {
        res.status(404).json({message:"Error in loading connections \n "+err.message});
    }
});


userRouter.get("/user/feed",auth,async(req,res)=>{
    try{
        const userId = req.userId;
        const page = req.query.page|| 1;
        const limit = req.query.limit || 10;
        const skip = (page-1)*limit;
        const seen = await connectionRequest.find({
            $or:[{senderId:userId},{receiverId:userId}]
        });
        let ak = new Set();
        ak.add(userId.toString());
        seen.forEach((val)=>{
            ak.add(val.senderId.toString());
            ak.add(val.receiverId.toString());
        });
        const allUsers = await User.find({_id:{$nin:Array.from(ak)}}).select(populateData).skip(skip).limit(limit);
        res.json({
        message:"All Users",
        users:allUsers
        });
        }
        catch(err)
        {
        res.status(404).json({message:"Error in loading feed \n "+err.message});
        }
});
module.exports = userRouter;