import User from '../model/user.schema'
import crypto from 'crypto'
import asyncHandler from '../services/asyncHandler'
import CustomError from '../utils/customError'
import mailHelper from '../utils/mailhelper'


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


    const user = await User.findOne({email}).select("+password")

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

/* 

@FORGOT_PASSWORD
@route http://localhost:4000/api/auth/password/forgot
@description:user will submit email and we will generate a token
@parameters: email
@return success message -email sent


*/

export const forgotPassword = asyncHandler(async(req,res)=>{
    const {email} = req.body
    // check email for null or ""

    const user = User.findOne({email})
    if(!user){
        throw new CustomError('User not found',404)
    }

    const resetToken = user.generateForgotPasswordToken()
    await user.save({validateBeforeSave :false})
    const resetUrl = `${req.protocol}://${req.get('host')}/api/auth/password/reset/${resetToken}`
    const text = `your password reset url is
    \n\n ${resetUrl} \n\n `
    try {
        await mailHelper({
            email:user.email,
            subject:'password reset email for website',
            text:text,
        })


        res.status(200).json({
            success:true,
            message: `Email send to ${user.email}`
        })
    } catch (error) {

        //roll back - clear feilds and save
        user.forgotPasswordToken = undefined
        user.forgotPasswordExpiry = undefined 
        await user.save({validateBeforeSave:false})
        throw new CustomError(err.message || 'Email sent failure',500)
    }
})
/*
@RESET_PASSWORD
@route http://localhost:4000/api/auth/password/forgot/reset/:resetPasswordToken
@description:user will be able to reset password based on url token
@parameters: tokenfrom url ,password and confirm password
@return:user object


*/


export const resetPassword = asyncHandler(async (req,res)=>{
    const {token:resetToken} = req.params 
    const {password,confirmPassword} = req.body
    
    const resetPassswordToken  = crypto.createHash('sha256').update(resetToken).digest('hex') 


    const user = await User.findOne({
        forgotPasswordToken : resetPassswordToken,
        //we use $gt:Date.now() . it indicates that date should be greater than now
        forgotPasswordExpiry:{$gt:Date.now()}
    })

    if(!user){
        throw new CustomError('password token is invalid or expired',400)
    }

    if(password !== confirmPassword){
        throw new CustomError('password and conform password did not match',400)
    }

    user.password = password
    user.forgotPasswordToken = undefined
    user.forgotPasswordExpiry = undefined

    await user.save()

    // create token and send to user

    const token = user.getJwtToken()
    user.password = undefined

    // helper method for cookie can be added
    res.cookie('token',token,cookieOptions)
    res.status(200).json({
        success:true,
        user 
})
})

// TODO:create a controller for change password


