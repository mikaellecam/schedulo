import RegisterForm from "@/components/RegisterForm";
import {auth} from "@/auth";
import {redirect} from "next/navigation";
import type {Metadata} from "next";


export const metadata: Metadata = {
    title: "Register Page",
    description: "Create a new account.",
};

export default async function RegisterPage(){
    const session = await auth();
    if(session){
        redirect("/timetable");
    }

    return <RegisterForm />
};