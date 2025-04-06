import mongoose from "mongoose";
import QueryModel from "@/model/Query";
import dbConnect from "@/lib/dbConnect";


export async function GET(request : Request) {
    dbConnect();

    try {
        
        const famousQueries = await QueryModel.aggregate([
            {
              $limit: 1000
            },
            {
              $sort: { updatedAt: -1 }
            },
            {
              $limit: 5
            },
             {
              $lookup: {
                from: 'users',
                localField: 'owner',  // The 'owner' field in QueryModel references the '_id' in User model
                foreignField: '_id',
                as: 'user'
              }
            },
            {
              $unwind: '$user'  // Deconstruct the 'user' array (since $lookup creates an array)
            },
            {
              $project: {
                query: 1,
                likes: 1,
                createdAt: 1,
                updatedAt: 1,
                owner: { 
                  $concat: [
                    '$user.username', // Splitting the email to get the part before '@'
                  ]
                }
              }
            } 
          ]);
          
          
          
        return new Response(
            JSON.stringify({
             success: true,
             data : famousQueries,
             message: "queries fetched successfully",
           }),
           {
             status: 200,
           }
         );
    } catch (error) {
        console.error("Unexpected Error", error);
        return new Response(
            JSON.stringify({
             success: false,
             //data : ,
             message: "unable to fetch",
           }),
           {
             status: 500,
           }
         );
    }
}