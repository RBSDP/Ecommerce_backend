import mongoose from "mongoose";


const productSchema = new mongoose.Schema(
    {
        name:{
            type:String,
            required : [true,"please provide a product name"],
            trim:true,
            maxLength : [120,"Product name should be a max of 120 characters"]

            
        },
        price:{
            type:Number,
            required : [true,"please provide a product price"],
            
            maxLength : [5,"Product price should be a max of 5 digits"]
            
            
        },
        description:{
            type:String,
            //use some form of editor -assignment time - 26 min in part-3 class
            
            
        },
        photos:[
            {
                secure_url : {
                    type:String ,
                    required :true
                }
            }
        ],
        stock : {
            type:Number ,
            default : 0
        },
        sold:{
            type:Number,
            default : 0
        },
        // each product is part of collection , so store a reference of a collection
        collectionId:{
            type:mongoose.Schema.Types.ObjectId,
            ref:'Collection'
        }

    },
    {
        timestamps:true 
    }

)


export default mongoose.model('Product',productSchema)
