import { z } from "zod";

export const ReplySchema = z.object({
    messageID: z.string(),
    owner: z.string(),
    message: z.string(),
    likes: z.number().min(0), // likes should be a non-negative number
  });

export const responseSchema = z.object({
    message : z.string() ,
    userId : z.string(),   
    queryId : z.string(), 
    replies : z.array(ReplySchema)  
})