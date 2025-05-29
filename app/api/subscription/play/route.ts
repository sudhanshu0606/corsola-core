import { NextResponse } from 'next/server';

import { addMinutes } from 'date-fns';
import { formatInTimeZone } from 'date-fns-tz';

import { dbConnect } from '@/connections/db';

import { roundUpToNearest10Minutes } from '@/lib/dateRounding';
import { whisper } from '@/lib/whisper';

import { useSubscriptionModel } from '@/models/subscription';
import { useUserModel } from '@/models/user';

const PRIMARY_MONGO_DB = process.env.PRIMARY_MONGO_DB_NAME as string;
const SECONDARY_MONGO_DB = process.env.SECONDARY_MONGO_DB_NAME as string;

interface IRequestBody {
    uuid: string,
    interval: number,
    startDate: Date
}

export async function PATCH(request: Request) {

    try {

        const { uuid, interval, startDate }: IRequestBody = await request.json();
        if (!uuid || !interval || !startDate) {
            return NextResponse.json(
                { message: 'All fields are required.' },
                { status: 400 }
            );
        }

        await dbConnect(PRIMARY_MONGO_DB);
        await dbConnect(SECONDARY_MONGO_DB);

        const [User, Subscription] = await Promise.all([
            useUserModel(PRIMARY_MONGO_DB),
            useSubscriptionModel(SECONDARY_MONGO_DB)
        ]);

        const userId = request.headers.get('x-user-id');
        if (!userId || typeof userId !== 'string') { return NextResponse.json({}, { status: 401 }) }

        const user = await User.findOne({ uuid: userId });
        if (!user) {
            return NextResponse.json(
                { message: 'Please login again.' },
                { status: 404 }
            );
        }

        const roundedInitialNotificationTime = roundUpToNearest10Minutes(new Date(startDate));
        const initialNotification = formatInTimeZone(roundedInitialNotificationTime, 'Asia/Kolkata', 'dd MMMM yyyy HH:mm');

        const subsequentNotificationBaseTime = addMinutes(roundedInitialNotificationTime, interval);
        const roundedSubsequentNotificationTime = roundUpToNearest10Minutes(subsequentNotificationBaseTime);
        const subsequentNotification = formatInTimeZone(roundedSubsequentNotificationTime, 'Asia/Kolkata', 'dd MMMM yyyy HH:mm');

        const subscription = await Subscription.findOneAndUpdate(
            { uuid, 'subscribers.subscriberId': user.uuid },
            {
                $set: {
                    'subscribers.$.status': 'playing',
                    'subscribers.$.initialNotification': initialNotification,
                    'subscribers.$.subsequentNotification': subsequentNotification,
                }
            },
            { new: true }
        );

        if (!subscription) {
            return NextResponse.json(
                { message: 'No matching subscriber found or no changes made.' },
                { status: 400 }
            );
        }

        return NextResponse.json(
            { message: 'Subscription played successfully.' },
            { status: 200 }
        );

    } catch (error) {

        whisper("Execution Error: ", error);

        return NextResponse.json(
            { message: "Oops! Something went wrong on our end. Please try again later or contact support if the issue persists." },
            { status: 500 }
        )

    }

}
