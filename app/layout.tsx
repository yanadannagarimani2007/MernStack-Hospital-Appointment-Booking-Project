import type { Metadata } from "next";
import "./globals.css";


export const metadata: Metadata = {
    title: "MediCare Plus | Hospital Appointments",
    description: "Book an appointment with the best doctors near you",
};

export default function RootLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <html lang="en">
            <head>
                <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap" rel="stylesheet" />
            </head>
            <body>
                {children}
            </body>
        </html>
    );
}
