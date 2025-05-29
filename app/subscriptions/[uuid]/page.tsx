'use client';

import React, { useState } from 'react';

import Overview from '@/app/subscriptions/[uuid]/_overview';
import Settings from '@/app/subscriptions/[uuid]/_settings';

import { Button } from '@/components/ui/button';
import { useNotificationsStore } from '@/store/notifications';

const Page = () => {

    const [section, setSection] = useState<'overview' | 'settings'>('overview');

    const { subscription } = useNotificationsStore()

    const toggleSection = () => {
        setSection(prev => (prev === 'overview' ? 'settings' : 'overview'));
    };

    if (!subscription) {
        return (
            <div className="flex flex-col items-center justify-center h-screen text-center px-4">
                <h1 className="text-2xl font-bold">No Subscription Found</h1>
                <p className="text-lg text-gray-700 mt-2">Please check your subscription ID or try again later.</p>
            </div>
        );
    }

    return (
        <main className="flex flex-col gap-4">

            <header className="flex items-center justify-between px-2">
                <h1 className="text-3xl font-bold capitalize">{section}</h1>
                <Button onClick={toggleSection}>
                    Switch to {section === 'overview' ? 'Settings' : 'Overview'}
                </Button>
            </header>

            <section className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 border p-6 rounded-md shadow-sm bg-white">
                {[
                    { label: 'Name', value: subscription.name },
                    { label: 'Symbol', value: subscription.symbol.toUpperCase() },
                    { label: 'Type', value: subscription.type },
                    { label: 'Region', value: subscription.region },
                    { label: 'Currency', value: subscription.currency },
                    { label: 'Subscribers', value: "20" }
                ].map(({ label, value }) => (
                    <div key={label}>
                        <span className="text-sm text-gray-500">{label}</span>
                        <p className="text-lg font-medium capitalize">{value}</p>
                    </div>
                ))}
            </section>

            {section === 'overview' && <Overview subscription={subscription} />}
            {section === 'settings' && <Settings subscription={subscription} />}

        </main>
    );
};

export default Page;
