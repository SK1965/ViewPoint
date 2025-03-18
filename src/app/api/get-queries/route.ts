import dbConnect from "@/lib/dbConnect";
import QueryModel from "@/model/Query";
import { authOptions } from "../auth/[...nextauth]/options";
import { User } from "next-auth";
import { getServerSession } from "next-auth";
import mongoose from "mongoose";
import ResponseModel from "@/model/Response";

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

export async function POST(request : Request){
  await dbConnect();
  try {
    const {messageId} = await request.json();
    const id = new mongoose.Types.ObjectId(messageId)
    const query = await QueryModel.aggregate([
      {
        $match: {
          _id: id, // Match the document by its id
        },
      },
      {
        $lookup: {
          from: "users", // The collection you're joining with (note: collection names are usually pluralized)
          localField: "owner", // The field in the QueryModel that holds the owner's ID
          foreignField: "_id", // The field in the User collection that matches the owner's ID
          as: "owner", // The array to store the matching user documents
        },
      },
      {
        $unwind: { // Unwind the "owner" array to merge it into a single object
          path: "$owner",
          preserveNullAndEmptyArrays: true, // Preserve documents without an owner
        },
      },
      {
        $set :{
          owner : "$owner.username"
        }
      }
      ,
      {
        $project: {
          owner: 1, // Include the owner field (now a single object, not an array)
          query: 1, // Include the query field
          likes: 1, // Include the likes field
          createdAt: 1, // Include the createdAt field
        },
      },
      {
        $sort: { updatedAt: -1 }, // Sort by updatedAt field in descending order
      },

    ]);
    
    const comments = await ResponseModel.findOne({messageId  : id})

    const responseQuery = {query : query[0] ||{} , comments : comments ||[]}

    return new Response(
      JSON.stringify({
       success: true,
       data : responseQuery,
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
          message: "Unable to fetch query",
        }),
        {
          status: 500,
        }
      );
  }
}