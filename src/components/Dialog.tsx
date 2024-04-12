"use client";

import {useSearchParams} from "next/navigation";
import {useEffect, useRef} from "react";
import {Button} from "@/components/ui/button";

type Props = {
    title: string,
    onClose: () => void,
    onOk: () => void,
    children: React.ReactNode,
}

export default function Dialog({ title, onClose, onOk, children} : Props){
    const searchParams = useSearchParams();
    const dialogRef = useRef<null | HTMLDialogElement>(null);
    const showDialog = searchParams.get('showDialog');

    useEffect(() => {
       if(showDialog === 'y'){
           dialogRef.current?.showModal();
       } else {
           dialogRef.current?.close();
       }
    }, [showDialog]);

    const closeDialog = () => {
      dialogRef.current?.close();
      onClose();
    };

    const clickOk = () => {
        onOk();
        closeDialog();
    };

    return showDialog === 'y'
        ? (
            <dialog ref={dialogRef}
                    className="fixed top-50 left-50 -translate-x-50 -translate-y-50 z-10 rounded-xl border-gray-800 border-2 backdrop:bg-gray-800/50">
                <div className="w-[650px] max-w-fullbg-gray-200 flex flex-col">
                    <div className="flex flex-row justify-between items-center mb-4 pt-2 px-5 border-b-2 border-gray-800">
                        <h1 className="text-2xl my-4">{title}</h1>
                        {/*<Button onClick={closeDialog}>x</Button>*/}
                    </div>
                    <div className="px-5">
                        {children}
                        <div className="flex flex-row justify-end mt-2">
                            <Button onClick={clickOk}>Save Changes</Button>
                            <Button variant="outline" onClick={closeDialog}>Cancel</Button>
                        </div>
                    </div>
                </div>
            </dialog>
        ) : null;

}