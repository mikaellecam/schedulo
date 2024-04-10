import type { Metadata } from "next";
import "./../globals.css";
import "../../styles/timetable.css";
import { getServerSession } from "next-auth";
import Link from "next/link";
import LogoutButton from "@/components/LogoutButton";

export const metadata: Metadata = {
    title: "Timetable",
    description: "Main page for timetable.",
};

export default async function RootLayout({children,}: Readonly<{
    children: React.ReactNode;
}>) {
    const session = await getServerSession();

    return (
        <html lang="en">
            <body className="min-h-screen">
                <nav className="navbar">
                    {!!session  &&
                        <LogoutButton/>
                    }
                    {!session  &&
                        <Link href="/auth/login">Login</Link>
                    }
                </nav>
                {children}
            </body>
        </html>
    );
}
