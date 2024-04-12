import NextAuth from 'next-auth';
import CredentialsProvider from 'next-auth/providers/credentials';
import {compare} from 'bcrypt';
import {sql} from "@vercel/postgres";
import {z} from "zod";

const emailSchema = z.string().email();

const userSchema = z.object({
    id: z.number(),
    email: z.string().email(),
    first_name: z.string().optional().nullable(),
    last_name: z.string().optional().nullable(),
    faculty: z.string().optional().nullable(),
    department: z.string().optional().nullable(),
    year: z.string().optional().nullable(), //L2 or L3 as the year
    campus: z.string().optional().nullable(),
    group: z.string().optional().nullable(),
    group_english: z.string().optional().nullable(),
    group_pppe: z.string().optional().nullable(),
});


const handler = NextAuth({
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
            async authorize(credentials, req){
                try{
                    emailSchema.parse(credentials?.email);

                    const response = await sql`
                    SELECT * FROM users WHERE email = ${credentials?.email}
                    `;

                    const user =  response.rows[0];

                    if(!user) return null;

                    const passwordCorrect = await compare(credentials?.password || '', user.password);

                    if(passwordCorrect){
                        return {
                            id: user.id,
                            email: user.email,
                            ...user,
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
        async jwt({token, user}){
            if(user){
                const parsedUser= userSchema.parse(user);
                token.id = parsedUser.id;
                token.email = parsedUser.email;
                parsedUser.campus = "LUMINY";
                Object.assign(token, parsedUser);
            }
            return token;
        },
        async session({session, token}){
            if(token){
                const parsedToken = userSchema.parse(token);
                session.user = {...parsedToken};
            }
            return session;
        }
    },
});

export { handler as GET, handler as POST };