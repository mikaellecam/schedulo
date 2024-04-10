import RegisterForm from "@/components/RegisterForm";
import {getServerSession} from "next-auth";
import {redirect} from "next/navigation";
import type {Metadata} from "next";


export const metadata: Metadata = {
    title: "Register Page",
    description: "Create a new account.",
};

export default async function RegisterPage(){
    const session = await getServerSession();
    if(session){
        redirect("/");
    }

    return <RegisterForm />
};