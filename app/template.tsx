"use client";

import React, { useEffect } from 'react';
import { usePathname } from 'next/navigation';

import axios from 'axios';
import { toast } from 'sonner';

import { useIsHydrated } from '@/hooks/use-is-hydrated';

import { useLocalStorage, useSessionStorage } from '@/store/storage';
import { useUser } from '@/store/user';
import { useVariables } from '@/store/variables';

const Template = ({
    children
}: {
    children: React.ReactNode
}) => {

    const pathname = usePathname();

    const hydrated = useIsHydrated();

    const { proton, setProton, removeProton } = useLocalStorage();
    const { electron, setElectron, removeElectron } = useSessionStorage();

    const { user, setUser } = useUser();
    const { variables } = useVariables();

    useEffect(() => {

        if (!hydrated || !proton || variables?.connectivity === "offline") return;

        const doAuthenticate = async () => {

            try {

                let token = electron;

                if (!token) {
                    const response = await axios.post("https://corsola-authentication.vercel.app/api/refresh-token", { refreshToken: proton });

                    if (response?.status === 401) throw new Error("Unauthorized");
                    if (!response?.data?.jwtToken) throw new Error("Token refresh failed");

                    token = response.data.jwtToken;
                    setElectron(token);
                }

                const { data } = await axios.get("/api/user", {
                    headers: { Authorization: `Bearer ${token}` }
                });

                if (!data?.user) throw new Error("No user in response");

                setUser({ ...user, ...data.user });
                return data.user;

            } catch (err) {

                removeProton();
                removeElectron();
                throw err;

            }

        };

        toast.promise(doAuthenticate(), {
            loading: 'Authenticating...',
            success: (data: any) => data?.username ? `Welcome, ${data.username}!` : "You're now signed in.",
            error: (error) => error?.response?.data?.message || 'Authentication failed. Please login again.',
        });

    }, [hydrated, proton, pathname]);

    return <>{children}</>;
};

export default Template;
