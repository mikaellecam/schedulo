"use client";

import {useSearchParams} from "next/navigation";
import {useEffect, useRef} from "react";
import {Button} from "@/components/ui/button";
import Image from "next/image";

type Props = {
    title: string,
    children: React.ReactNode,
}

export default function Dialog({ title, children} : Props){
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



    return showDialog === 'y'
        ? (
            <dialog ref={dialogRef}
                    className="fixed top-50 left-50 -translate-x-50 -translate-y-50 z-10 rounded-xl border-gray-800 border-2 backdrop:bg-gray-800/50">
                <div className="w-[750px] h-fit max-w-fullbg-gray-200 flex flex-col">
                    <div className="flex flex-row justify-between items-center mb-4 px-5 border-b-2 border-gray-800">
                        <h1 className="text-2xl my-4">{title}</h1>
                        <Button variant="outline" onClick={() => {dialogRef.current?.close()}}>
                            <Image src="/closeModalIcon.svg" alt="Closing icon for modal" width={30} height={30}/>
                        </Button>
                    </div>
                    <div className="flex flex-col h-full justify-end">
                        {children}
                    </div>
                </div>
            </dialog>
        ) : null;
}