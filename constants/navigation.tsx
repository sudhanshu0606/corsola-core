import { Headset, LayoutDashboard, Settings2 } from "lucide-react";

const primaryNav = [
    { icon: <LayoutDashboard />, label: "Dashboard", href: "/" },
    { icon: <LayoutDashboard />, label: "Subscriptions", href: "/subscriptions" },
    { icon: <LayoutDashboard />, label: "Something", href: "/something" },
    { icon: <LayoutDashboard />, label: "Something Else", href: "/something-else" },
    { icon: <LayoutDashboard />, label: "Something Else", href: "/something-else-else" },
];

const secondaryNav = [
    { icon: <Headset />, label: "Help and Support", href: "help.unown.com" },
    { icon: <Settings2 />, label: "Settings", href: "settings.unown.com" },
];

export { primaryNav, secondaryNav }