import mongoose , {Schema , Document,  ObjectId} from "mongoose";

export interface Query extends Document{
    _id : string
    query : string ,
    likes : number ,
    owner: ObjectId;
}

const QuerySchema  : Schema<Query> = new Schema({
    query : {
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

},{timestamps  : true})
const QueryModel =  (mongoose.models.Query as mongoose.Model<Query>)|| mongoose.model("Query" , QuerySchema);
export default  QueryModel