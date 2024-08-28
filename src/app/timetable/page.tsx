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

    return (
        <div className="h-fit">
            <Navbar/>
            <Suspense>
                <UserProfileModal user={{
                    name: session.user.name,
                    calendar_url: session.user.calendar_url,
                }}/>
            </Suspense>
            <div className="flex justify-center items-center h-fit m-[3vh] mx-auto">
                <Calendar />
            </div>
        </div>
    );
}