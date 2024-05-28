const { verify } = require("jsonwebtoken");
var dotenv = require('dotenv').config();

const secret = process.env.JWTSECRET;

const validateToken = (req,res,next) =>{
    const accessToken = req.cookies["access-token"];
    if(!accessToken)return res.status(400).json({err : "User is not authenticated.",auth:false});
    try{
        const validToken = verify(accessToken,secret);
        if(validToken){
            req.authenticated = true;
            req.user = { id: validToken.id, email: validToken.username ,is_seller : validToken.is_seller };
            return next();
        }
    }
    catch(err){
        return res.status(400).json({err : err});
    }
}

module.exports = { validateToken };