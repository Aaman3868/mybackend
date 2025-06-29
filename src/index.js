import dotenv from "dotenv";
import express from "express"
import connectDB from "./db/conn.js";
// import app from "./app.js";



connectDB()
.then(() =>{
   app.listen(process.env.PORT || 8000,()=>{
    console.log("server started")
   })
})
.catch((err) =>{
    console.log(err);
    
})