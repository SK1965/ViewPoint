import {z} from 'zod';
export const usernameValidation = z
                                  .string()
                                  .min(2,{message : "Username munst be atleast 2 charecters"})
                                  .max(20 ,{message :  "username must not more than 20 charecters"})
                                  .regex(/^[a-zA-Z0-9_]+$/ , {message : "username must not contain special charecters"})

export const signUpSchema = z.object({
                                    username : usernameValidation,
                                    email : z.string().email(),
                                    password : z.string().min(6,{message : "password must be 6 charecters long"})
                                    })   