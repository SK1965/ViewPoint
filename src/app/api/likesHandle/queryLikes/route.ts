import dbConnect from "@/lib/dbConnect";
import QueryModel from "@/model/Query";
import UserModel from "@/model/User";
import mongoose from "mongoose";


export async function POST(request : Request){
   
    dbConnect()
    const {userId , queryId} = await request.json()
    try{ 
       // const user = await UserModel.findById(new mongoose.Types.ObjectId(userId))
        const query = await QueryModel.findById(new mongoose.Types.ObjectId(queryId))
        
        if(!query){
            return new Response(
                JSON.stringify({
                  success: false,
                  message: "query not found ",
                }),
                {
                  status: 400,
                }
              );
        }
        const isAlreadyLiked = query.likes.includes(userId);

        if(isAlreadyLiked){
            query.likes = query.likes.filter((id) => id !== userId);

        }else{
            query.likes.push(userId);
        } 
        console.log( query);
        await query.save() 

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