const express = require("express");
const {connectDB} = require("./config/database");
const cookieParser = require("cookie-parser");
const authRouter = require("./routes/authroute");
const profileRouter = require("./routes/profile");
const requestRouter = require("./routes/request");
const userRouter = require("./routes/userRouter");
const app = express();
app.use(express.json());
app.use(cookieParser());
app.use(authRouter);
app.use(profileRouter);
app.use(requestRouter);
app.use(userRouter);
connectDB().
then(()=>{
    console.log("Connected to DB");
    app.listen(3000);
})
.catch((err)=>{
    console.log(err);
});