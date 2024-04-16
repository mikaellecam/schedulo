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


        let usingNewPassword = false;
        if (newPassword !== "" && passwordSchema.parse(newPassword)) {
            const hashedNewPassword = await hash(newPassword, 10);
            usingNewPassword = true;

            await sql`
                UPDATE users
                SET password = ${hashedNewPassword}
                WHERE id = ${session.user.id}
            `;
        }
        console.log("Session before updating: ", session.user);

        //await unstable_update(session);

        console.log("Session after updating: ", session.user);

        return NextResponse.json({status: 200, message: "success"});
    }catch (e) {
        return NextResponse.json({status: 500, message: "internal server error"});
    }
}