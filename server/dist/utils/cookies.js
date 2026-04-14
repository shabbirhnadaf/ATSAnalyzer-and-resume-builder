"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.clearRefreshCookie = exports.setRefreshCookie = void 0;
const setRefreshCookie = (res, token) => {
    const isProd = process.env.NODE_ENV === 'production';
    res.cookie('refreshToken', token, {
        httpOnly: true,
        secure: isProd,
        sameSite: isProd ? 'none' : 'lax',
        maxAge: 7 * 24 * 60 * 60 * 1000,
        path: '/api/auth'
    });
};
exports.setRefreshCookie = setRefreshCookie;
const clearRefreshCookie = (res) => {
    const isProd = process.env.NODE_ENV === 'production';
    res.clearCookie('refreshToken', {
        httpOnly: true,
        secure: isProd,
        sameSite: isProd ? 'none' : 'lax',
        path: '/api/auth'
    });
};
exports.clearRefreshCookie = clearRefreshCookie;
