import dbConnect from "@/lib/dbConnect";
import QueryModel from "@/model/Query"
import mongoose, { Query } from "mongoose";

export async function POST(request :Request){
    const {queryId} = await request.json()
    
    let convertedQueryId = queryId;

    if (typeof queryId === 'string' && mongoose.Types.ObjectId.isValid(queryId)) {
    convertedQueryId = new mongoose.Types.ObjectId(queryId);

    }
    await dbConnect()
    try {
        
        const query = await QueryModel.findById(convertedQueryId)
        console.log(query)
        if(!query){
            return new Response(
                JSON.stringify({
                 success: false,
                 message: "query not found",
               }),
               {
                 status: 400,
               }
             );
        }
        query.views+=1
        await query.save();
        
        return new Response(
            JSON.stringify({
             success: true,
             message: "view added",
           }),
           {
             status: 200,
           }
         );
    } catch (error) {
        console.log(error)
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