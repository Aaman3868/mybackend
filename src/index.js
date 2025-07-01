import dotenv from "dotenv";
dotenv.config(); // ensure environment variables are loaded

import connectDB from "./db/conn.js";
import { app } from "./app.js"; // ✅ FIXED: import app properly



connectDB()
.then(() =>{
   app.listen(process.env.PORT || 8000,()=>{
    console.log("server started")
   })
})
.catch((err) =>{
    console.log(err);
    
})