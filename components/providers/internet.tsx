"use client";

import { useEffect } from "react";

import { useVariables } from "@/store/variables";

const InternetProvider = ({
    children
}: {
    children: React.ReactNode
}) => {

    const { variables, setVariables, resetVariables } = useVariables()

    useEffect(() => {

        const checkInternetStability = async () => {

            try {

                const startTime = performance.now();
                const response = await fetch("https://corsola-ping.vercel.app/api/ping", {
                    method: "HEAD",
                    cache: "no-cache",
                });
                const endTime = performance.now();

                const latency = endTime - startTime;
                const stable = response.ok && latency < 1000;

                stable && setVariables({ connectivity: "online" })

            } catch { setVariables({ connectivity: "offline" }) }

        };

        const handleOnline = () => setVariables({ connectivity: "online" });
        const handleOffline = () => setVariables({ connectivity: "offline" });

        const interval = setInterval(checkInternetStability, 10000);
        checkInternetStability();

        window.addEventListener("online", handleOnline);
        window.addEventListener("offline", handleOffline);

        return () => {

            clearInterval(interval);

            window.removeEventListener("online", handleOnline);
            window.removeEventListener("offline", handleOffline);

        };

    }, []);

    return <>{children}</>;
}

export { InternetProvider }