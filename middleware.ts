import { NextResponse } from 'next/server';

import { verifyToken } from '@/helpers/verify-token';

const JWT_SECRET = process.env.JWT_SECRET as string;

export async function middleware(request: Request) {

    const origin = request.headers.get('origin') || '*';

    if (request.method === 'OPTIONS') {

        const preflightHeaders = new Headers();

        preflightHeaders.set('Access-Control-Allow-Origin', origin);
        preflightHeaders.set('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
        preflightHeaders.set('Access-Control-Allow-Headers', 'Content-Type, Authorization');

        return new NextResponse(null, { status: 204, headers: preflightHeaders });

    }

    const authorizationHeader = request.headers.get("Authorization");
    if (!authorizationHeader || !authorizationHeader.startsWith('Bearer ')) {
        return NextResponse.json({}, { status: 401 })
    }

    const token = authorizationHeader.split(' ')[1];
    if (!token) { return NextResponse.json({}, { status: 401 }) }

    const { decoded, error } = await verifyToken(token, JWT_SECRET);
    if (error) {
        return NextResponse.json(
            { message: error.message },
            { status: error.status }
        )
    }

    const response = NextResponse.next();

    response.headers.set('x-user-id', decoded.userId);

    response.headers.set('Access-Control-Allow-Origin', origin);
    response.headers.set('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
    response.headers.set('Access-Control-Allow-Headers', 'Content-Type, Authorization');

    return response;

}

export const config = {
    matcher: '/api/:path*',
};
