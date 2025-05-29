import { IProfiles } from "@/interfaces/profiles";
import { Regions } from "@/types/regions";

interface IUser {
    uuid: string;
    username: string;
    email: string;
    avatar: string;
    regions: Regions[];
    profiles: IProfiles
}

export type { IUser }