import mongoose , {Schema , Document, ObjectId} from  "mongoose";

export interface User extends Document{
    name : string,
    username : string ,
    password : string , 
    email  : string , 
    bio : string,
    location : string,
    website : string,
    avatar  :string , 
    coverImage:string , 
    isVerified : boolean
    verifyCode : string ,
    verifyCodeExpiry : Date,

}

const UserSchema : Schema<User>  = new Schema({
    name : {
        type:  String,
    },
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
    },
    avatar : {
        type: String,
        default : "https://res.cloudinary.com/dolb0no3p/image/upload/v1743843389/avatars/yxqejebqvj8md5yhwjln.png"
    },
    coverImage : {
        type: String,
        },
    bio : {
        type : String,
        default : ""
    },
    location : {
        type : String,
        default : ""
    },
    website:{
        type : String
    }
},{timestamps : true})

const UserModel = (mongoose.models.User as mongoose.Model<User>) || (mongoose.model<User>("User" , UserSchema));
export default UserModel;