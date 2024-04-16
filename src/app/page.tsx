import {auth} from "@/auth";
import {redirect} from "next/navigation";

export default async function Home() {
  const session = await auth();
  if(session) {
    console.log(session.user.name);
    if(session.user.name === "")
      redirect("/timetable?showDialog=y")
    else
      redirect("/timetable");
  } else
      redirect("/auth/login");
}
