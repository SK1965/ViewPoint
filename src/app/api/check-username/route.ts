import { z } from "zod";
import dbConnect from "@/lib/dbConnect";
import User from "@/model/User";
import { usernameValidation } from "@/schemas/signUpSchema";


const usernameQuerySchema = z.object({
  username: usernameValidation
})

export async function GET(request: Request) {
    await dbConnect();
    try{
        const {searchParams} = new URL(request.url);
        const queryparam ={
            username : searchParams.get("username")
        };

        const result = usernameQuerySchema.safeParse(queryparam);
        if(!result.success){
           // const usernameError = result.error.format().username?._errors ||[]
            return new Response(
                JSON.stringify({
                    success: false,
                    message: "Invalid username"
                }),
                {
                    status: 400
                }
            )
        }
        console.log("result", result);
        const {username} = result.data;
        const existingUser = await User.findOne({
            username,
            isVerified: true
        });

        if(existingUser){
            return new Response(
                JSON.stringify({
                    success: false,
                    message: "Username is already taken"
                }),
                {
                    status: 400
                }
            )
        }

        return new Response(
            JSON.stringify({
                success: true,
                message: "Username is available"
            }),
            {
                status: 200
            })
    } catch (error) {
        console.error("Error in check-username", error);
        return new Response(
            JSON.stringify({
                success: false,
                message: "Internal server error"
            }),
            {
                status: 500
            }
        )
    }
}
