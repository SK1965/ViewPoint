import dbConnect from "@/lib/dbConnect";
import UserModel from "@/model/User";


export async function POST(request:Request) {
    await dbConnect()
    try{

        const {username ,code} = await request.json()
        const user = await UserModel.findOne({username})

        if(!user){
            return new Response(JSON.stringify({
                success : false , 
                message :  "User not found"
            }),{status : 500}
        )
        }
        const isCodeValid = user.verifyCode == code
        const isCodeNotExpired = new Date(user.verifyCodeExpiry)>new Date()

        if(isCodeValid && isCodeNotExpired){
            user.isVerified  = true
            await user.save()
            return new Response(
                JSON.stringify({
                    success: false,
                    message: "Account verified"
                }),
                {
                    status: 200
                }
            )
        }
        else if(!isCodeNotExpired){
            return new Response(
                JSON.stringify({
                    success: false,
                    message: "Verification Code Expired"
                }),
                {
                    status: 500
                }
            )
        }
        else{
            return new Response(
                JSON.stringify({
                    success: false,
                    message: "Verification Code is wrong"
                }),
                {
                    status: 500
                }
            )
        }
    } catch(error){
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