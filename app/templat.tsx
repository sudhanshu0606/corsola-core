"use client"

import React, { useEffect } from 'react'
import { usePathname } from 'next/navigation'

import axios from 'axios'
import { toast } from 'sonner'

import { useIsHydrated } from '@/hooks/use-is-hydrated'

import { useLocalStorage, useSessionStorage } from '@/store/storage'
import { useUser } from '@/store/user'
import { useVariables } from '@/store/variables'

const Template = ({
    children
}: {
    children: React.ReactNode
}) => {

    const pathname = usePathname();

    const hydrated = useIsHydrated()

    const { proton, setProton, removeProton } = useLocalStorage()
    const { electron, setElectron, removeElectron } = useSessionStorage()

    const { user, setUser } = useUser()

    const { variables, setVariables, resetVariables } = useVariables()

    useEffect(() => {

        if (!hydrated || !proton || variables?.connectivity === "offline") return;

        const doAuthenticate = () => new Promise(async (resolve, reject) => {

            try {

                if (!electron) {

                    const response = await axios.post("http://localhost:3001/api/refresh-token", { refreshToken: proton })
                    if (response?.status === 401) { removeProton(); removeElectron(); reject() }

                    if (response?.data?.jwtToken) { setElectron(response?.data?.jwtToken); resolve({}) }
                    else { reject() }

                }

                const { data } = await axios.get("/api/user", {
                    headers: { Authorization: `Bearer ${electron}` }
                })

                if (data?.user) {

                    setUser({
                        ...user,
                        uuid: data?.user?.uuid,
                        username: data?.user?.username,
                        email: data?.user?.email,
                        avatar: data?.user?.avatar,
                        regions: data?.user?.regions,
                        profiles: data?.user?.profiles
                    });

                    resolve(data?.user)

                } else { throw new Error() }

            } catch (err) { reject() }

        })

        toast.promise(doAuthenticate, {
            loading: 'Authenticating ...',
            success: (data: any) => data?.username ? `Welcome, ${data.username}!` : "You're now signed in.",
            error: 'Authentication failed. Please Login again.',
        })

    }, [hydrated, proton, electron, pathname])

    return <>{children}</>
}

export default Template
