const express = require("express");
const requestRouter = express.Router();
const User = require("../models/user");
const {auth} = require("../helper/auth");
const connectionRequest = require("../models/connectionRequest");
requestRouter.post("/request/send/:status/:userId",auth,async(req,res)=>{
    try{
        const senderId = req.userId;
        const receiverId = req.params.userId;
        const status = req.params.status;
        if(senderId==receiverId)
        {
            throw new Error("Cannot send request to self");
        }
        const validReceiverId = User.findById(receiverId);
        if(!validReceiverId)
        {
            throw new Error("Invalid receiver ID");
        }
        const duplicate = await connectionRequest.findOne({
            $or: [
              { senderId: senderId, receiverId: receiverId },
              { senderId: receiverId, receiverId: senderId }
            ]
          });
        if(duplicate)
        {
            throw new Error("Connection request already sent");
        }
        const request = new connectionRequest({
            senderId,
            receiverId,
            status
        });
        await request.save();
        res.json({
            message:"Connection request sent successfully",
            request:request
        });
    }
    catch(err){
        res.status(404).send("Error in sending connection request \n "+err.message);
        console.log(err.message);
    }
});

requestRouter.post("/request/review/:status/:senderId",auth,async(req,res)=>{
    try{
        const receiverId = req.userId;
        const senderId = req.params.senderId;
        const status  = req.params.status;
        const validSatus = ["accepted","rejected"];
        if(!validSatus.includes(status))
        {
            throw new Error("Invalid status type");
        }
        const validRequest = await connectionRequest.findOne({
            senderId:senderId,
            receiverId:receiverId,
            status:"interested"
        });
        if(!validRequest)
        {
            throw new Error("No connection request found");
        }
        validRequest.status = status;
        await validRequest.save();
        res.json({
            message:"Connection request reviewed sucessfully",
            request:validRequest
        });
    }
    catch(err)
    {
        res.status(404).json({
            message:"Error in reviewing connection request \n "+err.message
        });
    }
});

module.exports = requestRouter;