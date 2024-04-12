"use client";

import {signOut} from "next-auth/react";
import {Button} from "@/components/ui/button";

export default function LogoutButton(){
    return (
        <form action={() => {
            signOut({callbackUrl: "/auth/login"}).then(() => {console.log("Logged out")});
        }}>
            <Button type={"submit"}>Logout</Button>
        </form>
    );
}