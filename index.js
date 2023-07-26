import mongoose from "mongoose";
import app from './app'
import config from "./config";


//create a method
// (async () => {})()

(async () => {
    try {
        await mongoose.connect(config.MONGODB_URL)
        console.log('DB is connected')
        //read about "on" in express

        app.on('error',(err)=>{
            console.log('ERROR:',err);
        })

        const  Listening = () => {
            
                console.log('listening on ${config.PORT}')
        
        }
        app.listen(config.PORT,Listening)

        
    } catch (error) {
        console.log('ERROR',err);
        throw err
    }
})()