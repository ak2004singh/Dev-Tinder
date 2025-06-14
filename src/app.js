require("dotenv").config();
const express = require("express");
const {connectDB} = require("./config/database");
const cookieParser = require("cookie-parser");
const cors = require("cors");
const authRouter = require("./routes/authroute");
const profileRouter = require("./routes/profile");
const requestRouter = require("./routes/request");
const userRouter = require("./routes/userRouter");
const http = require("http");
const initializeSocket = require("./helper/socket");
const app = express();
const server = http.createServer(app);
initializeSocket(server);
app.use(cors(
    {
        origin :"http://localhost:5173",
        credentials:true,
    }
));
app.use(express.json());
app.use(cookieParser());
app.use(authRouter);
app.use(profileRouter);
app.use(requestRouter);
app.use(userRouter);
connectDB().
then(()=>{
    console.log("Connected to DB");
    server.listen(3000);
})
.catch((err)=>{
    console.log(err);
});