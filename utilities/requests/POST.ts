import axios from "axios";
import { toast } from "sonner";

import { whisper } from "@/lib/whisper";
import { useVariablesStore } from "@/store/variables";

import { IMessages } from "@/interfaces";

const DOMAIN = process.env.DOMAIN as string;

axios.defaults.baseURL = DOMAIN;

interface IPostOptions {
    headers?: Record<string, string>;
    params?: Record<string, any>;
}

const POST = async (
    route: string,
    data: any,
    options: IPostOptions = {},
    messages: IMessages = {}
) => {

    const { connectivity } = useVariablesStore.getState().variables ?? {};
    if (connectivity === "offline") {
        toast.error("You are currently offline. Please check your connection and try again.");
        whisper("Request Error: ", "Offline");
        return;
    }

    try {

        const response = toast.promise(
            
            axios.post(route, data, {
                headers: {
                    'Content-Type': 'application/json',
                    ...options.headers,
                },
                params: options.params,
            }),
            
            {
                loading: messages.loading || "Loading ...",
                success: (response) => response?.data?.message || messages.success || "Success!",
                error: (error) => error?.response?.data?.message || messages.error || "Sorry, something went wrong while processing your request.",
            }
        
        );

        return response;

    } catch (error) {

        whisper("Request Error: ", error);

        const err = axios.isAxiosError(error)
            ? error?.response?.data?.message || "Sorry, something went wrong while processing your request."
            : "Oops! We couldn't complete your request right now. Please check your connection or try again later.";

        toast.error(err);

    }

}

export { POST }
