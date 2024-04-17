import Image from "next/image";
import {auth} from "@/auth";
import {redirect} from "next/navigation";
import Link from "next/link";

export default async function UserProfile() {
    const session = await auth();
    if(!session) redirect("/auth/login");

    const name = session.user.name ? session.user.name : "John Doe";

    return (
        <Link className="flex items-center" href={"/timetable?showDialog=y"}>
            <Image src="https://avatars.githubusercontent.com/u/6223174?v=4" width={30} height={30} alt="Profile Picture" className="rounded-full h-8 w-8" />
            <span className="mx-2">{name}</span>
        </Link>
    );
}