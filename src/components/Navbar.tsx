import LogoutButton from "@/components/LogoutButton";
import UserProfile from "@/components/UserProfile";


export default function Navbar(){
    return (
        <nav className="flex justify-between items-center">
            <div className="mx-4 my-3">
                <a href="/" className="title">Schedulo</a>
            </div>
            <div className="flex mx-4 my-3">
                <UserProfile />
                <LogoutButton />
            </div>
        </nav>
    );
}