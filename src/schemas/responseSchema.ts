import { z } from "zod";

export const ReplySchema = z.object({
    messageID: z.string(),
    owner: z.string(),
    message: z.string(),
    likes: z.number().min(0), // likes should be a non-negative number
  });

export const responseSchema = z.object({
    _id : z.string(),
    message : z.string() ,
    owner : z.string(),
    avatar : z.string().optional(),
    replies : z.array(ReplySchema),
    createdAt : z.date(),
    likes : z.array(z.string())
})