"use client";

import Image from "next/image";
import {useRouter} from "next/navigation";
import Link from "next/link";
import { useSession } from "next-auth/react";

export default function UserProfile(){
    //const [name, setName] = useState("");
    const session = useSession();
    const router = useRouter();

    if(!session){
        router.push("/auth/login");
        return;
    }


    // useEffect(() => {
    //     const fetchUserData = async () => {
    //         if(!session){
    //             router.push("/auth/login");
    //             return;
    //         }
    //         setName(session.user.name);
    //     }
    //     fetchUserData();
    // }, [router]);


    return (
        <Link className="flex items-center" href={"/timetable?showDialog=y"}>
            <Image src="https://avatars.githubusercontent.com/u/6223174?v=4" width={30} height={30} alt="Profile Picture" className="rounded-full h-8 w-8" />
            <span className="mx-2">{session.data?.user.name}</span>
        </Link>
    );
}




// export default async function UserProfile() {
//     const session = await auth();
//     if(!session) redirect("/auth/login");

//     const name = session.user.name ? session.user.name : "";

//     return (
//         <Link className="flex items-center" href={"/timetable?showDialog=y"}>
//             <Image src="https://avatars.githubusercontent.com/u/6223174?v=4" width={30} height={30} alt="Profile Picture" className="rounded-full h-8 w-8" />
//             <span className="mx-2">{name}</span>
//         </Link>
//     );
// }