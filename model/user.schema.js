import mongoose from "mongoose";
import config from '../config/index'
import AuthRoles from '../utils/authRoles'
import JWT from 'jsonwebtoken'
const bcrypt = require('bcryptjs'); //i did this way of import because it is giving error if i import using import keyword
import crypto from 'crypto'




const userSchema = mongoose.Schema(
    {
        name : {
            type:String,
            required :[true, "name is required"],
            maxLength :[50,"name must be less than 50"]
        },
        email:{
            type:String,
            required :[true, "email is required"],
            unique:true
        },
        password:{
            type:String,
            required :[true, "password is required"],
            minLength:[8,"password must be atleast 8 characters"],
            select :false //when ever we try to query the database, the feild which is marked as "select:false" will not be sent.
        },
        role:{
            type:String,
            enum :Object.values(AuthRoles),
            default:AuthRoles.USER
        },
        forgotPasswordToken : String,
        forgotPasswordExpiry :Date,


    },
    {
        timestamps:true
    }
);

// enum and timestanps learned

//encrypt the password
userSchema.pre('save',async function(next){
    if(!this.modified('password')) return next();
    this.password = await bcrypt.hash(this.password ,10)
    next();
})

// add more features to the schema
userSchema.methods = {
    //compare password
    comparePassword : async function(enteredPassword){
        return await bcrypt.compare(enteredPassword,this.password)
    },


    // generate JWT token
    getJwtToken: function(){
        return JWT.sign({
            _id:this._id,
            role:this.role
        },config.JWT_SECRET,{expiresIn:config.JWT_EXPIRY})
    },

    generateForgotPasswordToken: function(){
        const forgotToken = crypto.randomBytes(20).toString('hex')
        //step -1 -save to DB
        this.forgotPasswordToken = crypto.createHash('sha256').update(forgotToken).digest('hex')


        this.forgotPasswordExpiry = Date.now() + 20 * 60 * 1000
        //step=2 =return valuse to user
        return forgotToken
    }


}


export default mongoose.model("User",userSchema);





