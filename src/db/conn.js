import mongoose, { connect } from "mongoose";
import { DB_NAME } from "../constants.js";

const connectDB = async() => {
    try{
        await mongoose.connect(`${process.env.MONGODB_URI}/${DB_NAME}`)
        console.log("connect success");
    }catch(err){
        console.log("connect error")
        process.exit(1);
    }
}

export default connectDB