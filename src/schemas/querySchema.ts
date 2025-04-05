import { z } from "zod"


export const querySchema = z.object({
    _id :z.string(),
    title:z.string(),
    owner  :z.string() ,
    avatar : z.string(),
    query : z.string(),
    likes : z.array(z.string()),
    views : z.number(),
    createdAt : z.string(),
})