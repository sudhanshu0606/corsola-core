import React from 'react';
import Link from 'next/link';

import { ISubscription } from '@/interfaces';

import { Button } from '@/components/ui/button';

import { PauseForm } from '@/components/forms/pause';
import { PlayForm } from '@/components/forms/play';
import { UnsubscriptionForm } from '@/components/forms/unsubscribe';

import { Modal } from '@/components/wrappers/modal';

import {
    ArrowDownUp,
    Trash2
} from 'lucide-react';

interface ISubscriptionCardProps { subscription: ISubscription }

const SubscriptionCard: React.FC<ISubscriptionCardProps> = ({ subscription }) => {

    return (
        <section className="rounded-xl border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900 shadow-sm hover:shadow-md transition-all duration-200 p-4 h-full">

            <div className="flex items-center justify-between mb-4">
                <div className='flex flex-col justify-center'>
                    <h2 className="text-xl font-bold text-gray-900 dark:text-gray-100">{subscription.symbol}</h2>
                    <h4 className='text-xs font-medium'>{subscription.name}</h4>
                </div>
                <div className="flex items-center gap-1">
                    {subscription?.status === 'paused' && (
                        <span className="inline-block text-xs px-3 py-1 rounded-full bg-yellow-100 dark:bg-yellow-800 text-yellow-700 dark:text-yellow-200">Paused</span>
                    )}
                    {subscription?.status === 'playing' && (
                        <span className="text-xs px-3 py-1 rounded-full bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400">
                            Every {subscription.interval} mins
                        </span>
                    )}
                    <Button
                        variant="ghost"
                        size="icon"
                        className="p-1 h-8 w-8 rounded-full"
                    >
                        <ArrowDownUp />
                    </Button>
                    <Modal
                        title="Unsubscribe from stock"
                        description="If you unsubscribe, you will no longer receive price notifications of stock."
                        trigger={
                            <Button
                                variant="ghost"
                                size="icon"
                                className="p-1 h-8 w-8 rounded-full hover:bg-red-400 hover:text-white cursor-pointer"
                            >
                                <Trash2 />
                            </Button>
                        }
                        content={
                            <UnsubscriptionForm
                                stock={subscription.name}
                                uuid={subscription.uuid}
                            />
                        }
                    />
                </div>
            </div>

            {subscription?.status === 'playing' && (
                <div className="space-y-2 text-sm text-gray-600 dark:text-gray-300 mb-4">
                    <div className="flex justify-between items-center">
                        <span className="font-medium">First Notification :</span>
                        <span>{subscription.firstNotification}</span>
                    </div>
                    <div className="flex justify-between items-center">
                        <span className="font-medium">Next Notification :</span>
                        <span>{subscription.subsequentNotification}</span>
                    </div>

                </div>
            )}

            {subscription?.status === 'paused' && (
                <div className="space-y-2 text-sm text-gray-600 dark:text-gray-300 mb-4 border">
                    <div className="flex justify-between items-center">
                        <span className="font-medium">Resumes From :</span>
                        <span>{subscription.firstNotification}</span>
                    </div>
                </div>
            )}

            <div className='flex justify-center items-center gap-4 px-1'>
                <Link href={`/subscriptions/${subscription.uuid}`} className="cursor-pointer w-1/2">
                    <Button variant="outline" className="cursor-pointer">
                        Manage Subscription
                    </Button>
                </Link>
                {subscription?.status === 'paused' && (
                    <Modal
                        title='Play Subscription'
                        description={`If you play your subscription, you will start receiving notifications of ${subscription.name} again.`}
                        trigger={<Button className='cursor-pointer w-1/2'><span>Play subscription</span></Button>}
                        content={
                            <PlayForm
                                stock={subscription.name}
                                interval={subscription.interval}
                                uuid={subscription.uuid}
                            />
                        }
                    />
                )}
                {subscription?.status === 'playing' && (
                    <Modal
                        title='Pause Subscription'
                        description={`If you pause your subscription, you will not receive any notifications of ${subscription.name} until you resume it.`}
                        trigger={<Button className='cursor-pointer w-1/2'><span>Pause subscription</span></Button>}
                        content={
                            <PauseForm
                                stock={subscription.name}
                                interval={subscription.interval}
                                uuid={subscription.uuid}
                            />
                        }
                    />
                )}
            </div>

        </section>
    );
};

export { SubscriptionCard }