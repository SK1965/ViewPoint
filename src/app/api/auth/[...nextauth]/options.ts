import { NextAuthOptions } from "next-auth";
import  CredentialsProvider  from "next-auth/providers/credentials";
import bcrypt from "bcryptjs";
import dbConnect from "@/lib/dbConnect";
import UserModel from "@/model/User";

export const authOptions: NextAuthOptions = {
    providers: [
        CredentialsProvider({
            id: "credentials",
            name: "Credentials",
            credentials: {
                username: {
                    label: "Username",
                    type: "text"
                },
                password: {
                    label: "Password",
                    type: "password"
                },
            },
            async authorize(credentials: any): Promise<any> {
                await dbConnect();

                try {
                    const user = await UserModel.findOne({
                        $or: [
                            { username: credentials.identifier }, 
                            { email: credentials.identifier } 
                        ]
                    });
                    console.log(user);
                    
                    if (!user) {
                        throw new Error("No user found with this username or email");
                    }

                    if (!user.isVerified) {
                        throw new Error("Please verify your account first");
                    }

                    const isValidPassword = await bcrypt.compare(credentials.password, user.password);

                    if (!isValidPassword) {
                        throw new Error("Password is incorrect");
                    }

                    return user; // Return user if credentials are valid
                } catch (err: any) {
                    throw new Error(err.message || "An error occurred during authentication");
                }
            }
        })
    ],
    callbacks: {
        async jwt({ token, user }) {
            if (user) {
                // Add user details to the JWT token when logging in
                token._id = user._id?.toString();
                token.username = user.username;
                token.isVerified = user.isVerified;
            }
            console.log("created token" , token);
            
            return token;
        },
        async session({ session, token}) {
            if (token) {
                // If token exists, add custom user fields to session
                session.user._id = token._id;
                session.user.username = token .username;
                session.user.isVerified = token.isVerified;
            }
            console.log("created token :" , session);
            
            return session;
        },
        async redirect({ url, baseUrl }) {
            // Control the redirect URL after authentication
            // You can customize this further depending on the use case
            // For example, based on user roles or a specific URL.
            if (url === "/sign-in" || url === "/") {
                console.log(baseUrl);
                
              return baseUrl; // Redirect to the base URL or a specific page
            }
      
            // Optional: If you want to redirect users based on custom logic
            console.log(url);
            
            return url; // Redirect to the requested URL or a fallback
          },
        
    },
    pages: {
        signIn: "/sign-in",
        error :"/error"
    },
    session: {
        strategy: "jwt" // Use JWT for session management
    },
    secret: process.env.NEXTAUTH_SECRET, // Ensure this is properly set in your environment
};