import { resend } from "@/lib/resend";

 import VerificationEmail from "../../emails/verificationEmail";

 import { ApiResponse } from "@/types/ApiResponse";


 export async function sendVerificationEmail(
    email: string,
    username : string ,
     VerifyCode: string
    ): Promise<ApiResponse> {

        try{
            await resend.emails.send({
                from  : 'onboarding@resend.dev',
                to : email,
                subject : "ViewPoint | Verify your email",
                react : VerificationEmail({username , otp :VerifyCode}),
                           })
            return   {
                success: true,
                data :{} ,
                message: "Verification email sent",
            }
        }catch(error){
            console.error("Error sending verification email", error);
            return  {
                success: false,
                data : {},
                message: "Error sending verification email",
                    }
        }
 }