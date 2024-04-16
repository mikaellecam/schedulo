import Calendar from "@/components/Calendar";
import UserProfileModal from "@/components/UserProfileModal";
import {Suspense} from "react";
import {auth} from "@/auth";
import {redirect} from "next/navigation";
import Navbar from "@/components/Navbar";
import type {Metadata} from "next";

export const metadata: Metadata = {
    title: "Timetable",
    description: "Main page for timetable.",
};

export default async function TimeTable(){

    const session = await auth();
    if(!session) {redirect("/auth/login");}
    console.log("Session user inside timetable page: ", session.user);

    return (
        <div className="h-[100vh]">
            <Navbar/>
            <Suspense>
                <UserProfileModal user={{
                    name: session.user.name,
                    groups: session.user.groups,
                    email: session.user.email
                }}/>
            </Suspense>
            <div className="flex justify-center items-center h-[93vh]">
                <Calendar />
            </div>
        </div>
    );
}