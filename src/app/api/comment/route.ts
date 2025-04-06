import dbConnect from "@/lib/dbConnect";
import ResponseModel from "@/model/ResponseModel";
import mongoose from "mongoose";


export async function POST(request:Request) {

    dbConnect()
    const {message,userId,queryId} =await  request.json()

    
    if(!userId || !queryId){
        return new Response(
            JSON.stringify({
              success: false,
              message: "Missing data",
            }),
            {
              status: 400,
            }
          );
    }

    try {
        const comment = new ResponseModel({
            message ,
            userId : new mongoose.Types.ObjectId(userId) ,
            queryId : new mongoose.Types.ObjectId(queryId) ,
            replies : []
        })
        

        await comment.save()
        
        return new Response(
            JSON.stringify({
              success: true,
              message: "comment added",
            }),
            {
              status: 200,
            }
          );
    } catch (error) {
        console.error()
        return new Response(
            JSON.stringify({
              success: false,
              message: "comment didn't added",
            }),
            {
              status: 500,
            }
          );
    }
}