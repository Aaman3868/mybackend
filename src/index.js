import dotenv from "dotenv";
import express from "express"
import connectDB from "./db/conn.js";



connectDB()
/*
const app = express();
;(async () => {
    try{
       await mongoose.connect(`${process.env.MONGODB_URI}/${DB_NAME}`)
       app.on("error", () =>{
        console.log("ERR",error);
        throw error
       })

       app.listen(process.env.PORT,()=>{
        console.log("App is listent the port");
       })
    }catch(err){
        console.log(err);
        throw err;
    }
})()
    */