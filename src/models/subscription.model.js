import mongoose,{Schema} from "mongoose";


const subscriptionSchema = new  Schema({
    subscriber:{
        type:Schema.Types.ObjectId,
        ref:"User"
    },
     chanel:{
        type:Schema.Types.ObjectId,
        ref:"User"
    },
},{timestamps:true})


export const  Subscrption = mongoose.model("Subscription",subscriptionSchema)