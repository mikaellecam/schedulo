import {NextResponse} from "next/server";
import {sql} from "@vercel/postgres";
import {dataBaseUserSchema, passwordSchema} from "@/lib/definitions";
import {auth} from "@/auth";
import {hash} from "bcryptjs";

export async function POST(request: Request) {
    try {
        const session = await auth();
        if(!session) return NextResponse.json({status: 401, message: "unauthorized"});

        const json = await request.json();

        const {name, groups, email, newPassword} = dataBaseUserSchema.parse(json);

        const verifyEmailExists = await sql`SELECT * FROM users WHERE email = ${email}`;
        if(verifyEmailExists.rowCount > 0 && verifyEmailExists.rows[0].email !== session.user.email){
            return NextResponse.json({status: 400, message: "email already exists"});
        }

        await sql`
                UPDATE users
                SET name = ${name}, groups = ${groups}, email = ${email}
                WHERE id = ${session.user.id}
            `;


        if (newPassword !== "" && passwordSchema.parse(newPassword)) {
            const hashedNewPassword = await hash(newPassword, 10);

            await sql`
                UPDATE users
                SET password = ${hashedNewPassword}
                WHERE id = ${session.user.id}
            `;
        }

        return NextResponse.json({status: 200, message: "success"});
    }catch (e) {
        return NextResponse.json({status: 500, message: "internal server error"});
    }
}