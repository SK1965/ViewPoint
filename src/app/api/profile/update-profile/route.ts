import dbConnect from "@/lib/dbConnect"
import { authOptions } from "../../auth/[...nextauth]/options"
import { getServerSession } from "next-auth"
import UserModel from "@/model/User"

export async function PUT(request: Request) {
    const {name,bio , location , website} = await request.json()

    await dbConnect()
    console.log(name);
    
    const session = await getServerSession(authOptions)
    if(!session || !session.user) {
        console.log("not authenticated")
        return new Response(
            JSON.stringify({
                success: false,
                message: "not authenticated",
            }),
            {
                status: 401,
            }
        )
    }
    const user = session.user

    try {
        const updatedUser = await UserModel.findByIdAndUpdate(
            {_id : user._id} ,
            {name : name , bio : bio , location : location , website : website} ,
            {new : true}
        )

        if(!updatedUser){
            console.log("user not found")
            return new Response(
                JSON.stringify({
                    success: false,
                    message: "not authenticated",
                }),
                {
                    status: 400,
                }
            )
        }
        console.log(updatedUser);
        
        return new Response(
            JSON.stringify({
                success: true,
                data: {name : updatedUser.name , bio : updatedUser.bio , location : updatedUser.location , website : updatedUser.website},
                message: "profile updated successfully",
            }),
            {
                status: 200,
            }
        )
    } catch (error) {
        return new Response(
            JSON.stringify({
                success: false,
                message: "something went wrong! try again later",
            }),
            {
                status: 500,
            }
        )
    }
    
}