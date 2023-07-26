import mongoose from "mongoose";

const couponSchema = new mongoose.Schema(
    {
        code : {
            type:String,
            required:[true ,'Please provide a coupon name']
        },
        discount : {
            type:Number,
            default:0
        },
        active:{
            type:Boolean,
            default:true 
        }
    },
    {
        timestamps:true
    }
) 
// When you set timestamps:true in the schema definition, it means that the ORM or database system will automatically manage two special fields for each record in the table:

// created_at: This field is automatically set to the timestamp when a new record is created.

// updated_at: This field is automatically updated to the timestamp whenever a record is modified or updated.

export default mongoose.model("Coupon",couponSchema)