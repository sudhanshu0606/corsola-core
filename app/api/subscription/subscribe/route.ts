import { NextResponse } from 'next/server';

import { addMinutes } from 'date-fns';
import { formatInTimeZone } from 'date-fns-tz';

import { dbConnect } from '@/connections/db';

import { roundUpToNearest10Minutes } from '@/lib/dateRounding';
import { whisper } from '@/lib/whisper';

import { ISubscriber, useSubscriptionModel } from '@/models/subscription';
import { useUserModel } from '@/models/user';

import { Suggestion as Stock } from '@/types';

const PRIMARY_MONGO_DB = process.env.PRIMARY_MONGO_DB_NAME as string;
const SECONDARY_MONGO_DB = process.env.SECONDARY_MONGO_DB_NAME as string;

interface IRequestBody {
    stock: Stock,
    interval: number,
    firstNotification: Date,
}

export async function POST(request: Request) {

    try {

        const { stock, interval, firstNotification }: IRequestBody = await request.json()
        if (!stock || !interval || !firstNotification) {
            return NextResponse.json(
                { message: "All fields are required" },
                { status: 400 }
            )
        }

        await dbConnect(PRIMARY_MONGO_DB)
        await dbConnect(SECONDARY_MONGO_DB)

        const [User, Subscription] = await Promise.all([
            useUserModel(PRIMARY_MONGO_DB),
            useSubscriptionModel(SECONDARY_MONGO_DB)
        ]);

        const userId = request.headers.get('x-user-id');
        if (!userId || typeof userId !== 'string') { return NextResponse.json({}, { status: 401 }) }

        const user = await User.findOne({ uuid: userId })
        if (!user) {
            return NextResponse.json(
                { message: "Please login again." },
                { status: 404 }
            )
        }

        const roundedInitialNotificationTime = roundUpToNearest10Minutes(new Date(firstNotification));
        const initialNotification = formatInTimeZone(roundedInitialNotificationTime, 'Asia/Kolkata', 'dd MMMM yyyy HH:mm');

        const subsequentNotificationBaseTime = addMinutes(roundedInitialNotificationTime, interval);
        const roundedSubsequentNotificationTime = roundUpToNearest10Minutes(subsequentNotificationBaseTime);
        const subsequentNotification = formatInTimeZone(roundedSubsequentNotificationTime, 'Asia/Kolkata', 'dd MMMM yyyy HH:mm');

        const existingStockSubscription = await Subscription.findOne({ symbol: stock['1. symbol'] })
        if (!existingStockSubscription) {
            const subscription = await Subscription.create({
                symbol: stock['1. symbol'],
                name: stock['2. name'],
                type: stock['3. type'],
                region: stock['4. region'],
                currency: stock['8. currency'],
                subscribers: [{
                    subscriberId: user.uuid,
                    interval,
                    status: "playing",
                    notifications: {
                        email: [user.email],
                    },
                    initialNotification,
                    subsequentNotification
                }]
            })

            if (!subscription) {
                return NextResponse.json(
                    { message: "Subscription failed" },
                    { status: 500 }
                )
            }

            return NextResponse.json(
                { message: `You're now subscribed to ${subscription.name}.` },
                { status: 201 }
            )
        }

        const existingSubscriber = existingStockSubscription.subscribers.find(
            (subscriber: ISubscriber) => subscriber.subscriberId === user.uuid
        )

        if (existingSubscriber) {
            return NextResponse.json(
                { message: "You're already subscribed to this stock." },
                { status: 400 }
            )
        }

        const subscription = await Subscription.findOneAndUpdate(
            { symbol: stock['1. symbol'] },
            {
                $push: {
                    subscribers: {
                        subscriberId: user.uuid,
                        interval,
                        status: "playing",
                        notifications: {
                            email: [user.email],
                        },
                        initialNotification,
                        subsequentNotification,
                    }
                }
            },
            { new: true }
        );

        if (!subscription) {
            return NextResponse.json(
                { message: "Subscription failed" },
                { status: 500 }
            )
        }

        return NextResponse.json(
            { message: `You're now subscribed to ${subscription.name}.` },
            { status: 201 }
        )

    } catch (error) {

        whisper("Execution Error: ", error);

        return NextResponse.json(
            { message: "Oops! Something went wrong on our end. Please try again later or contact support if the issue persists." },
            { status: 500 }
        )

    }

}
