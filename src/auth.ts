import NextAuth, {type DefaultSession, User} from 'next-auth';
import CredentialsProvider from 'next-auth/providers/credentials';
import {compare} from 'bcryptjs';
import {sql} from "@vercel/postgres";
import {nameSchema, passwordSchema, userSchema } from "./lib/definitions";
import {JWT} from "@auth/core/jwt";


declare module "next-auth" {
    interface Session{
        user: {
            id: string,
            name: string,
            calendar_url: string,
        } & DefaultSession["user"];
    }
}

interface ExtendedUser extends User{
    id: string;
    name: string;
    calendar_url: string;
}

interface ExtendedJWT extends JWT {
    id: string;
    name: string;
    calendar_url: string;
}


export const {
    handlers: { GET, POST},
    auth,
} = NextAuth({
    session: {
        strategy: 'jwt',
    },
    pages: {
        signIn: "/auth/login",
    },
    providers: [
        CredentialsProvider({
            credentials: {
                name: {},
                password: {}
            },
            async authorize(credentials, req): Promise<ExtendedUser | null>{
                try{
                    if(!credentials?.name || !credentials?.password) return null;
                    const parsedName = nameSchema.parse(credentials.name);
                    const parsedPassword = passwordSchema.parse(credentials.password);

                    const response = await sql`
                    SELECT * FROM users WHERE name = ${parsedName}
                    `;

                    const resultRow =  response.rows[0];

                    if(!resultRow) return null;

                    const passwordCorrect = await compare(parsedPassword, resultRow.password);

                    if(passwordCorrect){
                        return {
                            id: resultRow.id,
                            name: resultRow.name,
                            calendar_url: resultRow.calendar_url
                        };
                    }
                    return null;
                } catch (e){
                    return null;
                }
            }
        })
    ],
    callbacks: {
        async jwt({token, user}): Promise<ExtendedJWT>{
            if(user){
                const parsedUser= userSchema.parse(user);
                token.id = parsedUser.id;
                token.name = parsedUser.name;
                token.calendar_url = parsedUser.calendar_url;
            }
            return token as ExtendedJWT;
        },
        async session({session, token}){
            if(token){
                session.user.id = token.id as string;
                session.user.name = token.name as string;
                session.user.calendar_url = token.calendar_url as string;
            }
            return session;
        }
    },
});