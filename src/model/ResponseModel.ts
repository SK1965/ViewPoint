import { timeStamp } from "console";
import mongoose, { Schema, Document, ObjectId } from "mongoose";

// Interface for Replies
export interface Replies {
  owner: ObjectId, // ObjectId to reference the User
  message: string,
  likes: number,
  createdAt : Date
}

// Response interface extends Document
export interface Response extends Document {
  message: string,
  userId: ObjectId,   
  queryId: ObjectId,
  replies: Replies[],  // Accepts an array of Replies
  likes: number,
  createdAt : Date
}

// Schema definition for Response model
const ResponseSchema: Schema<Response> = new Schema({
  message: {
    type: String,
    required: true,
  },
  userId: {
    type: mongoose.Types.ObjectId,
    ref: "User",
    required: true,
  },
  queryId: {
    type: mongoose.Types.ObjectId,
    ref: "Query",
    required: true,
  },
  likes: {
    type: Number,
    default: 0,
  },
  replies: [
    {
      owner: { type: mongoose.Types.ObjectId, ref: "User", required: true }, // ObjectId for user reference
      message: { type: String, required: true },
      likes: { type: Number, default: 0 }, 
      createdAt: { type: Date, default: Date.now },
    }
  ],
},{timestamps  : true});

const ResponseModel = (mongoose.models.Response as mongoose.Model<Response>) || mongoose.model("Response", ResponseSchema);
export default ResponseModel;
