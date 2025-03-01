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
                token.isAcceptingMessage = user.isAcceptingMessage;
            }
            return token;
        },
        async session({ session, token}) {
            if (token) {
                // If token exists, add custom user fields to session
                session.user._id = token._id;
                session.user.username = token .username;
                session.user.isVerified = token.isVerified;
                session.user.isAcceptingMessage = token.isAcceptingMessage;
            }

            return session;
        },
        
    },
    pages: {
        signIn: "/sign-in"
    },
    session: {
        strategy: "jwt" // Use JWT for session management
    },
    secret: process.env.NEXTAUTH_SECRET, // Ensure this is properly set in your environment
};