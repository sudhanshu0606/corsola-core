import { ISubscription } from "@/interfaces/subscription";

interface ISubscriber {
    subscriberId: string;
    subscriptions: ISubscription[];
}

export type { ISubscriber };