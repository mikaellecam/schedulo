import {DefaultSession} from "next-auth";

declare module "next-auth" {
    interface Session{
        user: {
            id: number,
            email: string,
            first_name?: string | null,
            last_name?: string | null,
            faculty?: string | null,
            department?: string | null,
            year?: string | null,
            campus?: string | null,
            group?: string | null,
            group_english?: string | null,
            group_pppe?: string | null,
        } & DefaultSession["user"];
    }
}