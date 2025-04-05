import dbConnect from "@/lib/dbConnect";
import QueryModel from "@/model/Query";

  export async function GET(request:Request) {
    dbConnect()

    try{
       const queries = await QueryModel.aggregate([
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
            owner : "$owner.username",
            avatar : "$owner.avatar"
          }
        }
        ,
        {
          $project: {
            title:1,
          owner: 1,
          avatar :1, // Include the owner field (now a single object, not an array)
          query: 1, // Include the query field
          likes: 1,
          views : 1, // Include the likes field
          createdAt: 1,
          },
        },
        {
          $sort: {views : -1 ,  likes: -1  , createdAt :-1}, // Sort by updatedAt field in descending order
        },
           
          ])

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
      
    }catch(error){
      return new Response(
        JSON.stringify({
         success: true,
         message: "failed"
       }),
       {
         status: 500,
       }
     );
  
    }
  }