import Query from "@/model/Query"
import UserModel from "@/model/User"



export async function POST(request : Request){
    const {username , query} = await request.json()

    try {
        const owner = await UserModel.findOne({username}).select('_id')

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
    
        const newQuery = new Query({query , owner})
    
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
    } catch (error) {
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