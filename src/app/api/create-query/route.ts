import dbConnect from "@/lib/dbConnect"
import title_generation from "@/lib/title_generate"
import Query from "@/model/Query"
import UserModel from "@/model/User"



export async function POST(request : Request){
    const {username , query} = await request.json()

    dbConnect()
    try {
        const owner = await UserModel.findOne({username}).select('_id')
        const title = await title_generation(query)
        if(!owner){
            return new Response(
                JSON.stringify({
                  success: false,
                  message: "User not found",
                }),
                {
                  status: 404,
                }
              );
        }
      
        const isQueryExist = await Query.findOne({query , owner})
        if(isQueryExist){
          return new Response(
            JSON.stringify({
              success: false,
              message: "Query already exists.",
            }),
            {
              status: 302,
            }
          );
        }
        const newQuery = new Query({title , query , owner})
    
        await newQuery.save()

        return new Response(
            JSON.stringify({
              success: true,
              message: "Query Creation Successfull",
            }),
            {
              status: 200,
            }
          );
    } catch (error ) {
        console.error("unExpected Error",error)
        return new Response(
            JSON.stringify({
              success: false,
              message: "Query creation failed",
            }),
            {
              status: 500,
            }
          );
    }

}