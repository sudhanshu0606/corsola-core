import {
    jwtVerify,
    JWTVerifyResult,
    errors as JoseErrors
} from "jose";

import { whisper } from "@/lib/whisper";

interface MyTokenPayload { userId: string }

function isMyTokenPayload(payload: any): payload is MyTokenPayload {
    return typeof payload?.userId === "string";
}

type TokenVerifyResult =
    | { decoded: MyTokenPayload; error?: undefined }
    | { decoded?: undefined; error: { message: string; status: number } };

const verifyToken = async (token: string, secret: string): Promise<TokenVerifyResult> => {

    const encoder = new TextEncoder();

    try {

        if (!token) {
            return {
                error: {
                    message: "No token provided. Please log in again.",
                    status: 401,
                },
            };
        }

        const { payload }: JWTVerifyResult = await jwtVerify(token, encoder.encode(secret));
        
        if (!isMyTokenPayload(payload)) {
            return {
                error: {
                    message: "Oops! We seem to have run into a problem while logging you in. Please try again shortly.",
                    status: 400,
                },
            };
        }

        return { decoded: payload };

    } catch (error) {

        if (error instanceof JoseErrors.JWTClaimValidationFailed) {
            whisper("JWTClaimValidationFailed:", error);
            return {
                error: {
                    message: "Your login session isn't valid yet or has invalid claims.",
                    status: 401,
                },
            };
        }

        if (error instanceof JoseErrors.JWTExpired) {
            whisper("JWTExpired:", error);
            return {
                error: {
                    message: "Your session has timed out. Please try logging in again.",
                    status: 401,
                },
            };
        }

        if (error instanceof JoseErrors.JOSEError) {
            whisper("JOSEError:", error);
            return {
                error: {
                    message: "We couldn't verify your login. Please try logging in again.",
                    status: 401,
                },
            };
        }

        whisper("Unexpected error during token verification:", error);
        return {
            error: {
                message: "Oops! Something went wrong on our end. Please try again later or contact support if the issue persists.",
                status: 500,
            },
        };

    }

}

export { verifyToken };