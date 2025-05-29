"use client"

import React from 'react'

import { SubscriptionCard } from '@/components/cards/subscription'
import { SubscriptionForm } from '@/components/forms/subscribe'
import { Button } from '@/components/ui/button'
import { Modal } from '@/components/wrappers/modal'

import { useSubscriber } from '@/store/subscriber'

import { Plus } from 'lucide-react'

const Page = async () => {

    const { subscriber, setSubscriber } = useSubscriber()

    if (subscriber?.subscriptions && subscriber?.subscriptions.length === 0) {
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
                    <Plus className="h-8 w-8 mb-2" />
                    <p className="text-lg font-medium">No subscriptions found</p>
                    <p className="text-sm">Click “subscribe” to add your first stock notification.</p>
                </section>
            </main>
        )
    }

    return (
        <main className='flex flex-col gap-4'>
            <header className='flex items-center justify-between px-2'>
                <h1 className="text-2xl font-bold capitalize">subscriptions</h1>
                <div>
                    <Modal
                        trigger={<Button className='cursor-pointer'><Plus /><span>subscribe</span></Button>}
                        title='Subscribe'
                        description='Subscribe to a new stock'
                        content={<SubscriptionForm />}
                    />
                </div>
            </header>
            <section className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                {(subscriber?.subscriptions) &&
                    subscriber?.subscriptions.map((subscription) => (
                        <SubscriptionCard
                            key={subscription.uuid}
                            subscription={subscription}
                        />
                    ))
                }
            </section>
        </main>
    )
}

export default Page
