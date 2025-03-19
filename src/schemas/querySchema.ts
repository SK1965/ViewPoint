import { z } from "zod"


export const querySchema = z.object({
    owner  :z.string() ,
    query : z.string(),
    likes : z.number(),
    createdAt : z.string(),
})