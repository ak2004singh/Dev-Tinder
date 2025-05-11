const jwt = require("jsonwebtoken");
const auth = async function(req,res,next){
    try{
        const token = req.cookies.token;
        if(!token){
return res.status(401).send("Unauthorized access \n Please login again \n ");
        }
        const decoded = jwt.verify(token,"Aditya");
        req.userId = decoded.id;
        next();
    }
    catch(err){
        res.status(401).send("Unauthorized access \n Please login again \n "+err.message);
        console.log(err.message);
    }
}
module.exports = {auth};    