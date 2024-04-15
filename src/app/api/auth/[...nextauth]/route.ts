import NextAuth, {User} from 'next-auth';
import CredentialsProvider from 'next-auth/providers/credentials';
import {compare} from 'bcrypt';
import {sql} from "@vercel/postgres";
import {z} from "zod";

const emailSchema = z.string().email();

const userSchema = z.object({
    id: z.number(),
    email: z.string().email(),
    name: z.string().optional().nullable(),
    groups: z.string().optional().nullable(),
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

                    console.log("User id: ", user.id);

                    if(passwordCorrect){
                        return {
                            id: user.id,
                            email: user.email,
                            name: user.name,
                            groups: user.groups
                        } as User;
                    }
                    return null;
                } catch (e){
                    return null;
                }
            }
        })
    ],
    callbacks: {
        async jwt({token, user, trigger, session}){
            if(user){
                console.log("user in jwt callback: ", user);
                const parsedUser= userSchema.parse(user);
                token.id = parsedUser.id;
                token.email = parsedUser.email;
                token.name = parsedUser.name;
                token.groups = parsedUser.groups;
            }
            if(trigger === "update" && session) {
                token = {...token, user : session};
                return token;
            }
            console.log(token);
            return token;
        },
        async session({session, token, user}){
            console.log("token in session callback: ", token);
            if(token){
                const parsedToken = userSchema.parse(token);
                session.user.id = parsedToken.id;
                session.user.name = parsedToken.name;
                session.user.email = parsedToken.email;
                session.user.groups = parsedToken.groups;
            }
            return session;
        }
    },
});

export { handler as GET, handler as POST, handler as update };