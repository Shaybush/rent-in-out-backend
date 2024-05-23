const jwt = require("jsonwebtoken");
const { config } = require("../config/config");

exports.isLoggedIn = (req,res,next) =>
{
  req.user ? next() : res.status(401).json({err:"something went wrong"});
}
exports.auth = async(req,res, next) =>{
    let token = req.header("x-api-key")
    if(!token) {
        return res.status(401).json({msg:"please send token this end point url "})
    }
    try{
        let tokenData = jwt.verify(token , config.tokenSecret);
        req.tokenData = tokenData;
        next()
    }
    catch(err){
      return res.status(401).json({msg:"token not valid/expired"})
    }
} 

exports.authAdmin = (req,res,next) => {
  let token = req.header("x-api-key");
  if(!token){
    return res.status(401).json({msg:"You need to send token to this endpoint url"})
  }
  try{
    let decodeToken = jwt.verify(token,config.tokenSecret);
    if(decodeToken.role != "admin"){
      return res.status(401).json({msg:"Token is not admin"})
    }
    req.tokenData = decodeToken;

    next();
  }
  catch(err){
    console.error(err);
    return res.status(401).json({msg:"Token invalid or expired, log in again or you hacker!"})
  }
}
