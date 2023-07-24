import mongoose from "mongoose";

import AuthRoles from '../utils/authRoles'

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


export default mongoose.model("User",userSchema);


