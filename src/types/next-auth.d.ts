import 'next-auth'
import { DefaultSession } from 'next-auth'

declare module 'next-auth' {
    interface User {
            _id : string;
            name ?: string;
            username: string;
            avatar ?: string;
            coverImage ?: string;
            bio ?: string;
            location ?: string;
            website ?: string;
            createdAt : string
            isVerified: boolean;    
    }
}

declare module 'next-auth' {
    interface Session{
        user: {
            _id : string;
            name?:string;
            username: string;
            avatar ?: string;
            coverImage ?: string;
            bio ?: string;
            location ?: string;
            website ?: string;
            createdAt : string
            isVerified: boolean;

        } & DefaultSession['user']
    }
}


declare module 'next-auth/jwt'{
    interface JWT{
        _id : string;
        name?:string;
        username: string;
        avatar ?: string;
        coverImage ?: string;
        bio ?: string;
        location ?: string;
        website ?: string;
        createdAt : string
        isVerified: boolean;
    }
}
