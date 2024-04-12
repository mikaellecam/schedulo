import Calendar from "@/components/Calendar";
import UserProfileModal from "@/components/UserProfileModal";

export default async function TimeTable(){

    async function onClose(){
        "use server";
        console.log("Modal has closed");
    }

    async function onOk(){
        "use server";
        console.log("Ok has been clicked");
    }

    return (
        <>
            <UserProfileModal onClose={onClose} onOk={onOk} />
            <Calendar />
        </>
    );
}