"use client";

import { useState } from "react";

import Link from "next/link";
import { usePathname } from "next/navigation";

import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";

import { LoginForm } from "@/components/forms/login";
import { Modal } from "@/components/wrappers/modal";

import { primaryNav, secondaryNav } from "@/constants/navigation";

import { useLocalStorage } from "@/store/storage";

import { PanelLeft } from "lucide-react";

interface ILayoutClientProps { children: React.ReactNode }

const LayoutClient = ({
    children
}: ILayoutClientProps
) => {

    const pathname = usePathname();

    const [sidebarVisible, setSidebarVisible] = useState(true);

    const { proton, setProton, removeProton } = useLocalStorage();

    const isActiveRoute = (href: string) => pathname === href || pathname.startsWith(`${href}/`);

    return (
        <main className="flex w-screen h-screen">
            <aside className={`h-full w-60 border-r p-4 flex flex-col justify-between ${sidebarVisible ? "" : "hidden"}`}>
                <div>
                    <header className="font-black text-3xl">Dashboard</header>
                    <nav className="mt-4">
                        <ul className="space-y-2">
                            {primaryNav.map((item) => (
                                <li key={item.href}>
                                    <Link href={item.href}>
                                        <Button
                                            variant={isActiveRoute(item.href) ? "secondary" : "ghost"}
                                            className="w-full justify-start gap-2 cursor-pointer"
                                        >
                                            {item.icon}
                                            <span>{item.label}</span>
                                        </Button>
                                    </Link>
                                </li>
                            ))}
                        </ul>
                    </nav>
                </div>
                <div className="space-y-4">
                    <Separator />
                    <nav>
                        <ul>
                            {secondaryNav.map((item) => (
                                <li key={item.href}>
                                    <Link href={item.href}>
                                        <Button variant="ghost" className="w-full justify-start gap-2 cursor-pointer">
                                            {item.icon}
                                            <span>{item.label}</span>
                                        </Button>
                                    </Link>
                                </li>
                            ))}
                        </ul>
                    </nav>
                    <Separator />
                    <footer className="w-full">
                        {proton ? (
                            <Modal
                                trigger={<Button variant="destructive" className="w-full">Log Out</Button>}
                                title="Log Out"
                                description="Are you sure you want to log out? You will be redirected to the login page."
                                content={
                                    <Button
                                        variant="destructive"
                                        onClick={removeProton}
                                        className="w-full"
                                    >
                                        Log Out
                                    </Button>
                                }
                            />
                        ) : (
                            <Modal
                                trigger={<Button className="w-full cursor-pointer">Log In</Button>}
                                title="Sign In to Your Account"
                                description="Please enter your credentials to access your dashboard and manage your tasks."
                                content={
                                    <div className="flex flex-col gap-4">
                                        <div className="flex justify-between items-center">
                                            <Button className="w-[49%]">Google</Button>
                                            <Button className="w-[49%]">Facebook</Button>
                                        </div>
                                        <div className="flex justify-center items-center gap-4">
                                            <div className="border border-black w-full"></div>
                                            <span>OR</span>
                                            <div className="border border-black w-full"></div>
                                        </div>
                                        <LoginForm />
                                    </div>
                                }
                            />
                        )}
                    </footer>
                </div>
            </aside>
            <main className="flex-1 flex flex-col">
                <header className="border-b p-4">
                    <Button
                        size="icon"
                        onClick={() => setSidebarVisible(!sidebarVisible)}
                        className='cursor-pointer'
                    >
                        <PanelLeft />
                    </Button>
                </header>
                <main className="flex-1 overflow-y-auto bg-gray-100 p-4 leading-2">{children}</main>
            </main>
        </main>
    );
}

export { LayoutClient }
