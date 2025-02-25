import mongoose , {Schema , Document} from  "mongoose";

export interface User extends Document{
    username : string ,
    password : string , 
    email  : string , 
    isVerified : boolean
    verifyCode : string ,
    verifyCodeExpiry : Date
}

const UserSchema : Schema<User>  = new Schema({
    username :{ 
             type : String ,
             required : true
              }  ,
    password : {
             type : String,
             required : true,
               } , 
    email :{
        type : String , 
        required : true
           },
    isVerified : {
        type : Boolean, 
        default : false
    },
    verifyCode : {
        type : String
    },
    verifyCodeExpiry : {
        type : Date
    }
},{timestamps : true})

const UserModel = (mongoose.models.User as mongoose.Model<User>) || (mongoose.model<User>("User" , UserSchema));
export default UserModel;