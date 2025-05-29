"use client"

import React, { useEffect, useState } from 'react'
import { usePathname } from 'next/navigation'

import { toast } from "sonner"

import { getUserSubscriptions } from '@/actions/getUserSubscriptions'

import { SubscriptionForm } from '@/components/forms/subscribe'
import { Button } from '@/components/ui/button'
import { Modal } from '@/components/wrappers/modal'

import { useIsHydrated } from '@/hooks/use-is-hydrated'

import { useSessionStorage } from '@/store/storage'
import { useUser } from '@/store/user'
import { useSubscriber } from '@/store/subscriber'

import { Plus } from 'lucide-react'

const Template = ({
    children
}: {
    children: React.ReactNode
}) => {

    const pathname = usePathname();

    const hydrated = useIsHydrated()

    const [status, setStatus] = useState({ isLoading: true });
    const [error, setError] = useState<string | null>(null);

    const { electron, setElectron, removeElectron } = useSessionStorage()
    const { user, setUser } = useUser()
    const { subscriber, setSubscriber } = useSubscriber()

    useEffect(() => {

        const isSubscriptionsPage = pathname.split('/').includes("subscriptions");

        if (!hydrated || !electron || !isSubscriptionsPage) return

        const fetchUserSubscriptions = async () => {

            try {

                setError(null);
                setStatus(prev => ({ ...prev, isLoading: true }));

                if (!user?.uuid) { setError("User ID not available."); return }

                const { error, subscriptions } = await getUserSubscriptions(user?.uuid)
                error && setError(error);
                subscriptions && setSubscriber({ subscriberId: user?.uuid, subscriptions });

            } catch (error) {

                setError("Failed to fetch your account details.");
                toast.error("Failed to fetch your account details. Please try again later.");

            } finally { setStatus(prev => ({ ...prev, isLoading: false })) }

        }

        fetchUserSubscriptions()

    }, [hydrated, pathname, user?.uuid])

    if (status.isLoading) {
        return (
            <main className='flex flex-col gap-4'>
                <header className='flex items-center justify-between px-2'>
                    <h1 className='font-medium text-2xl'>subscriptions</h1>
                    <Modal
                        trigger={<Button className='cursor-pointer'><Plus /><span>subscribe</span></Button>}
                        title='Subscribe'
                        description='Subscribe to a new stock'
                        content={<SubscriptionForm />}
                    />
                </header>
                <section className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                    {[...Array(5)].map((_, i) => (
                        <div key={i} className="animate-pulse border rounded-lg p-4 bg-white dark:bg-zinc-900">
                            <div className="h-5 bg-zinc-200 dark:bg-zinc-700 rounded w-1/2 mb-2"></div>
                            <div className="h-4 bg-zinc-200 dark:bg-zinc-700 rounded w-3/4 mb-1"></div>
                            <div className="h-4 bg-zinc-200 dark:bg-zinc-700 rounded w-2/4"></div>
                        </div>
                    ))}
                </section>
            </main>
        )
    }

    if (error) {
        return (
            <main className='flex flex-col gap-4'>
                <header className='flex items-center justify-between px-2'>
                    <h1 className='font-medium text-2xl'>subscriptions</h1>
                    <Modal
                        trigger={<Button className='cursor-pointer'><Plus /><span>subscribe</span></Button>}
                        title='Subscribe'
                        description='Subscribe to a new stock'
                        content={<SubscriptionForm />}
                    />
                </header>
                <section className="flex flex-col items-center justify-center text-center text-muted-foreground py-16 border">
                    <p className="text-lg font-medium">{error}</p>
                </section>
            </main>
        )
    }

    return <>{children}</>
}

export default Template