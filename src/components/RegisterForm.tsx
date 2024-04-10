"use client";

import {zodResolver} from "@hookform/resolvers/zod";
import {useForm} from "react-hook-form";
import {z} from "zod";
import React, {FormEvent, useState} from "react";
import {signIn} from "next-auth/react";
import {useRouter} from 'next/navigation'

import { Button } from "@/components/ui/button"
import {
    Form,
    FormControl, FormDescription,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"

const formSchema = z.object({
    email: z.string().email(),
    password: z.string().min(6),
});


export default function RegisterForm() {
    const router = useRouter();
    const [errorMessage, setErrorMessage] = useState("");

    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            email: "",
            password: "",
        }
    });

    async function onSubmit(values: z.infer<typeof formSchema>) {
        const response = await fetch("/api/auth/register", {
            method: "POST",
            body: JSON.stringify({
                email: values["email"],
                password: values["password"]
            }),
        });
        const json = await response.json();

        if(json["status"] === 400){
            setErrorMessage("Email already exists")
        }

        await signIn("credentials", {
            email: values["email"],
            password: values["password"],
            redirect: false,
        });

        if (json["status"] === 201) {
            router.push("/timetable");
            router.refresh();
        } else {
            setErrorMessage("Internal server error");
        }

        return;
    }

    return (
        <Form {...form}>
            <div className="min-h-svh min-w-svw flex items-center justify-center">

                <form onSubmit={form.handleSubmit(onSubmit)}
                      className="m-auto p-4 rounded-2xl w-max h-3/6 space-y-8 flex flex-col justify-center items-center border-2">
                    <h1 className="text-3xl text-center p-4">Register</h1>
                    <FormField
                        control={form.control}
                        name="email"
                        render={({field}) => (
                            <FormItem className="m-16 space-y-2">
                                <FormLabel className="text-base">Email</FormLabel>
                                <FormControl>
                                    <Input {...field} className="w-[280px]"
                                           placeholder="example@email.com" {...field} />
                                </FormControl>
                                <FormMessage/>
                            </FormItem>
                        )}
                    />
                    <FormField
                        control={form.control}
                        name="password"
                        render={({field}) => (
                            <FormItem className="m-16">
                                <FormLabel className="text-base">Password</FormLabel>
                                <FormControl>
                                    <Input {...field} className="w-[280px]" type="password"/>
                                </FormControl>
                                <FormDescription>
                                    Password must be at least 6 characters.
                                </FormDescription>
                                <FormMessage/>
                            </FormItem>
                        )}
                    />
                    {errorMessage && <p className="text-red-500">{errorMessage}</p>}
                    <div className="text-sm text-gray-500">Already have an account?{" "}
                        <a className="relative group" href="/auth/login">
                            <span className="text-blue-600 hover:text-blue-900">Login</span>
                            <span
                                className="absolute -bottom-1 left-1/2 w-0 h-0.5 bg-blue-900 group-hover:w-1/2 group-hover:transition-all"></span>
                            <span
                                className="absolute -bottom-1 right-1/2 w-0 h-0.5 bg-blue-900 group-hover:w-1/2 group-hover:transition-all"></span>
                        </a>
                    </div>

                    <Button type="submit" variant="outline" className="m-4">Register</Button>
                </form>
            </div>
        </Form>
);
}