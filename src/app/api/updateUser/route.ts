import {NextResponse} from "next/server";
import {sql} from "@vercel/postgres";
import {z} from "zod";
import {getServerSession} from "next-auth";
import {update} from "../auth/[...nextauth]/route";
import {hash} from "bcrypt";


export async function POST(request: Request) {
    try {
        const session = await getServerSession();
        if(!session) return NextResponse.json({status: 401, message: "unauthorized"});

        const {name, groups, email, newPassword} = await request.json();

        z.string().email().parse(email);

        console.log("Request attributes : ", name, groups, email, newPassword);

        const verifyEmailExists = await sql`SELECT * FROM users WHERE email = ${email}`;
        if(verifyEmailExists.rowCount > 0 && verifyEmailExists.rows[0].email !== session.user.email){
            console.log("pass");
            return NextResponse.json({status: 400, message: "email already exists"});
        }

        console.log("Session: ", session);

        await sql`
                UPDATE users
                SET name = ${name}, groups = ${groups}, email = ${email}
                WHERE id = ${session.user.id}
            `;


        if (newPassword !== "" && z.string().min(6).parse(newPassword)) {
            const hashedNewPassword = await hash(newPassword, 10);

            await sql`
                UPDATE users
                SET password = ${hashedNewPassword}
                WHERE id = ${session.user.id}
            `;
        }
        console.log("Session before updating: ", session.user);

        await update({...session.user, name: name, email: email, groups: groups});

        console.log("Session after updating: ", session.user);

        return NextResponse.json({status: 200, message: "success"});
    }catch (e) {
        return NextResponse.json({status: 500, message: "internal server error"});
    }
}