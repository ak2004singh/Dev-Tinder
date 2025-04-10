const mongoose = require('mongoose');
const connectDB = async ()=>{
    await mongoose.connect("mongodb+srv://AK007:h7zbcLJHw1E4MWQq@ak007.bzk6lhs.mongodb.net/devTinder?retryWrites=true&w=majority&appName=AK007");
};
module.exports = {connectDB};