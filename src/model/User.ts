import mongoose , {Schema , Document} from  "mongoose";

export interface User extends Document{
    username : string ,
    password : string , 
    email  : string , 
    
}

const UserSchema : Schema<User>  = new Schema({
    username : String ,
    password : String , 
    email  : String  
},{timestamps : true})

export default mongoose.model("User" , UserSchema)