import {getServerSession} from "next-auth";
import {redirect} from "next/navigation";

export default async function Home() {
  const session = await getServerSession();
  if(session) {
    console.log(session.user.first_name);
    if(session.user.first_name === undefined)
      redirect("/timetable?showDialog=y")
    else
      redirect("/timetable");
  } else
      redirect("/auth/login");
}
