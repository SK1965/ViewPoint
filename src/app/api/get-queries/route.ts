import dbConnect from "@/lib/dbConnect";
import QueryModel from "@/model/Query";
import { authOptions } from "../auth/[...nextauth]/options";
import { User } from "next-auth";
import { getServerSession } from "next-auth";
import mongoose from "mongoose";

export async function GET(request : Request){
    await dbConnect();
    const session = await getServerSession(authOptions)
    const user : User = session?.user as User
    if(!session || !user){
        return new Response(
            JSON.stringify({
              success: false,
              message: "Not Authenticated",
            }),
            {
              status: 401,
            }
          );
    }

    const userId = new mongoose.Types.ObjectId(user._id)

   
   try {
    // const queries = await QueryModel.findById(userId)
    const queries = await QueryModel.aggregate([
     {
         $match : {owner : userId}
     },
     {
         $lookup : {
             from : "User",
             localField : "userId",
             foreignField : "_id",
             as : "user"
         }
     },
     {
         $project : {
             queryModel : 1,
             "user.username" : 1 ,
             likes : 1,
             createdAt  : 1
         }
     },
     {
         $sort : {'updatedAt' : -1}
     },
     
    ])
    
    if(!queries){
     return new Response(
         JSON.stringify({
           success: false,
           message: "Not Authenticated",
         }),
         {
           status: 401,
         }
       );
    }   
 
    return new Response(
      JSON.stringify({
       success: true,
       data : queries,
       message: "queries fetched successfully",
     }),
     {
       status: 200,
     }
   );
   } catch (error) {
     console.error(error)
     return new Response(
        JSON.stringify({
          success: false,
          message: "Unable to fetch queries",
        }),
        {
          status: 500,
        }
      );
   }
}