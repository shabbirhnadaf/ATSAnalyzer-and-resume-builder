"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.me = exports.logout = exports.refresh = exports.login = exports.register = void 0;
const User_1 = __importDefault(require("../models/User"));
const api_1 = require("../utils/api");
const cookies_1 = require("../utils/cookies");
const tokens_1 = require("../utils/tokens");
const register = async (req, res) => {
    const { email, name, password } = req.body;
    const exist = await User_1.default.findOne({ email });
    if (exist)
        return res.status(409).json((0, api_1.fail)('Email already registered'));
    const user = await User_1.default.create({ name, email, password });
    const accessToken = (0, tokens_1.generateAccessToken)(user.id);
    const refreshToken = (0, tokens_1.generateRefreshToken)(user.id);
    (0, cookies_1.setRefreshCookie)(res, refreshToken);
    res.status(201).json((0, api_1.success)({
        user: {
            id: user.id,
            name: user.name,
            email: user.email,
            selectedTemplate: user.selectedTemplate
        },
        accessToken,
    }, 'User registered successfully'));
};
exports.register = register;
const login = async (req, res) => {
    const { email, password } = req.body;
    const user = await User_1.default.findOne({ email });
    if (!user || !(await user.comparePassword(password))) {
        return res.status(401).json((0, api_1.fail)('Invalid credentials'));
    }
    const accessToken = (0, tokens_1.generateAccessToken)(user.id);
    const refreshToken = (0, tokens_1.generateRefreshToken)(user.id);
    (0, cookies_1.setRefreshCookie)(res, refreshToken);
    res.json((0, api_1.success)({
        user: {
            id: user.id,
            name: user.name,
            email: user.email,
            selectedTemplate: user.selectedTemplate,
        },
        accessToken,
    }, 'Logged in successfully'));
};
exports.login = login;
const refresh = async (req, res) => {
    const token = req.cookies.refreshToken;
    if (!token)
        return res.status(401).json((0, api_1.fail)('Refresh token missing'));
    try {
        const decoded = (0, tokens_1.verifyToken)(token);
        const user = await User_1.default.findById(decoded.id).select('-password');
        if (!user)
            return res.status(401).json((0, api_1.fail)('User not found'));
        const accessToken = (0, tokens_1.generateAccessToken)(user.id);
        const refreshToken = (0, tokens_1.generateRefreshToken)(user.id);
        (0, cookies_1.setRefreshCookie)(res, refreshToken);
        res.json((0, api_1.success)({
            user,
            accessToken
        }, 'Token refreshed successfully'));
    }
    catch (error) {
        return res.status(401).json((0, api_1.fail)('Inavlid or expired refreshToken'));
    }
};
exports.refresh = refresh;
const logout = async (req, res) => {
    (0, cookies_1.clearRefreshCookie)(res);
    res.json((0, api_1.success)(null, 'Logged out successfully'));
};
exports.logout = logout;
const me = async (req, res) => {
    const user = await User_1.default.findById(req.user?.id).select('-password');
    if (!user)
        return res.status(404).json((0, api_1.fail)('User not found'));
    res.json((0, api_1.success)(user, 'Current user fetched'));
};
exports.me = me;
