import { IProfiles } from "@/interfaces";

interface ISubscription {
    uuid: string;
    symbol: string;
    name: string;
    type: string;
    region: string;
    currency: string;
    interval: string;
    status: "paused" | "playing";
    notifications: IProfiles;
    firstNotification: string;
    subsequentNotification: string;
}

export type { ISubscription };