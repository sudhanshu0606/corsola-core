import { NextResponse } from "next/server";

import { dbConnect } from "@/connections/db";
import { whisper } from "@/lib/whisper";
import { useUserModel } from "@/models/user";

const PRIMARY_MONGO_DB = process.env.PRIMARY_MONGO_DB_NAME as string;

export async function GET(request: Request) {

    try {

        const userId = request.headers.get("x-user-id");
        if (!userId || typeof userId !== "string") { return NextResponse.json({}, { status: 400 }) }

        await dbConnect(PRIMARY_MONGO_DB);

        const User = await useUserModel(PRIMARY_MONGO_DB)

        const user = await User.findOne({ uuid: userId });
        if (!user) { return NextResponse.json({}, { status: 401 }) }

        return NextResponse.json({ user }, { status: 200 })

    } catch (error) {

        whisper("Execution Error: ", error);

        return NextResponse.json(
            { message: "Oops! Something went wrong on our end. Please try again later or contact support if the issue persists." },
            { status: 500 }
        )

    }

}


