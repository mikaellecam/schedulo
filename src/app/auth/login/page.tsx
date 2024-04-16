import LoginForm from "@/components/LoginForm";
import {auth} from "@/auth";
import {redirect} from "next/navigation";
import type {Metadata} from "next";

export const metadata: Metadata = {
    title: "Login Page",
    description: "Login to your account.",
};

export default async function LoginPage() {
    const session = await auth();
    if(session) redirect("/");
    return <LoginForm/>;
}