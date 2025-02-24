import mongoose , {Schema , Document,  ObjectId} from "mongoose";

export interface Query extends Document{
    question : string ,
    likes : number ,
    dislikes : number,
    owner: ObjectId;
}

const QuerySchema  : Schema<Query> = new Schema({
    question : {
              type  :String ,
              required : true,
               },
    owner : {
            type  :mongoose.Types.ObjectId,
            ref : "User"
            },
    likes : {
            type : Number , 
            default : 0
            },
    dislikes : {
                type : Number , 
                default :  0
               }

},{timestamps  : true})

export default  mongoose.model("Query" , QuerySchema);