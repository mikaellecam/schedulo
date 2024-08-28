"use client";

import Dialog from "@/components/Dialog";
import {Input} from "@/components/ui/input";
import {Button} from "@/components/ui/button";
import {Toaster} from "@/components/ui/toaster";
import {toast} from "@/components/ui/use-toast";
import {Form, FormControl, FormField, FormItem, FormLabel, FormMessage} from "@/components/ui/form";

import Image from "next/image";
import {z} from "zod";
import {zodResolver} from "@hookform/resolvers/zod";

import React, {useState} from "react";
import {useForm} from "react-hook-form";
import { useRouter } from "next/router";

type Props = {
    user: {
        name: string,
        calendar_url: string,
    },
};

const formSchema = z.object({
    name: z.string().min(1, "Cannot be empty"),
    calendar_url: z.string().min(1, "Cannot be empty"),
    newPassword: z.string()
});

export default function UserProfileModal({user} : Props) {
    const [errorMessage, setErrorMessage] = useState("");
    //const router = useRouter();

    const form = useForm<z.infer<typeof formSchema>>({
       resolver: zodResolver(formSchema),
       defaultValues: {
           name: user.name ? user.name : "",
           calendar_url: user.calendar_url ? user.calendar_url : "",
           newPassword: "",
       }
    });


    const handleSubmit = async ({name, calendar_url, newPassword}: z.infer<typeof formSchema>) => {
        console.log(name, calendar_url, newPassword);
        const response = await fetch("/api/updateUser", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({name, calendar_url, newPassword}),
        });
        const json = await response.json();

        if(response.status === 400 || response.status === 500) {
            setErrorMessage(json["message"]);
            return;
        }

        toast({title: "User information updated", duration: 5000});
        //router.push("/timetable");
        return;
    }

    return (
        <Dialog title="User Information">
            <Form {...form}>
                <form id="userProfileModalForm" className="flex flex-row justify-evenly items-center w-full" onSubmit={form.handleSubmit(handleSubmit)}>
                    <div className="w-[90px] flex justify-center">
                        <Image src="https://avatars.githubusercontent.com/u/6223174?v=4" alt="Profile Picture" width={90}
                            height={90} className="rounded-full"/>
                    </div>
                    <div className="flex flex-col px-4">
                        <FormField
                            control={form.control}
                            name="name"
                            render={({field}) => (
                                <FormItem>
                                    <FormLabel>Name:</FormLabel>
                                    <FormControl>
                                        <Input {...field} type="text" placeholder="John Doe" className="border-2 border-gray-800 mb-3" />
                                    </FormControl>
                                    <FormMessage/>
                                </FormItem>
                            )}
                        />

                        <FormField
                            control={form.control}
                            name="calendar_url"
                            render={({field}) => (
                                <FormItem>
                                    <FormLabel>Calendar Url:</FormLabel>
                                    <FormControl>
                                        <Input {...field} type="text" placeholder="https://ade...." className="border-2 border-gray-800" />
                                    </FormControl>
                                    <FormMessage/>
                                </FormItem>
                            )}
                        />
                    </div>
                        <FormField
                            control={form.control}
                            name="newPassword"
                            render={({field}) => (
                                <FormItem>
                                    <FormLabel>New Password: (optional)</FormLabel>
                                    <FormControl>
                                        <Input {...field} type="password" className="border-2 border-gray-800"/>
                                    </FormControl>
                                    <FormMessage/>
                                </FormItem>
                            )}
                        />
                    
                </form>
                <div className="flex flex-row justify-end mt-5">
                    <div className="flex justify-center items-center">
                        {errorMessage && <p className="text-red-500">{errorMessage}</p>}
                    </div>
                    <Button type="submit" form="userProfileModalForm">Save Changes</Button>
                </div>
                <Toaster/>
            </Form>
        </Dialog>
    );
}