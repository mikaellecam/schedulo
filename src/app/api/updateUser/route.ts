import {NextResponse} from "next/server";
import {sql} from "@vercel/postgres";
import {calendar_urlSchema, dataBaseUserSchema, nameSchema, passwordSchema} from "@/lib/definitions";
import {auth} from "@/auth";
import {hash} from "bcryptjs";

export async function POST(request: Request) {
    try {
        const session = await auth();
        if(!session) return NextResponse.json({status: 401, message: "unauthorized"});

        const form = await request.json();

        const name = nameSchema.parse(form.name);

        const verifyNameExists = await sql`SELECT * FROM users WHERE name = ${name}`;


        if(verifyNameExists.rowCount === null){
            return NextResponse.json({status: 500, message: "Internal server error"});
        }

        if(verifyNameExists.rows.length !== 0){
            return NextResponse.json({status: 400, message: "Name is already used"});
        }

        const calendar_url = calendar_urlSchema.parse(form.calendar_url);

        await sql`
                UPDATE users
                SET name = ${name}, calendar_url = ${calendar_url}
                WHERE id = ${session.user.id}
            `;


        if (form.newPassword !== "" && passwordSchema.parse(form.newPassword)) {
            const hashedNewPassword = await hash(form.newPassword, 10);

            await sql`
                UPDATE users
                SET password = ${hashedNewPassword}
                WHERE id = ${session.user.id}
            `;
        }

        return NextResponse.json({status: 200, message: "User updated successfully"});
    }catch (e) {
        return NextResponse.json({status: 500, message: "Internal Server Error"});
    }
}