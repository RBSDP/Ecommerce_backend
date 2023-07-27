import User from '../model/user.schema'

import asyncHandler from '../services/asyncHandler'
import CustomError from '../utils/customError'

export const cookieOptions = {
    expires: new Date(Date.now() + 3 *24*60*60*1000),
    httpOnly : true,
    //could be in seperate file in util
}

/* 

@SIGNUP
@route http://localhost:4000/api/auth/signup
@description user signup controller for creating a new user
@parameters name, email, password
@return User Object

*/

export const signUp = asyncHandler(async (req,res)=>{
    const {name,email,password}  = req.body 

    if(!name || !email || !password){
        throw new CustomError('Please fill all feilds',400)

    }
    //check if user exixts
    const existingUser = await User.findOne({email})

    if (existingUser){
        throw new CustomError('User already exists',400)
    }
    const user = await User.create({
        name,
        email,
        password
    })


    const token = user.getJwtToken();
    // even though we have given password (select :flase) it is only applicable whwn we are querying the database, but now we created the document and if we console.log the user if gives all the feilds along with password
    console.log(user)
    // so we set the password as undefined
    user.password = undefined


    res.cookie('token',token,cookieOptions)

    res.status(200).json({
        success:true,
        token,
        user 
    })
})