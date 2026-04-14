import { Response } from "express";

export const setRefreshCookie = (res: Response, token: string) => {
    const isProd = process.env.NODE_ENV === 'production';

    res.cookie('refreshToken', token, {
        httpOnly: true,
        secure: isProd,
        sameSite: isProd ? 'none' : 'lax',
        maxAge: 7 * 24 * 60 * 60 * 1000,
        path: '/api/auth'
    })
}

export const clearRefreshCookie = (res: Response) => {
    const isProd = process.env.NODE_ENV === 'production';

    res.clearCookie('refreshToken', {
        httpOnly: true,
        secure: isProd,
        sameSite: isProd ? 'none' : 'lax',
        path: '/api/auth'
    })
}