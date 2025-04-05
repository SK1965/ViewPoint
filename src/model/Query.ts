import mongoose , {Schema , Document,  ObjectId} from "mongoose";

export interface Query extends Document{
    _id : string , 
    title : string , 
    query : string ,
    likes : string[] ,
    owner: ObjectId , 
    views : number
}

const QuerySchema  : Schema<Query> = new Schema({
    title : {
             type : String ,
             required : true
            },
    query : {
              type  :String ,
              required : true,
               },
    owner : {
            type  :mongoose.Types.ObjectId,
            ref : "User"
            },
    likes : {type:[String] , default:[]}, 
    views : {type : Number, default :0}

},{timestamps  : true})
const QueryModel =  (mongoose.models.Query as mongoose.Model<Query>)|| mongoose.model("Query" , QuerySchema);
export default  QueryModel