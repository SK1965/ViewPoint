import {z} from 'zod';
export const usernameValidation = z
                                  .string()
                                  .min(2,"Username munst be atleast 2 charecters")
                                  .max(20 , "username must not more than 20 charecters")
                                  .regex(/^[a-zA-Z0-9_]+$/ , "username must not contain special charecters")

export const signUpSchema = z.object({
                                    username : usernameValidation,
                                    email : z.string().email(),
                                    password : z.string().min(6,{message : "password must be 6 charecters long"})
                                    })   