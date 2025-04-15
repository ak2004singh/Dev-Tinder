const mongoose = require('mongoose');

const connectionRequestSchema = new mongoose.Schema({
    senderId:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"User",
        required:true
    },
    receiverId:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"User",
        required:true
    },
    status:{
        type:String,
        enum:{
            values:["rejected","accepted","interested","ignored"],
            message:`{VALUE} is incorrect status type`}
    },
},{timestamps:true});
connectionRequestSchema.index({ senderId: 1, receiverId: 1 });

module.exports = mongoose.model("connectionRequest",connectionRequestSchema);
