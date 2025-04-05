import dbConnect from "@/lib/dbConnect"
import { getServerSession } from "next-auth"
import path from "path";
import fs from "fs";
import { authOptions } from "../../auth/[...nextauth]/options";
import uploadOnCloudinary from "@/lib/cloudinary";
import UserModel, { User } from "@/model/User";

const UPLOAD_DIR = path.resolve("public/uploads");
export async function POST(request :Request){
    const formData = await request.formData()
    const body = Object.fromEntries(formData)
    const file = (body.coverImage as Blob) || null
    
    if (file) {
        
        const buffer = Buffer.from(await file.arrayBuffer());
        if (!fs.existsSync(UPLOAD_DIR)) {
          fs.mkdirSync(UPLOAD_DIR);
        }
    
        fs.writeFileSync(
          path.resolve(UPLOAD_DIR, (file as File).name),
          buffer
        );
    }else{
        console.log('file not found');
        
        return new Response(
            JSON.stringify({
                success : false,
                message : 'image not found'
            }),
            {
                status : 400
            }
        )
    }
    const session = await getServerSession(authOptions)
    if(!session || !session.user){
        console.log("not authenticated");
        
        return new Response(
            JSON.stringify({
                success : false,
                message : 'not authenticated'
            }),
            {
                status : 401
            }
        )
    }
    await dbConnect()
    const user = session.user
    const coverImage = await uploadOnCloudinary(path.resolve(UPLOAD_DIR, (file as File).name) , 'coverimages')
    if(!coverImage){
        console.log("image not uploaded");
        return new Response(
            
            JSON.stringify({
                success : false,
                message : 'image not uploaded'
            }),
            {
                status : 400
            }
        )
    }

    try {
        const UpdatedUser : (User | null) = await UserModel.findByIdAndUpdate({_id : user._id} , {coverImage : coverImage})
        if(!UpdatedUser){
            console.log("user not found");
            return new Response(
                
                JSON.stringify({
                    success : false,
                    message : 'not authenticated'
                }),
                {
                    status : 400
                }
            )
        }
        return new Response(
            JSON.stringify({
                success : true,
                data : {coverImageUrl : coverImage},
                message : 'profile updated successfully'
            }),
            {
                status : 200
            }
        )
    } catch (error) {
        console.log(error);
        
        return new Response(
            JSON.stringify({
                success : false,
                message : 'something went wrong. try again later'
            }),
            {
                status : 500
            }
        )
    }

}

export async function DELETE(request :Request){

    const session = await getServerSession(authOptions)
    if(!session || !session.user){
        console.log("not authenticated");
        
        return new Response(
            JSON.stringify({
                success : false,
                message : 'not authenticated'
            }),
            {
                status : 401
            }
        )
    }
    await dbConnect()
    const user = session.user
    try {
        
        const UpdatedUser : (User | null) = await UserModel.findByIdAndUpdate(user._id , {coverImage : null})
        if(!UpdatedUser){
            console.log("user not found");
            return new Response(
                
                JSON.stringify({
                    success : false,
                    message : 'not authenticated'
                }),
                {
                    status : 400
                }
            )
        }
        return new Response(
            JSON.stringify({
                success : true,
                message : 'profile updated successfully'
            }),
            {
                status : 200
            }
        )
    } catch (error) {
        console.log(error);
        
        return new Response(
            JSON.stringify({
                success : false,
                message : 'something went wrong. try again later'
            }),
            {
                status : 500
            }
        )
    }
}