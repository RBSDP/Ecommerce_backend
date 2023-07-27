import User from "../model/user.schema"
import asyncHandler from '../services/asyncHandler'
import CustomError from '../utils/customError'
import JWT from 'jsonwebtoken'
import config  from "../config"

export const isLoggedIn = asyncHandler(async(req,res,next)=>{
    let token;
    if(
        req.cookies.token || (req.headers.authorization && req.headers.authorization.startsWith('Bearer'))

    ){
        token = req.cookies.token || req.headers.authorization.split(" ")[1]
    }

    if(!token){
        throw new CustomError('not authorised to access this roure',401)
    }

    try{
        const decodedJwtToken = JWT.verify(token,config.JWT_SECRET)
       req.user = await  User.findById(decodedJwtPayload._id,'name email role') //here we are getting name email role
       next()
    }catch(err){
        throw new CustomError('not authorised to access this route',401)
    }
})
