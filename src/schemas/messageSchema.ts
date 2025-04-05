import { z } from "zod"

 
 export const messageSchema = z.object(
    {
        content : z.string()
        .min(10 , {message : "content must be atleast 10 charecter long"})
        .max(10000 , {message : "content must not be more than 300 charecters"})
    }
 )
 