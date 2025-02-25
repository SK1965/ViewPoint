import dbConnect from "@/lib/dbConnect";
import User from "@/model/User";
import bcrypt from "bcryptjs";

import { sendVerificationEmail } from "@/helpers/sendVerificationEmail";


export async function POST(request : Request){
    await dbConnect()

    try {
       const {username , email , password} = await request.json()

       const existingUserVerifiedByUsername = await User.findOne(
        {
            username , 
            isVerified  : true
        }
       )

       if(existingUserVerifiedByUsername){
        return Response.json(
            {
                success : false , 
                message : "Username is already taken"
            },{
                status  :400
            }
        )
       }
      
        const existingUserByEmail =  await User.findOne({email})

        const verifyCode =  Math.floor(100000+Math.random()*900000).toString()
        if(existingUserByEmail){
            if(existingUserByEmail.isVerified){
                return Response.json(
                    {
                        success : false , 
                        message : "Email Already Exists"
                    }
                )
            }
            else{
                const hashedPassword = await bcrypt.hash(password , 10)
                existingUserByEmail.password = hashedPassword
                existingUserByEmail.verifyCode = verifyCode
                existingUserByEmail.verifyCodeExpiry = new Date(Date.now() + 3600000)
            }
        }
        else{
            const hashedPassword = await bcrypt.hash(password , 10)

            const expiryDate = new Date()
            expiryDate.setHours(expiryDate.getHours()+1)

            const newUser = new User({
                username , 
                email ,
                password  :hashedPassword ,
                verifyCode ,
                verifyCodeExpiry : expiryDate ,
                isVerified : false ,
                isAcceptingMessage : true 
            })

            await newUser.save();

            const emailResponse = await sendVerificationEmail(
                email ,
                username,
                verifyCode
            ) 

            if(!emailResponse.success){
                return Response.json({
                    success : false , 
                    message : "Username is already taken",
                },{
                    status : 500
                })
            }

            Response.json({
                success : true,
                message : "User Registered Successul",

            })
        }
       

    } catch (error) {
        console.error('Error registering user' , error)
        return Response.json(
            {
                success : false,
                message : "Error registering user"
            },
            {
                status : 500
            }
        )
    }
}