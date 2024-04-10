import LoginForm from "@/components/LoginForm";
import {getServerSession} from "next-auth";
import {redirect} from "next/navigation";
import type {Metadata} from "next";

export const metadata: Metadata = {
    title: "Login Page",
    description: "Login to your account.",
};

export default async function LoginPage() {
    const session = await getServerSession();
    if(session) redirect("/");

    return <LoginForm/>;
}