import dbConnect from "@/lib/dbConnect"
import QueryModel from "@/model/Query"
import UserModel from "@/model/User"


export async function GET(request  :Request , { params }: { params: Promise<{ username: string }> }){

    const username = (await params).username
    await dbConnect()

    try{
        const user = await UserModel.findOne({username})

        if(!user){
            return new Response(
                JSON.stringify({
                  success: false,
                  message: "Profile not exists",
                }),
                {
                  status: 401,
                }
              );
        }

        const posts = await QueryModel.find({owner : user._id} ).sort({createdAt : -1})
        if(!posts){
            return new Response(
                JSON.stringify({
                  success: false,
                  message: "No Posts",
                }),
                {
                  status: 401,
                }
              );
        }

        const profile = {user , posts}

        return new Response(
            JSON.stringify({
              success: true,
              data  :profile,
              message: "Profile fetched successfully",
            }),
            {
              status: 200,
            }
          );


    }catch(error){
        
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
    
}