import mongoose from 'mongoose'

const orderSchema = new mongoose.Schema(
    {
        products :{
            type:[
                {
                    productId : {
                        type:mongoose.Schema.Types.ObjectId,
                        ref : 'Product',
                        required : true
                    },
                    count : Number,
                    price:Number 
                }
            ],
            required:true 
        } ,
        user : {
            type : {
                type:mongoose.Schema.Types.ObjectId,
                ref:'User',
                required:true
            }
        },
        address:{
            type:String,
            required :true
        },
        phoneNumber : {
            type:Number,
            required :true
        },
        amount : {
            type:Number,
            required :true
        },
        coupon : String,
        transactionId : String,
        status:{
            type:Srting,
            enum : ['ORDERED','SHIPPED','DELIVERED','CANCELLED'],
            default:"ORDERED"
            //try to improve this
        }
        //we can add paymrnt mode
    },
    {
        timestamps:true
    }
)



export default mongoose.model("Order",orderSchema)