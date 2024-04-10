import NextAuth from 'next-auth';
import CredentialsProvider from 'next-auth/providers/credentials';
import {compare} from 'bcrypt';
import {sql} from "@vercel/postgres";
import {z} from "zod";

const emailSchema = z.string().email();

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

                    const user = response.rows[0];

                    const passwordCorrect = await compare(credentials?.password || '', user.password);

                    if(passwordCorrect){
                        return {
                            id: user.id,
                            email: user.email,
                        };
                    }
                    return null;
                } catch (e){
                    return null;
                }
            }
        })
    ]
});

export { handler as GET, handler as POST };