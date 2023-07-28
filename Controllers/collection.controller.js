

import Collection from '../model/collection.sechema'
import asyncHandler from '../services/asyncHandler'
import CustomError from '../utils/customError'


/*
@create_colection
@route http://localhost:5000/api/collection
*/


export const createCollection = asyncHandler(async(req,res)=>{
    //take name from frontend
    const {name} = req.body

    if (!name){
        throw new CustomError("Collection name is required",400)

    }

    //add this name to database
    const collection  = await Collection.create({
        name
    })

    //send this responce value to frontend
    res.status(200).json({
        success:true,
        message:'collection created with success',
        collection
    })


})



export const updateCollection = asyncHandler(async(req,res)=>{

    //existing value to be updated

    const {id:collectionId} = req.params 


    // new value to get updated
    const {name} = req.body
    if (!name){
        throw new CustomError("Collection name is required",400)

    }


    let updatedCollection = await Collection.findByIdAndUpdate(
        collectionId,
        {
            name 
        },
        {
            new:true ,
            runValidators : true
        }
    )

    if(!updatedCollection){
        throw new CustomError("Collection not found",400)

    }

    //send responce to front end 
    res.status(200).json({
        success:true, 
        message:"collection updated seccesfully",
        updatedCollection
    })


})


export const deleteCollection = asyncHandler(async(req,res)=>{

    const {id:collectionId} = req.params 

    const collectionToDelete  = await Collection.findByIdAndDelete(collectionId)

    if(!collectionToDelete){
        throw new CustomError("Collection not found",400)

    }

    // we freed up the memory 
    collectionToDelete.remove()

    res.status(200).json({
        success:true, 
        message:"collection deleted seccesfully",
        
    })



})


export const getAllCollections = asyncHandler(async(req,res) => {
    const collections = await Collection.find()

    if(!collections){
        throw new CustomError('No collection found',400)
    }


    res.status(200).json({
        success:true,
        collections
    })
})