import mongoose , {Schema , Document, ObjectId} from "mongoose";

export interface Response extends Document{
    message : string ,
    userId : ObjectId,   
    queryId : ObjectId
}

const ResponseSchema : Schema<Response> = new Schema({
    message : {
        type : String ,
        required : true
    },
    userId : {
        type : mongoose.Types.ObjectId,
        ref : "User"
    },
    queryId : {
        type : mongoose.Types.ObjectId,
        ref : "Query"
    }
})

export default mongoose.model("Response" , ResponseSchema)