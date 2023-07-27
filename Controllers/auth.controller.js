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



/* 

@LOGIN
@route http://localhost:4000/api/auth/login
@description user signup controller for loging new user 
@parameters email, password
@return User Object

*/

export const login  = asyncHandler(async (req,res)=>{
    const {email,password} = req.body 

    if(!email || !password){
        throw new CustomError('please fill all feilds',400)
    }


    const user = User.findOne({email}).select("+password")

    if (!user){
        throw new CustomError('Invalid credentials',400)
    }


    const isPasswordMatched = await user.comparePassword(password) 

    if(isPasswordMatched){
        const token  = user.getJwtToken()
        user.password = undefined;
        res.cookie('token',token,cookieOptions)
        return res.status(200).json({
            success:true,
            token,
            user
        })
    }

    throw new CustomError('Invalid credentials -pass',400)
})

/* 

@LOGOUT
@route http://localhost:4000/api/auth/logout
@description user logout by clearing user cookies
@parameters 
@return success message

*/

// below we use "_req" because we are not usinf req any where in the below code so as a good practise we are using.
export const logout = asyncHandler(async(_req,res)=>{
    res.cookie('token',null,{
        expires:new Date(Date.now()),
        httpOnly:true
    })

    res.status(200).json({
        success:true,
        message:'Logged Out'
    })
})

