import LogoutButton from "@/components/LogoutButton";
import UserProfile from "@/components/UserProfile";
import Link from "next/link";


export default function Navbar(){
    return (
        <nav className="h-[7vh] flex justify-between items-center border-b-2">
            <div className="mx-4 my-3">
                <Link href="/" className="title">Schedulo</Link>
            </div>
            <div className="flex mx-4 my-3">
                <UserProfile />
                <LogoutButton />
            </div>
        </nav>
    );
}