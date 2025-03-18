import mongoose , {Schema , Document, ObjectId} from "mongoose";

export interface Replies {
    messageID :string ,
    owner  : string,
    message : string,
    likes : number
}

export interface Response extends Document{
    message : string ,
    userId : ObjectId,   
    queryId : ObjectId,
    replies : [Replies]
}
const ResponseSchema : Schema<Response> = new Schema({
    message : {
        type : String ,
        required : true    },
    userId : {
        type : mongoose.Types.ObjectId,
        ref : "User"
    },
    queryId : {
        type : mongoose.Types.ObjectId,
        ref : "Query"
    },
    replies: [
        {
          messageID: { type: String, required: true },
          owner: { type: String, required: true },
          message: { type: String, required: true },
          likes: { type: Number, required: true },
        },
      ]
})

const ResponseModel =  (mongoose.models.Query as mongoose.Model<Response>)|| mongoose.model("Response" , ResponseSchema);
export default  ResponseModel