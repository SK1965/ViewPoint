import { z } from "zod";

export const userSchema = z.object({
    _id:  z.string(),
  username: z.string().min(1, "Username is required"), // non-empty string
  name: z.string().min(1, "Display name is required").optional(), // non-empty string
  avatar: z.string().url("Avatar must be a valid URL").optional(), // URL format validation
  coverImage : z.string().url().optional(),//URL format
  bio: z.string().optional(), // optional bio
  location: z.string().optional(), // optional location
  website : z.string().url("Website must be a valid URL").optional(), // optional URL for website
  createdAt: z.date()
});
