import { NextResponse } from 'next/server';

import { dbConnect } from '@/connections/db';
import { whisper } from '@/lib/whisper';

import { useSubscriptionModel } from '@/models/subscription';
import { useUserModel } from '@/models/user';

const PRIMARY_MONGO_DB = process.env.PRIMARY_MONGO_DB_NAME as string;
const SECONDARY_MONGO_DB = process.env.SECONDARY_MONGO_DB_NAME as string;

interface IRequestBody { uuid: string }

export async function DELETE(request: Request) {

    try {

        const { uuid }: IRequestBody = await request.json();
        if (!uuid) { return NextResponse.json({}, { status: 400 }) }

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
                { message: "Please login again." },
                { status: 404 }
            );
        }

        const subscription = await Subscription.findOneAndUpdate(
            { uuid },
            { $pull: { subscribers: { subscriberId: user.uuid } } },
            { new: true }
        );

        if (!subscription) {
            return NextResponse.json(
                { message: "Unsubscribe failed." },
                { status: 500 }
            );
        }

        return NextResponse.json(
            { message: `You've been unsubscribed from ${subscription.name}.` },
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
