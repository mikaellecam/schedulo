import NextAuth, {type DefaultSession, User} from 'next-auth';
import CredentialsProvider from 'next-auth/providers/credentials';
import {compare} from 'bcryptjs';
import {sql} from "@vercel/postgres";
import { emailSchema, passwordSchema, userSchema } from "./lib/definitions";
import {JWT} from "@auth/core/jwt";

declare module "next-auth" {
    interface Session{
        user: {
            id: string,
            email: string,
            name: string,
            groups: string,
        } & DefaultSession["user"];
    }
}

interface ExtendedUser extends User{
    id: string;
    email: string;
    name: string;
    groups: string;
}

interface ExtendedJWT extends JWT {
    id: string;
    email: string;
    name: string;
    groups: string;
}


export const {
    handlers: { GET, POST},
    auth,
    signIn,
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
                email: {},
                password: {}
            },
            async authorize(credentials, req): Promise<ExtendedUser | null>{
                try{
                    if(!credentials?.email || !credentials?.password) return null;
                    const parsedEmail = emailSchema.parse(credentials.email);
                    const parsedPassword = passwordSchema.parse(credentials.password);

                    const response = await sql`
                    SELECT * FROM users WHERE email = ${parsedEmail}
                    `;

                    const resultRow =  response.rows[0];

                    if(!resultRow) return null;

                    const passwordCorrect = await compare(parsedPassword, resultRow.password);

                    //console.log("User id: ", resultRow.id);

                    if(passwordCorrect){
                        return {
                            id: resultRow.id,
                            email: resultRow.email,
                            name: resultRow.name,
                            groups: resultRow.groups
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
                //console.log("user in jwt callback: ", user);
                const parsedUser= userSchema.parse(user);
                token.id = parsedUser.id;
                token.email = parsedUser.email;
                token.name = parsedUser.name;
                token.groups = parsedUser.groups;
            }
            //console.log(token);
            return token as ExtendedJWT;
        },
        async session({session, token}){
            //console.log("token in session callback: ", token);
            if(token){
                //const parsedToken = userSchema.parse(token);
                session.user.id = token.id as string;
                session.user.name = token.name as string;
                session.user.email = token.email as string;
                session.user.groups = token.groups as string;
            }
            return session;
        }
    },
});