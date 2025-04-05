import dbConnect from "@/lib/dbConnect";
import ResponseModel from "@/model/ResponseModel";

import UserModel from "@/model/User";
import mongoose from "mongoose";


export async function POST(request : Request){
   
    dbConnect()
    const {userId , replyId} = await request.json()
    try{ 
       // const user = await UserModel.findById(new mongoose.Types.ObjectId(userId))
        const reply = await ResponseModel.findById(new mongoose.Types.ObjectId(replyId))
        
        if(!reply){
            return new Response(
                JSON.stringify({
                  success: false,
                  message: "reply not found ",
                }),
                {
                  status: 400,
                }
              );
        }
        const isAlreadyLiked = reply.likes.includes(userId);

        if(isAlreadyLiked){
            reply.likes = reply.likes.filter((id) => id !== userId);
        }else{
            reply.likes.push(userId);
        } 
        console.log( reply);
        await reply.save()

        return new Response(
            JSON.stringify({
              success: true,
              message: "like added/removed",
            }),{status:200}
            )
    }catch(error){
        return new Response(
            JSON.stringify({
              success: false,
              message: "something went wrong",
            }),
            {
              status: 500,
            }
          );
    }
}