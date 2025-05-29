"use client"

import React, { useEffect, useMemo } from 'react'

import { isEqual } from 'lodash'

import { PauseForm } from '@/components/forms/pause';
import { PlayForm } from '@/components/forms/play';
import { UnsubscriptionForm } from '@/components/forms/unsubscribe';

import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';

import { Modal } from '@/components/wrappers/modal';

import { useNotificationsStore } from '@/store/notifications';
import { useUser } from '@/store/user';

import { channelGroups, formatChannel } from '@/constants';
import { IProfiles, ISubscription } from '@/interfaces';
import { usePathname } from 'next/navigation';
import { useSubscriber } from '@/store/subscriber';
import { useSessionStorage } from '@/store/storage';

interface ISettingsProps { subscription: ISubscription }

const Settings = ({ subscription }: ISettingsProps) => {

    const pathname = usePathname();
    const uuid = useMemo(() => pathname.split('/')[2], [pathname]);

    const { subscriber } = useSubscriber();

    const subs: ISubscription | null = useMemo(() => {
        return subscriber?.subscriptions?.find(sub => sub.uuid === uuid) || null;
    }, [subscriber?.subscriptions, uuid]);

    const {
        setSubscription,
        enabledChannel,
        toggleChannel,
        enabledProfiles,
        toggleProfile,
        save
    } = useNotificationsStore();
    const { user, setUser } = useUser()

    const { electron } = useSessionStorage()

    useEffect(() => {
        setSubscription(subscription);
    }, [subscription]);

    console.log(enabledProfiles)

    return (
        <section className='flex flex-col gap-4'>

            <section className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 border p-6 rounded-md shadow-sm bg-white">
                {[
                    { label: 'Interval', value: subscription.interval },
                    { label: 'Status', value: subscription.status },
                    { label: 'First Notification', value: subscription.firstNotification },
                    { label: 'Subsequent Notification', value: subscription.subsequentNotification },
                ].map(({ label, value }) => (
                    <div key={label}>
                        <span className="text-sm text-gray-500">{label}</span>
                        <p className="text-lg font-medium capitalize">{value}</p>
                    </div>
                ))}
            </section>

            <section className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 border p-6 rounded-md shadow-sm bg-white">
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
                <Modal
                    title="Unsubscribe from stock"
                    description="If you unsubscribe, you will no longer receive price notifications of stock."
                    trigger={<Button>Unsubscribe</Button>}
                    content={
                        <UnsubscriptionForm
                            stock={subscription.name}
                            uuid={subscription.uuid}
                        />
                    }
                />
            </section>

            <section className="border p-6 rounded-md shadow-sm bg-gray-50 space-y-6">

                <div className='flex flex-col gap-2 ml-2'>
                    <h2 className="text-2xl font-semibold text-gray-900 poppins-regular">Notifications</h2>
                    <span className="text-sm text-gray-600">Choose how you'd like to receive notifications</span>
                </div>

                {Object.entries(channelGroups).map(([groupLabel, channels]) => (
                    <div key={groupLabel} className="space-y-2">
                        <h3 className="text-lg font-medium text-gray-800 ml-2">{groupLabel}</h3>
                        <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4'>
                            {channels.map(channel => (
                                <div key={channel} className='border rounded-md p-4 bg-white shadow-sm flex flex-col justify-center gap-2'>
                                    <div className="flex justify-between items-center">
                                        <Label className='ml-2'>
                                            <Label>{formatChannel(channel)}</Label>
                                        </Label>
                                        <input
                                            type="checkbox"
                                            checked={!!enabledChannel[channel]}
                                            onChange={() => toggleChannel(channel)}
                                            className="w-5 h-5 accent-blue-600"
                                        />
                                    </div>

                                    {enabledChannel[channel] && (
                                        <Modal
                                            trigger={<Button className="whitespace-normal break-words text-left">Select profiles</Button>}
                                            title='Edit Notification Preferences'
                                            description={`Manage your ${channel} notification preferences`}
                                            content={
                                                <div className="space-y-2">
                                                    {user?.profiles && user.profiles[channel as keyof IProfiles]?.length ? (
                                                        user.profiles[channel as keyof IProfiles]?.map((profile, index) => {
                                                            const isEnabled = enabledProfiles[channel as keyof IProfiles]?.includes(profile)

                                                            return (
                                                                <div
                                                                    key={index}
                                                                    onClick={() => toggleProfile(channel as keyof IProfiles, profile)}
                                                                    className={`p-3 border rounded cursor-pointer flex justify-between items-center transition-colors ${isEnabled
                                                                        ? 'bg-blue-50 border-blue-400'
                                                                        : 'bg-red-50 border-red-300 hover:bg-red-100'
                                                                        }`}
                                                                >
                                                                    <span className="text-gray-800">{profile}</span>
                                                                    <div className='flex items-center gap-2'>
                                                                        <Label htmlFor={`${channel}-${profile}`} className="text-sm text-gray-700">
                                                                            {isEnabled ? 'Enabled' : 'Disabled'}
                                                                        </Label>
                                                                        <Switch
                                                                            checked={isEnabled}
                                                                            // onClick={() => toggleProfile(channel as keyof IProfiles, profile)}
                                                                            onCheckedChange={() => toggleProfile(channel as keyof IProfiles, profile)}
                                                                            id={`${channel}-${profile}`}
                                                                        />
                                                                    </div>
                                                                </div>
                                                            );
                                                        })
                                                    ) : (<div className="text-sm text-gray-500">No profiles available for {channel}.</div>)}
                                                </div>
                                            }
                                        />
                                    )}
                                </div>
                            ))}
                        </div>
                    </div>
                ))}
                <div>
                    {/* <p className="text-sm text-gray-500">
                        Note: You can manage your profiles in the <span className="font-semibold">Profile</span> section.
                    </p> */}
                    {!isEqual(enabledProfiles, subs?.notifications) && <Button onClick={() => save(electron)}>Save Changes</Button>}
                </div>
            </section>

        </section>
    )
}

export default Settings