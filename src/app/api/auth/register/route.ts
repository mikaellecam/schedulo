import {NextResponse} from "next/server";
import { hash} from "bcrypt";
import {sql} from "@vercel/postgres";
import {z} from "zod";

const emailSchema = z.string().email();

export async function POST(request: Request){
    try{
        const {email, password} = await request.json();
        emailSchema.parse(email);

        if(!email || !password){
            return NextResponse.json({status: 400, message: "missing fields"});
        }

        const hashedPassword = await hash(password, 10);

        const verifyEmailExists = await sql`SELECT * FROM users WHERE email = ${email}`;
        if(verifyEmailExists.rowCount > 0){
            return NextResponse.json({status: 400, message: "email already exists"});
        }

        await sql`
            INSERT INTO users (email, password) 
            VALUES (${email}, ${hashedPassword})
        `;

    } catch(e){
        console.log({e});
        return NextResponse.json({status: 500, message: "error"});
    }
    return NextResponse.json({status: 201, message: "success"});
}