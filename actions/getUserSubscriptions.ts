"use server";

import { dbConnect } from '@/connections/db';
import { whisper } from '@/lib/whisper';

import { useSubscriptionModel } from '@/models/subscription';
import { useUserModel } from '@/models/user';

import { ISubscription } from '@/interfaces';

const PRIMARY_MONGO_DB = process.env.PRIMARY_MONGO_DB_NAME as string;
const SECONDARY_MONGO_DB = process.env.SECONDARY_MONGO_DB_NAME as string;

const getUserSubscriptions = async (userId: string): Promise<
    { subscriptions?: ISubscription[]; error?: string }
> => {

    try {

        if (!userId || typeof userId !== 'string') { return { error: 'Invalid UUID' } }

        await dbConnect(PRIMARY_MONGO_DB)
        await dbConnect(SECONDARY_MONGO_DB)

        const User = await useUserModel(PRIMARY_MONGO_DB)
        const Subscription = await useSubscriptionModel(SECONDARY_MONGO_DB)

        const user = await User.findOne({ uuid: userId })
        if (!user) { return { error: 'User not found. Please register first.' } }

        const subscriptions = await Subscription.find({
            'subscribers.subscriberId': user.uuid
        }).lean();

        const userSubscriptions = subscriptions.flatMap(subscription => {
            return subscription.subscribers
                .filter(subscriber => subscriber.subscriberId === user.uuid)
                .map(subscriber => ({
                    uuid: subscription.uuid,
                    symbol: subscription.symbol,
                    name: subscription.name,
                    type: subscription.type,
                    region: subscription.region,
                    currency: subscription.currency,
                    interval: subscriber.interval.toString(),
                    status: subscriber.status,
                    notifications: subscriber.notifications,
                    firstNotification: subscriber.initialNotification,
                    subsequentNotification: subscriber.subsequentNotification
                }));
        });

        return { subscriptions: userSubscriptions };

    } catch (error) {

        whisper('Action Error:', error);
        return { error: 'Oops! Something went wrong on our end. Please try again later or contact support if the issue persists.' };

    }

}

export { getUserSubscriptions }