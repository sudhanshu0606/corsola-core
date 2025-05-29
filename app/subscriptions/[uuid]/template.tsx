"use client"

import React, { useEffect, useMemo } from 'react'
import { usePathname } from 'next/navigation';

import { ISubscription } from '@/interfaces';

import { useNotificationsStore } from '@/store/notifications';
import { useSubscriber } from '@/store/subscriber';

const Template = ({
    children
}: {
    children: React.ReactNode
}) => {

    const pathname = usePathname();
    const uuid = useMemo(() => pathname.split('/')[2], [pathname]);

    const { setSubscription, setEnabledProfiles } = useNotificationsStore()
    const { subscriber } = useSubscriber();

    const subscription: ISubscription | null = useMemo(() => {
        return subscriber?.subscriptions?.find(sub => sub.uuid === uuid) || null;
    }, [subscriber?.subscriptions, uuid]);

    useEffect(() => {
        subscription && setSubscription(subscription);
        subscription?.notifications &&
            setEnabledProfiles(subscription.notifications);
    }, [subscription]);

    return <>{children}</>
}

export default Template