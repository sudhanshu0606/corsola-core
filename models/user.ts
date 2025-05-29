import { Connection, Document, Schema } from 'mongoose';
import { createId } from '@paralleldrive/cuid2';

import { dbConnect } from '@/connections/db';

import { IProfiles } from '@/interfaces';
import { Regions } from '@/types';

interface IUser extends Document {
    _id: string;
    uuid: string;
    username: string;
    email: string;
    avatar: string;
    password: string;
    verified: boolean;
    resets: number;
    regions: Regions[];
    profiles: IProfiles
}

const UserSchema = new Schema<IUser>({

    uuid: {
        type: String,
        default: createId,
        required: true,
        unique: true,
    },

    username: {
        type: String,
        required: true,
        unique: true
    },

    email: {
        type: String,
        required: true,
        unique: true
    },

    avatar: {
        type: String,
        default: "https://ui.shadcn.com/avatars/shadcn.jpg"
    },

    password: {
        type: String,
        required: true
    },

    verified: {
        type: Boolean,
        default: false
    },


    resets: {
        type: Number,
        default: 0
    },

    regions: {
        type: [String],
        enum: ["Frankfurt", "India/Bombay", "Paris", "Shanghai", "Toronto", "United Kingdom", "United States"],
        default: ["India/Bombay"],
    },

    profiles: {
        type: Object,
        default: () => ({
            email: [],
            sms: [],
            call: [],
            voicemail: [],
            whatsapp: [],
            telegram: [],
            signal: [],
            viber: [],
            messenger: [],
            wechat: [],
            line: [],
            slack: [],
            microsoftTeams: [],
            discord: [],
            facebook: [],
            instagram: [],
            twitter: [],
            linkedin: [],
            threads: [],
        }),
    }

});

const useUserModel = async (dbName: string) => {
    const connection: Connection = await dbConnect(dbName);
    return connection.model<IUser>("User", UserSchema);
};

export type { IUser };
export { useUserModel };