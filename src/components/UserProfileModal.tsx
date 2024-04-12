import Dialog from "@/components/Dialog";
import {Input} from "@/components/ui/input";
import {Label} from "@/components/ui/label";

type Props = {
    onClose: () => void,
    onOk: () => void,
};

export default function UserProfileModal({onClose, onOk} : Props) {
    return (
        <Dialog title="Please complete your user information" onClose={onClose} onOk={onOk}>
            <form className="flex flex-row justify-center">
                <div></div>
                <div className="flex flex-col px-4">
                    <Label htmlFor="firstName" className="py-3">First Name:</Label>
                    <Input type="text" id="firstName" name="firstName"/>
                    <Label htmlFor="lastName" className="py-3">Last Name:</Label>
                    <Input type="text" id="lastName" name="lastName"/>
                </div>
                <div className="flex flex-col px-4">
                    <Label htmlFor="email" className="py-3">Email:</Label>
                    <Input type="email" id="email" name="email"/>
                    <Label htmlFor="password" className="py-3">New Password:</Label>
                    <Input type="password" id="password" name="password" className="w-[250px]"/>
                </div>
            </form>
        </Dialog>
    );
}