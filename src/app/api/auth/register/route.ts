import {NextResponse} from "next/server";
import {hash} from "bcryptjs";
import {sql} from "@vercel/postgres";
import { nameSchema, calendar_urlSchema } from "@/lib/definitions";

export async function POST(request: Request){
    try{
        const {name, password, calendar_url} = await request.json();

        if(!name || !password || !calendar_url){
            return NextResponse.json({status: 400, message: "missing fields"});
        }

        const parsedName = nameSchema.parse(name);
        const parsedCalendarUrl = calendar_urlSchema.parse(calendar_url);

        const verifyNameExists = await sql`SELECT * FROM users WHERE name = ${parsedName}`;

        if(verifyNameExists.rowCount == null){
            return NextResponse.json({status: 500, message: "Internal server error"});
        }

        if(verifyNameExists.rowCount! > 0){
            return NextResponse.json({status: 400, message: "Account already exists"});
        }

        const hashedPassword = await hash(password, 10);

        await sql`
            INSERT INTO users (password, name, calendar_url) 
            VALUES (${hashedPassword}, ${parsedName}, ${parsedCalendarUrl})
        `;

    } catch(e){
        console.log(e);
        return NextResponse.json({status: 500, message: "Internal Server Error"});
    }
    return NextResponse.json({status: 201, message: "User has been registered successfully"});
}