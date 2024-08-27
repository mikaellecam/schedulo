import {NextResponse} from "next/server";
import {hash} from "bcryptjs";
import {sql} from "@vercel/postgres";
import { emailSchema } from "@/lib/definitions";

export async function POST(request: Request){
    try{
        const {email, password} = await request.json();
        const parsedEmail = emailSchema.parse(email);

        if(!email || !password){
            return NextResponse.json({status: 400, message: "missing fields"});
        }

        const verifyEmailExists = await sql`SELECT * FROM users WHERE email = ${parsedEmail}`;

        if(verifyEmailExists.rowCount == null){
            return NextResponse.json({status: 500, message: "Internal server error"});
        }

        if(verifyEmailExists.rowCount! > 0){
            return NextResponse.json({status: 400, message: "email already exists"});
        }

        const hashedPassword = await hash(password, 10);

        await sql`
            INSERT INTO users (email, password, name, calendar_url) 
            VALUES (${email}, ${hashedPassword}, '', '')
        `;

    } catch(e){
        console.log(e);
        return NextResponse.json({status: 500, message: "Internal Server Error"});
    }
    return NextResponse.json({status: 201, message: "success"});
}