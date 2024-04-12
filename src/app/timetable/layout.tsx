import type { Metadata } from "next";
import "./../globals.css";
import "../../styles/timetable.css";
import Navbar from "@/components/Navbar";

export const metadata: Metadata = {
    title: "Timetable",
    description: "Main page for timetable.",
};

export default async function RootLayout({children,}: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <html lang="en">
            <body className="min-h-screen">
                <Navbar/>
                {children}
            </body>
        </html>
    );
}
